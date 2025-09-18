import { getDb, isAuthReady } from "../auth.js";

export async function getWellnessForUser(userId) {
  // Aggregate recent moods & journal counts; return simple score/metrics
  const out = { score: 75, checkins: 0, journals: 0, streak: 0, trend: [] };
  try {
    if (!isAuthReady()) return out;
    const db = getDb();
    const moodSnap = await db.collection("users").doc(userId).collection("moods").orderBy("ts","desc").limit(50).get();
    const journalSnap = await db.collection("users").doc(userId).collection("journals").orderBy("ts","desc").limit(50).get();
    const moods = moodSnap.docs.map(d=>d.data());
    const journals = journalSnap.docs.map(d=>d.data());
    out.checkins = moods.length;
    out.journals = journals.length;
    const recent = moods.slice(0,10);
    const moodAvg = recent.length ? recent.reduce((s,m)=> s + (m.mood||3), 0) / recent.length : 3;
    out.score = Math.round((moodAvg/5)*80 + Math.min(out.journals,10)*2);
    out.trend = summarizeTrend(moods);
    out.streak = calcStreak(moods);
  }catch(e){ /* return defaults */ }
  return out;
}

function calcStreak(events){
  if(!events.length) return 0;
  const days = new Set(events.map(e=> new Date(e.ts).toDateString()));
  let streak = 0; let d = new Date();
  for(;;){ const key = d.toDateString(); if(days.has(key)){ streak++; d.setDate(d.getDate()-1);} else break; }
  return streak;
}

function summarizeTrend(moods){
  const today = new Date(); const data = [];
  for(let i=6;i>=0;i--){
    const d = new Date(today); d.setDate(d.getDate()-i);
    const key = d.toDateString();
    const entries = moods.filter(m=> new Date(m.ts).toDateString()===key);
    const v = entries.length ? entries.reduce((s,m)=>s+(m.mood||3),0)/entries.length : 3;
    data.push(Math.round(v*10)/10);
  }
  return data;
}
