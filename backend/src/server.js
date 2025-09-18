import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { personas } from "./personas.js";
import { detectCrisisSignals, crisisSafetyOverlay } from "./crisis.js";
import { naiveClassify } from "./v1/classifier.js";
import { getWellnessForUser } from "./v1/wellness.js";
import { triageHandler, getAdminEscalations } from "./v1/triage.js";
import { vertexGenerate } from "./v1/vertexProxy.js";
import { requireAuth, getDb, isAuthReady } from "./auth.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_API_KEY in .env");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL = process.env.GOOGLE_MODEL || "gemini-1.5-flash";

const ChatBody = z.object({
  persona: z.enum(["arjuna", "maya"]),
  messages: z.array(
    z.object({ role: z.enum(["user", "assistant"]).default("user"), content: z.string().max(4096) })
  ),
});

const CommunityBody = z.object({
  text: z.string().min(1).max(500),
});

const memoryPosts = [];

function buildSystemPrompt(key) {
  const p = personas[key];
  return `${p.system}\nGuidelines: \n- Keep responses under 150 words.\n- Use plain language suitable for ages 13-21.\n- Offer 1-3 actionable next steps.\n- If crisis risk is present, prioritize safety resources and encourage seeking help.`;
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// If Firebase not configured, allow unauthenticated prototype mode
const optionalAuth = (handler) => async (req, res) => {
  if (isAuthReady()) {
    return requireAuth(req, res, () => handler(req, res));
  }
  return handler(req, res);
};

app.post("/api/chat", optionalAuth(async (req, res) => {
  try {
    const { persona, messages } = ChatBody.parse(req.body);

    const userText = messages.filter(m => m.role === "user").map(m => m.content).join("\n");
    const crisis = detectCrisisSignals(userText);

    const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction: buildSystemPrompt(persona) });

    const history = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history: history.slice(0, -1) });

    const last = messages[messages.length - 1];
    const prompt = last?.role === "user" ? last.content : "Please respond empathetically and concisely.";
    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    const overlay = crisis.triggered ? `\n\n${crisisSafetyOverlay(personas[persona].name)}` : "";

    // Persist chat if authenticated and Firestore available
    try {
      if (req.user && isAuthReady()) {
        const db = getDb();
        const uid = req.user.uid;
        await db
          .collection("users").doc(uid)
          .collection("chats").add({
            ts: Date.now(),
            persona,
            messages,
            response: text,
            crisis,
          });
      }
    } catch (persistErr) {
      console.warn("Chat persist warning:", persistErr.message);
    }

    res.json({ text: text + overlay, crisis });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || "Invalid request" });
  }
}));

// Trigger routes
app.post("/api/triggers/online", (req, res) => {
  // Example payload: { screenTime: {...}, socialSignals: {...} }
  res.json({ ok: true });
});

app.post("/api/triggers/offline", (req, res) => {
  // Example payload from Google Health Connect or Fitness API webhook
  res.json({ ok: true });
});

app.post("/api/triggers/questionnaire", optionalAuth(async (req, res) => {
  // Example payload: { phq9: {...}, gad7: {...} }
  try {
    if (req.user && isAuthReady()) {
      const db = getDb();
      const uid = req.user.uid;
      await db.collection("users").doc(uid).collection("questionnaires").add({ ts: Date.now(), body: req.body });
    }
  } catch (e) {
    console.warn("Questionnaire persist warning:", e.message);
  }
  res.json({ ok: true });
}));

// Journal endpoints
app.post("/api/journal", optionalAuth(async (req, res) => {
  const { text } = req.body || {};
  if (!text || text.length > 5000) return res.status(400).json({ error: "Invalid journal text" });
  try {
    if (req.user && isAuthReady()) {
      const db = getDb();
      const uid = req.user.uid;
      const ref = await db.collection("users").doc(uid).collection("journals").add({ ts: Date.now(), text });
      return res.json({ ok: true, id: ref.id });
    } else {
      // Prototype mode: no persistence
      return res.json({ ok: true });
    }
  } catch (e) {
    return res.status(500).json({ error: "Failed to save journal" });
  }
}));

