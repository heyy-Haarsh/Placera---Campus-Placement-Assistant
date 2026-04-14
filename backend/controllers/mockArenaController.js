const {
  createSession,
  submitAnswer,
  completeSession,
  listSessions,
  getSessionById,
} = require('../services/mockArena/mockArenaService');
const { transcribeSpeech, synthesizeSpeech } = require('../services/mockArena/providers/openaiVoiceProvider');

exports.createMockSession = async (req, res) => {
  try {
    const result = await createSession(req.body || {});
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to create mock session' });
  }
};

exports.getMockSessions = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const sessions = await listSessions(userId);
    return res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

exports.getMockSessionById = async (req, res) => {
  try {
    const session = await getSessionById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    return res.status(200).json({ session });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch session' });
  }
};

exports.submitMockAnswer = async (req, res) => {
  try {
    const result = await submitAnswer(req.params.sessionId, req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to submit answer' });
  }
};

exports.completeMockSession = async (req, res) => {
  try {
    const result = await completeSession(req.params.sessionId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to complete session' });
  }
};

exports.transcribeVoice = async (req, res) => {
  try {
    const result = await transcribeSpeech(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: 'Transcription failed' });
  }
};

exports.synthesizeVoice = async (req, res) => {
  try {
    const result = await synthesizeSpeech(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: 'Speech synthesis failed' });
  }
};
