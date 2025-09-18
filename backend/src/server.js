import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { personas } from "./personas.js";
import { detectCrisisSignals, crisisSafetyOverlay } from "./crisis.js";
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