// Community feed (cloud-backed with in-memory fallback)
app.get("/api/community", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "20", 10) || 20, 100);
  try {
    if (isAuthReady()) {
      const db = getDb();
      const snap = await db.collection("community_posts").orderBy("ts", "desc").limit(limit).get();
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return res.json({ items });
    } else {
      const items = memoryPosts.slice(-limit).reverse();
      return res.json({ items });
    }
  } catch (e) {
    console.error("Community list error", e);
    return res.status(500).json({ error: "Failed to list posts" });
  }
});

app.post("/api/community", optionalAuth(async (req, res) => {
  try {
    const { text } = CommunityBody.parse(req.body);
    const doc = { ts: Date.now(), text, uid: req.user?.uid || null };
    if (isAuthReady()) {
      const db = getDb();
      const ref = await db.collection("community_posts").add(doc);
      return res.json({ ok: true, id: ref.id });
    } else {
      memoryPosts.push({ id: String(memoryPosts.length + 1), ...doc });
      if (memoryPosts.length > 200) memoryPosts.shift();
      return res.json({ ok: true });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message || "Invalid post" });
  }
}));

// v1 API
app.post("/v1/messages", async (req, res) => {
  const rid = Math.random().toString(36).slice(2,10);
  try{
    const { persona = "arjuna", messages = [] } = req.body || {};
    if (!['arjuna','maya'].includes(persona)) return res.status(400).json({ error:'invalid persona' });
    if (!Array.isArray(messages) || messages.some(m=>!m || typeof m.content!=='string' || !['user','assistant'].includes(m.role))) {
      return res.status(400).json({ error:'invalid messages' });
    }
    const text = messages.map(m=>m.content||"").join("\n");
    const classification = naiveClassify(text);
    let reply;
    try {
      if (process.env.USE_VERTEX === '1') {
        const sys = buildSystemPrompt(persona);
        const prefix = `Persona: ${personas[persona].name}`;
        const v = await vertexGenerate({ systemPrompt: sys, personaPrefix: prefix, turns: messages });
        reply = v.text;
      } else {
        const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction: buildSystemPrompt(persona) });
        const history = messages.slice(0, -1).map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
        const chat = model.startChat({ history });
        const last = messages[messages.length - 1];
        const prompt = last?.role === "user" ? last.content : "Please respond empathetically and concisely.";
        const result = await chat.sendMessage(prompt);
        reply = result.response.text();
      }
    } catch (e) {
      console.warn('messages.vertex_fallback', { rid, reason: e?.message });
      // fallback to Gemini if Vertex fails
      const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction: buildSystemPrompt(persona) });
      const history = messages.slice(0, -1).map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
      const chat = model.startChat({ history });
      const last = messages[messages.length - 1];
      const prompt = last?.role === "user" ? last.content : "Please respond empathetically and concisely.";
      const result = await chat.sendMessage(prompt);
      reply = result.response.text();
    }
    if (typeof reply !== 'string' || reply.length < 1) throw new Error('Bad reply');
    console.log('messages.ok', { rid, persona, len: reply.length, label: classification.label });
    res.json({ reply, classification });
  }catch(e){
    console.error('messages.error', { rid, message: e?.message });
    res.status(400).json({ error: e.message || 'Invalid request' });
  }
});

app.post("/v1/triage", async (req, res)=>{
  try{ const out = await triageHandler(req.body||{}); res.json(out); }
  catch(e){ res.status(500).json({ error:'triage failed' }); }
});

app.get("/v1/wellness/:userId", async (req, res)=>{
  try{ const data = await getWellnessForUser(req.params.userId); res.json(data); }
  catch(e){ res.status(500).json({ error:'failed' }); }
});

app.get("/v1/admin/escalations", async (req, res)=>{
  try{ const items = await getAdminEscalations(100); res.json({ items }); }
  catch(e){ res.status(500).json({ error:'failed' }); }
});

function startServer(port, attempt = 0, maxAttempts = 5) {
  const server = app.listen(port, () => {
    console.log(`MindSpace backend running on :${port}`);
  });
  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE" && attempt < maxAttempts) {
      const nextPort = port + 1;
      console.warn(`Port ${port} in use; trying ${nextPort}...`);
      startServer(nextPort, attempt + 1, maxAttempts);
    } else {
      console.error("Failed to bind port:", err?.message || err);
      console.error("Tip: free the port with 'lsof -ti :" + port + " | xargs kill -9' or set PORT in .env");
      process.exit(1);
    }
  });
}

startServer(PORT);
