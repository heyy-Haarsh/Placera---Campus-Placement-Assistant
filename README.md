# Campus-placement-asistant

## Mock Arena (AI Interview Simulation Scaffold)

This repo now includes a modular **Mock Arena** scaffold with:

- AI-generated interview questions tailored by role, industry, experience level
- Technical + system design + behavioral rounds
- STT/TTS provider adapters (Whisper/OpenAI TTS integration points)
- Voice confidence and communication scoring
- Optional webcam/body-language analysis hooks
- Session report generation (strengths, weaknesses, improvements, recommendations)
- **Unique feature:** Adaptive Pressure Mode (dynamic follow-up when confidence drops)

### Backend routes

Base: `http://localhost:5000/api/mock-arena`

- `POST /sessions` create session + generate questions
- `GET /sessions?userId=<id>` list past sessions
- `GET /sessions/:sessionId` fetch one session
- `POST /sessions/:sessionId/answers` submit an answer + evaluate
- `POST /sessions/:sessionId/complete` finalize and generate full report
- `POST /voice/transcribe` STT adapter endpoint
- `POST /voice/synthesize` TTS adapter endpoint

### Key files

- `backend/models/MockInterviewSession.js`
- `backend/services/mockArena/*`
- `backend/controllers/mockArenaController.js`
- `backend/routes/mockArenaRoutes.js`
- `frontend/src/pages/MockArena.jsx`
- `frontend/src/services/mockArenaApi.js`

### Environment variables

- `GEMINI_API_KEY` (optional, AI question generation/evaluation)
- `GEMINI_MODEL` (optional, defaults to `gemini-1.5-flash-latest`)
- `OPENAI_API_KEY` (optional, STT/TTS adapters)
