const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
const API_KEY = process.env.GEMINI_API_KEY;

function normalizeAiQuestion(q, idx) {
  const type = ['technical', 'system-design', 'behavioral'].includes(q.type) ? q.type : 'technical';
  return {
    questionId: q.questionId || `${type}_ai_${idx + 1}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    prompt: q.prompt || 'Please explain your approach.',
    difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'easy',
    source: 'gemini',
    expectedSignals: Array.isArray(q.expectedSignals) ? q.expectedSignals : [],
    followUps: Array.isArray(q.followUps) ? q.followUps : [],
  };
}

async function generateQuestionsWithGemini(profile, fallbackQuestions) {
  if (!API_KEY || typeof fetch !== 'function') {
    return fallbackQuestions;
  }

  const difficultyGuide = {
    beginner: 'easy, conversational questions a fresher student can answer in plain English — NO LeetCode, NO architecture',
    intermediate: 'moderate questions — basic system thinking, simple coding concepts, experience-based behavioral',
    advanced: 'challenging questions — deep technical depth, system design, complex trade-offs',
  }[profile.experienceLevel] || 'easy, conversational questions';

  const prompt = `Generate exactly ${fallbackQuestions.length} interview questions for a mock campus placement interview.
Return a strict JSON array ONLY — no markdown, no explanation, no code fences.

Candidate Profile:
- Role: ${profile.role}
- Industry: ${profile.industry}
- Target Company: ${profile.company || 'General / Campus Placement'}
- Experience Level: ${profile.experienceLevel}
- Difficulty Style: ${difficultyGuide}

IMPORTANT RULES:
1. Match difficulty STRICTLY to the experience level above.
2. For "beginner" — questions like "What is X?" or "Tell me about a project." Nothing algorithmic.
3. Make each question unique and different in theme — mix technical, system-design, and behavioral.
4. Keep questions natural and conversational for a voice interview.
5. Vary questions across sessions — do not use generic templates.

Return this exact JSON shape (array of ${fallbackQuestions.length} objects):
[
  {
    "type": "technical|system-design|behavioral",
    "prompt": "The full question text here.",
    "difficulty": "easy|medium|hard",
    "expectedSignals": ["signal1", "signal2"],
    "followUps": ["A follow-up question"]
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // Higher temperature = more question variety across sessions
        generationConfig: { temperature: 0.85, maxOutputTokens: 1400 },
      }),
    });
    if (!res.ok) return fallbackQuestions;

    const json = await res.json();
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = rawText.match(/\[[\s\S]*\]/);
    if (!match) return fallbackQuestions;

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || !parsed.length) return fallbackQuestions;

    return parsed.map((q, idx) => normalizeAiQuestion(q, idx));
  } catch (_) {
    return fallbackQuestions;
  }
}

async function evaluateAnswerWithGemini({ question, transcript }) {
  if (!API_KEY || typeof fetch !== 'function') {
    const technicalAccuracy = Math.min(100, 45 + Math.round((transcript?.length || 0) / 10));
    return {
      technicalAccuracy,
      feedback: 'Good structure. Add edge cases and trade-off reasoning for a stronger answer.',
    };
  }

  const prompt = `You are an interview evaluator. Return strict JSON:
{
  "technicalAccuracy": 0-100,
  "feedback": "short feedback"
}
Question: ${question?.prompt || ''}
Candidate Answer Transcript: ${transcript || ''}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!res.ok) throw new Error('Gemini response not ok');
    const json = await res.json();
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = rawText.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : {};
    return {
      technicalAccuracy: Math.max(0, Math.min(100, Number(parsed.technicalAccuracy) || 60)),
      feedback: parsed.feedback || 'Answer shows promise. Improve precision and clarity.',
    };
  } catch (_) {
    return {
      technicalAccuracy: Math.min(100, 45 + Math.round((transcript?.length || 0) / 10)),
      feedback: 'Solid intent. Include complexity analysis and alternate approaches.',
    };
  }
}

module.exports = {
  generateQuestionsWithGemini,
  evaluateAnswerWithGemini,
};
