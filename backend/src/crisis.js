import { z } from "zod";

const CrisisSignal = z.object({
  type: z.enum(["ideation", "self-harm", "violence", "abuse", "medical"]),
  confidence: z.number().min(0).max(1),
  span: z.tuple([z.number(), z.number()]).optional(),
});

const CrisisResult = z.object({
  triggered: z.boolean(),
  reasons: z.array(CrisisSignal).default([]),
});

const crisisKeywords = {
  ideation: [
    "suicide",
    "kill myself",
    "end it",
    "no reason to live",
    "die",
    "not worth living",
  ],
  self_harm: ["cut myself", "hurt myself", "bleed", "razor"],
  violence: ["kill them", "shoot", "stab"],
  abuse: ["they hit me", "assault", "abuse"],
  medical: ["overdose", "OD", "poison"],
};

export function detectCrisisSignals(text) {
  const lc = text.toLowerCase();
  const reasons = [];

  for (const [type, words] of Object.entries(crisisKeywords)) {
    for (const w of words) {
      const idx = lc.indexOf(w);
      if (idx !== -1) {
        reasons.push({ type: type.replace("_", "-"), confidence: 0.8, span: [idx, idx + w.length] });
        break;
      }
    }
  }

  return CrisisResult.parse({ triggered: reasons.length > 0, reasons });
}

export function crisisSafetyOverlay(personaName) {
  return `Important: If you are in immediate danger or considering harming yourself, please contact local emergency services or a suicide prevention hotline right now. In India: AASRA 24x7 Helpline: 91-9820466726. In the US: 988 Suicide & Crisis Lifeline (call or text 988). If you can, reach a trusted adult, teacher, or counselor. ${personaName} will continue with supportive guidance.`;
}
