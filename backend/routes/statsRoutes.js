const express = require('express');
const router = express.Router();
const MockInterviewSession = require('../models/MockInterviewSession');
const Experience = require('../models/Experience');

/**
 * GET /api/stats/:userId
 * Returns aggregated stats for Dashboard + Profile:
 *   - mockSessions: total completed sessions
 *   - scoreTrend: array of { label, score } last 10 sessions
 *   - avgOverall: average overall grade across all sessions
 *   - bestScore: highest overall grade
 *   - experiencesPosted: count of experiences posted by this user
 *   - avgConfidence, avgCommunication, avgTechnical
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = require('mongoose');

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json(emptyStats());
    }

    const uid = new mongoose.Types.ObjectId(userId);

    // Fetch completed sessions sorted by date
    const sessions = await MockInterviewSession.find(
      { userId: uid, status: 'completed' },
      { scores: 1, createdAt: 1, role: 1, company: 1 }
    ).sort({ createdAt: 1 }).limit(20).lean();

    const total = sessions.length;

    if (total === 0) {
      // Count experiences even if no mock sessions
      const experiencesPosted = await Experience.countDocuments({ userId: uid });
      return res.json({ ...emptyStats(), experiencesPosted });
    }

    // Build score trend (last 10 sessions)
    const trend = sessions.slice(-10).map((s, i) => ({
      label: `S${i + 1}`,
      score: Math.round(s.scores?.overallGrade || 0),
      date: s.createdAt,
      role: s.role || '',
    }));

    const avg = key => Math.round(
      sessions.reduce((sum, s) => sum + (s.scores?.[key] || 0), 0) / total
    );

    const best = Math.max(...sessions.map(s => s.scores?.overallGrade || 0));

    const experiencesPosted = await Experience.countDocuments({ userId: uid });

    res.json({
      mockSessions: total,
      scoreTrend: trend,
      avgOverall: avg('overallGrade'),
      bestScore: Math.round(best),
      avgConfidence: avg('confidence'),
      avgCommunication: avg('communication'),
      avgTechnical: avg('technicalAccuracy'),
      experiencesPosted,
    });
  } catch (err) {
    console.error('[stats]', err);
    res.status(500).json({ error: err.message });
  }
});

function emptyStats() {
  return {
    mockSessions: 0,
    scoreTrend: [],
    avgOverall: 0,
    bestScore: 0,
    avgConfidence: 0,
    avgCommunication: 0,
    avgTechnical: 0,
    experiencesPosted: 0,
  };
}

module.exports = router;
