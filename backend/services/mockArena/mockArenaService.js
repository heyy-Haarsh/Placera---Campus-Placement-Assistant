const MockInterviewSession = require('../../models/MockInterviewSession');
const { getSeedQuestions, REPOSITORY_SOURCES } = require('./questionBankService');
const { generateQuestionsWithGemini, evaluateAnswerWithGemini } = require('./providers/geminiProvider');
const { transcribeSpeech, synthesizeSpeech } = require('./providers/openaiVoiceProvider');
const { analyzeVoiceAndConfidence } = require('./confidenceAnalysisService');
const { analyzeBodyLanguage } = require('./bodyLanguageService');
const { computeSessionScores } = require('./scoringService');
const { generateSessionReport } = require('./reportService');

const NO_ANSWER_PATTERNS = [
  /\bsorry\b/i,
  /\bi do not know\b/i,
  /\bi don't know\b/i,
  /\bno idea\b/i,
  /\bnot sure\b/i,
  /\bi can't answer\b/i,
  /\bi cannot answer\b/i,
  /\bi can't recall\b/i,
  /\bi cannot recall\b/i,
  /\bpass\b/i,
];

function classifyAnswerIntent(transcript = '') {
  const text = transcript.trim();
  if (!text) return { answerValidity: 'unknown', isNoAnswer: true };

  const words = text.split(/\s+/).filter(Boolean);
  const hasNoAnswerPhrase = NO_ANSWER_PATTERNS.some((rx) => rx.test(text));

  if (hasNoAnswerPhrase && words.length <= 16) {
    return { answerValidity: 'unknown', isNoAnswer: true };
  }
  if (hasNoAnswerPhrase) {
    return { answerValidity: 'partial', isNoAnswer: false };
  }
  if (words.length < 6) {
    return { answerValidity: 'partial', isNoAnswer: false };
  }
  return { answerValidity: 'valid', isNoAnswer: false };
}

function normalizeProfile(payload = {}) {
  return {
    userId: payload.userId,
    role: payload.role || 'Software Engineer',
    industry: payload.industry || 'Software',
    company: payload.company || '',
    experienceLevel: payload.experienceLevel || 'beginner',
    adaptivePressureMode: !!payload.adaptivePressureMode,
    voiceEnabled: !!payload.voiceEnabled,
    webcamEnabled: !!payload.webcamEnabled,
    questionCount: Math.max(3, Math.min(15, Number(payload.questionCount) || 8)),
    questionMix: payload.questionMix || { technical: 50, systemDesign: 25, behavioral: 25 },
  };
}

async function createSession(payload) {
  const profile = normalizeProfile(payload);
  const seedQuestions = getSeedQuestions({
    experienceLevel: profile.experienceLevel,
    questionMix: profile.questionMix,
    total: profile.questionCount,
  });
  const aiQuestions = await generateQuestionsWithGemini(profile, seedQuestions);

  const session = await MockInterviewSession.create({
    ...profile,
    questions: aiQuestions,
    providerMeta: {
      questionProvider: 'seed+gemini',
      sttProvider: 'openai-whisper',
      ttsProvider: 'openai-tts',
    },
    status: 'in_progress',
  });

  return {
    session,
    repositorySources: REPOSITORY_SOURCES,
  };
}

async function submitAnswer(sessionId, payload = {}) {
  const session = await MockInterviewSession.findById(sessionId);
  if (!session) throw new Error('Session not found');

  const question = session.questions.find((q) => q.questionId === payload.questionId);
  if (!question) throw new Error('Question not found in session');

  const sttResult = await transcribeSpeech({ transcriptHint: payload.transcript || '' });
  const transcript = (payload.transcript || sttResult.transcript || '').trim();
  const voice = analyzeVoiceAndConfidence({ transcript, voiceMetrics: payload.voiceMetrics || {} });
  const nonVerbal = analyzeBodyLanguage(payload.bodyLanguage || {});
  const answerIntent = classifyAnswerIntent(transcript);
  let aiEval = await evaluateAnswerWithGemini({ question, transcript });

  if (answerIntent.answerValidity === 'unknown') {
    aiEval = {
      technicalAccuracy: 5,
      feedback: 'You explicitly said you do not know this answer. That is honest, but you should attempt a partial approach (assumptions, brute force, then optimize).',
    };
  } else if (answerIntent.answerValidity === 'partial') {
    aiEval = {
      technicalAccuracy: Math.min(55, aiEval.technicalAccuracy),
      feedback: `${aiEval.feedback} This response seems partial. Add structure: approach, edge cases, complexity, trade-offs.`,
    };
  }

  const communicationScore = nonVerbal.enabled
    ? Math.round((voice.clarityScore * 0.8) + ((nonVerbal.nonVerbalScore || 0) * 0.2))
    : voice.clarityScore;

  const answerPayload = {
    questionId: question.questionId,
    transcript,
    voiceMetrics: voice.metrics,
    bodyLanguage: payload.bodyLanguage || {},
    confidenceScore: voice.confidenceScore,
    communicationScore,
    technicalAccuracy: aiEval.technicalAccuracy,
    answerValidity: answerIntent.answerValidity,
    feedback: `${aiEval.feedback} Communication style: ${voice.communicationStyle}. ${nonVerbal.feedback}`,
  };

  const existingIdx = session.answers.findIndex((a) => a.questionId === question.questionId);
  if (existingIdx >= 0) session.answers[existingIdx] = answerPayload;
  else session.answers.push(answerPayload);

  if (session.adaptivePressureMode && voice.confidenceScore < 65) {
    question.followUps = [
      ...(question.followUps || []),
      'Pressure follow-up: defend your trade-off choice in 30 seconds.',
    ].slice(-3);
  }

  await session.save();
  return { answer: answerPayload, sttResult };
}

async function completeSession(sessionId) {
  const session = await MockInterviewSession.findById(sessionId);
  if (!session) throw new Error('Session not found');

  const answersWithType = session.answers.map((ans) => {
    const q = session.questions.find((question) => question.questionId === ans.questionId);
    return { ...ans.toObject(), type: q?.type || 'technical' };
  });

  const scores = computeSessionScores({
    answers: session.answers,
    adaptivePressureMode: session.adaptivePressureMode,
  });

  const report = generateSessionReport({
    answers: answersWithType,
    scores,
    profile: {
      role: session.role,
      industry: session.industry,
    },
    questions: session.questions || [],
  });

  session.scores = scores;
  session.report = report;
  session.status = 'completed';
  // markModified is required for Mixed-type fields — Mongoose won't detect deep changes otherwise
  session.markModified('report');
  await session.save();

  const tts = await synthesizeSpeech({
    text: `Session completed. Overall grade ${scores.overallGrade}. Keep practicing ${report.recommendations[0]}`,
  });

  return { session, tts };
}

async function listSessions(userId) {
  return MockInterviewSession.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
}

async function getSessionById(sessionId) {
  return MockInterviewSession.findById(sessionId).lean();
}

module.exports = {
  createSession,
  submitAnswer,
  completeSession,
  listSessions,
  getSessionById,
};
