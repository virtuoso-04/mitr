import { getDb, isAuthReady } from "../auth.js";
import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub();
const TOPIC = process.env.PUBSUB_TOPIC || "mindspace-events";

export async function triageHandler(body){
  const event = { ts: Date.now(), type: body?.type || "unknown", severity: body?.severity || "low", meta: body?.meta || {} };
  try{
    if(isAuthReady()){
      const db = getDb();
      await db.collection("escalations").add(event);
    }
  }catch(e){ /* ignore in prototype mode */ }
  try{
    await pubsub.topic(TOPIC).publishMessage({ json: { kind:"triage", ...event } });
  }catch(e){ /* allow local dev without Pub/Sub */ }
  return { ok:true };
}

export async function getAdminEscalations(limit=50){
  try{
    if(!isAuthReady()) return [];
    const db = getDb();
    const snap = await db.collection("escalations").orderBy("ts","desc").limit(limit).get();
    return snap.docs.map(d=>({ id:d.id, ...d.data() }));
  }catch(e){ return []; }
}
