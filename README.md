# MindSpace AI Mental Wellness Platform

A mobile-first, AI-powered mental wellness prototype focused on youth support with confidential, empathetic guidance.

## Core Features (Prototype)
- AI chat with two personas: Arjuna and Maya
- Lightweight crisis phrase detection with safety overlay
- Wellness tools: 4-7-8 breathing, journaling (local)
- Trigger endpoints for online/offline/questionnaire signals (stubs)

## Tech Stack
- Frontend: HTML/CSS/JS (vanilla)
- Backend: Node.js + Express
- AI: Google Gemini via `@google/generative-ai` (AI Studio / Vertex)

## Setup
1. Backend
   - Copy `.env.example` to `.env` and set `GOOGLE_API_KEY` from Google AI Studio or Vertex AI.
   - Install deps and run:
     ```bash
     cd backend
     npm install
     npm run dev
     ```
   - Health check: `GET http://localhost:8080/health`

2. Frontend
  - Open `frontend/index.html` directly, or serve with a static server (e.g. VS Code Live Server). The frontend expects backend at `http://localhost:8080` by default.
  - If the backend bound to a different port (due to conflicts), override the API URL via query param and it will be saved:
    - Example: `http://localhost:5173/?api=http://localhost:8081`

## Personas
- Arjuna: practical peer mentor, subtle Gita-inspired values (inclusive, non-preachy)
- Maya: empathetic mindful coach

## Crisis Detection
- Keyword-based prototype only. On potential risk, app displays a safety overlay with hotline info. Replace with robust classifiers before real use.

## Multi-agent + Detection Triggers (Design Outline)
- Base chat model: Gemini 1.5 Flash for prototyping; plan fine-tune Gemma for base chat then prompt-tune personas.
- Agents:
  - Chat Agent (persona wrapper)
  - Safety Agent (crisis + policy guardrails)
  - Tools Agent (breathing/journaling tips)
- Triggers:
  - Online: screen time MCP, social webhook (stub `POST /api/triggers/online`)
  - Offline: Google Health Connect / Fitness API (stub `POST /api/triggers/offline`)
  - Questionnaire: PHQ-9/GAD-7 intake (stub `POST /api/triggers/questionnaire`)

## Google Integration Notes
- Use Google AI Studio keys during prototyping.
- For production and Gemma fine-tuning: use Vertex AI Model Garden for Gemma, manage tuning jobs, and host tuned models on Vertex Endpoints; then call via REST or SDK.

## Safety and Compliance
- Educational prototype only; not a medical device.
- Do not provide diagnosis. Encourage professional help when risk is present.
- Log minimal PII; prefer anonymous sessions.

## Next Steps
- Add auth (Google Identity / Firebase Auth).
- Replace keyword risk with proper safety model.
- Anonymous community and “Wellness Wrap” dashboard.
- Persist chat and journaling safely (Firestore/Datastore with rules).
