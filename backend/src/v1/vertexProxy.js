import { GoogleAuth } from 'google-auth-library';

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
const LOCATION = process.env.VERTEX_LOCATION || 'us-central1';
const MODEL_ENV = process.env.VERTEX_MODEL || 'gemini-1.5-flash';

class VertexError extends Error {
  constructor(message, code, info) { super(message); this.code = code; this.info = info; }
}

function buildModelResource() {
  if (!PROJECT) throw new VertexError('Missing GOOGLE_CLOUD_PROJECT', 'config', {});
  if (MODEL_ENV.startsWith('projects/')) return MODEL_ENV;
  if (MODEL_ENV.includes('/publishers/')) return MODEL_ENV;
  return `projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${MODEL_ENV}`;
}

export async function vertexGenerate({ systemPrompt, personaPrefix, turns }){
  const rid = Math.random().toString(36).slice(2, 10);
  const modelRes = buildModelResource();
  const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/${modelRes}:generateContent`;
  if (systemPrompt && typeof systemPrompt !== 'string') throw new VertexError('systemPrompt must be string', 'input', {});
  if (personaPrefix && typeof personaPrefix !== 'string') throw new VertexError('personaPrefix must be string', 'input', {});
  const safeTurns = Array.isArray(turns) ? turns.slice(-2).filter(t=>t && typeof t.content==='string' && (t.role==='user'||t.role==='assistant')) : [];
  const contents = [];
  if (systemPrompt) contents.push({ role:'system', parts:[{ text: systemPrompt }] });
  if (personaPrefix) contents.push({ role:'user', parts:[{ text: personaPrefix }] });
  safeTurns.forEach(t=> contents.push({ role: t.role==='assistant'?'model':'user', parts:[{ text: t.content }] }));
  const body = { contents };
  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const headers = await client.getRequestHeaders();
  try {
    const started = Date.now();
    const res = await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json', ...headers }, body: JSON.stringify(body) });
    const latency = Date.now() - started;
    if (!res.ok) {
      const text = await res.text().catch(()=> '');
      console.error('vertex.error', { rid, status: res.status, latency, bodyLen: (text||'').length });
      throw new VertexError(`Vertex HTTP ${res.status}`, 'http', { status: res.status });
    }
    const json = await res.json();
    const cands = json && json.candidates;
    const parts = cands && cands[0] && cands[0].content && cands[0].content.parts;
    const merged = Array.isArray(parts) ? parts.map(p=>p && typeof p.text==='string' ? p.text : '').join(' ').trim() : '';
    if (!merged) {
      console.warn('vertex.empty', { rid, latency });
      throw new VertexError('Empty Vertex response', 'empty', {});
    }
    console.log('vertex.ok', { rid, latency, chars: merged.length });
    return { text: merged };
  } catch (e) {
    if (e instanceof VertexError) throw e;
    console.error('vertex.exception', { rid, message: e?.message });
    throw new VertexError('Vertex call failed', 'exception', {});
  }
}
