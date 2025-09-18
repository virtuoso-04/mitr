import { detectCrisisSignals } from "../crisis.js";

// Simple heuristics + placeholder naive Bayes-like scoring
const keywords = {
  selfHarm: [/suicide/i, /kill myself/i, /end it/i, /self[-\s]?harm/i],
  violence: [/kill (him|her|them)/i, /hurt (someone|them)/i],
  abuse: [/abused?/i, /assault(ed)?/i],
};

export function naiveClassify(text) {
  const heur = detectCrisisSignals(text);
  let scores = { crisis: heur.triggered ? 0.7 : 0.1, selfHarm: 0, violence: 0, abuse: 0 };
  for (const [k, regs] of Object.entries(keywords)) {
    const hit = regs.some((r) => r.test(text));
    if (hit) scores[k] = Math.max(scores[k], 0.6);
  }
  const label = scores.crisis > 0.5 || scores.selfHarm >= 0.6 ? "CRISIS" : "NORMAL";
  return { label, scores };
}
