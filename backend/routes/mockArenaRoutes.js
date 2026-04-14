const express = require('express');
const {
  createMockSession,
  getMockSessions,
  getMockSessionById,
  submitMockAnswer,
  completeMockSession,
  transcribeVoice,
  synthesizeVoice,
} = require('../controllers/mockArenaController');

const router = express.Router();

router.post('/sessions', createMockSession);
router.get('/sessions', getMockSessions);
router.get('/sessions/:sessionId', getMockSessionById);
router.post('/sessions/:sessionId/answers', submitMockAnswer);
router.post('/sessions/:sessionId/complete', completeMockSession);

router.post('/voice/transcribe', transcribeVoice);
router.post('/voice/synthesize', synthesizeVoice);

module.exports = router;
