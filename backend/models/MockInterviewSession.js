const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  type: { type: String, enum: ['technical', 'system-design', 'behavioral'], required: true },
  prompt: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  source: { type: String, default: 'internal' },
  expectedSignals: { type: [String], default: [] },
  followUps: { type: [String], default: [] },
}, { _id: false });

const AnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  transcript: { type: String, default: '' },
  voiceMetrics: {
    tone: { type: Number, default: 50 },
    paceWpm: { type: Number, default: 120 },
    fillerWordRate: { type: Number, default: 0.06 },
    pausesPerMinute: { type: Number, default: 5 },
  },
  bodyLanguage: {
    eyeContactPct: { type: Number, default: null },
    postureScore: { type: Number, default: null },
    expressionVariance: { type: Number, default: null },
  },
  confidenceScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  technicalAccuracy: { type: Number, default: 0 },
  answerValidity: {
    type: String,
    enum: ['valid', 'partial', 'unknown'],
    default: 'valid',
  },
  feedback: { type: String, default: '' },
}, { _id: false });

// PerQuestion breakdown sub-schema (stored inside report)
const PerQuestionReportSchema = new mongoose.Schema({
  index: { type: Number },
  questionId: { type: String },
  prompt: { type: String },
  type: { type: String },
  difficulty: { type: String },
  transcript: { type: String, default: '' },
  answerValidity: { type: String },
  technicalAccuracy: { type: Number },
  technicalLabel: { type: String },
  confidenceScore: { type: Number },
  confidenceLabel: { type: String },
  communicationScore: { type: Number },
  communicationLabel: { type: String },
  feedback: { type: String, default: '' },
  eyeContactPct: { type: Number, default: 0 },
  eyeContactGrade: { type: String, default: '' },
  eyeContactNote: { type: String, default: '' },
  postureScore: { type: Number, default: 0 },
  postureNote: { type: String, default: '' },
  paceWpm: { type: Number, default: 0 },
  paceLabel: { type: String, default: '' },
  paceOk: { type: Boolean, default: true },
  fillerRate: { type: Number, default: 0 },
  fillerNote: { type: String, default: '' },
}, { _id: false });

const TypeAverageSchema = new mongoose.Schema({
  type: { type: String },
  avg: { type: Number },
  count: { type: Number },
}, { _id: false });

const MockInterviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  industry: { type: String, required: true },
  company: { type: String, default: '' },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  adaptivePressureMode: { type: Boolean, default: false },
  voiceEnabled: { type: Boolean, default: false },
  webcamEnabled: { type: Boolean, default: false },
  questionCount: { type: Number, default: 8 },
  questionMix: {
    technical: { type: Number, default: 50 },
    systemDesign: { type: Number, default: 25 },
    behavioral: { type: Number, default: 25 },
  },
  questions: { type: [QuestionSchema], default: [] },
  answers: { type: [AnswerSchema], default: [] },
  scores: {
    confidence: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    composure: { type: Number, default: 0 },
    overallGrade: { type: Number, default: 0 },
  },
  // Use Mixed for report so all nested data (sessionMeta, perQuestion, typeAverages) is persisted
  report: { type: mongoose.Schema.Types.Mixed, default: {} },
  providerMeta: {
    questionProvider: { type: String, default: 'seed+gemini' },
    sttProvider: { type: String, default: 'openai-whisper' },
    ttsProvider: { type: String, default: 'openai-tts' },
  },
  status: { type: String, enum: ['draft', 'in_progress', 'completed'], default: 'in_progress' },
}, { timestamps: true });

module.exports = mongoose.model('MockInterviewSession', MockInterviewSessionSchema);
