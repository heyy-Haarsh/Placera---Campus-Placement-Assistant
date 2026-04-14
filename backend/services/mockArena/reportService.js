const SCORE_LABEL = (s) => {
  if (s >= 85) return 'Excellent';
  if (s >= 70) return 'Good';
  if (s >= 55) return 'Fair';
  return 'Needs Work';
};

function buildImprovements(scores, weakestType) {
  const suggestions = [];
  if (scores.technicalAccuracy < 70) suggestions.push('Practice problem-solving with explicit complexity analysis and edge-case coverage.');
  if (scores.communication < 70) suggestions.push('Use a structured response format: situation → approach → trade-offs → summary.');
  if (scores.confidence < 70) suggestions.push('Reduce filler words and maintain a steady, measured speaking pace.');
  if (scores.composure < 70) suggestions.push('Train under timed pressure to improve calmness during high-stress rounds.');
  if (weakestType === 'behavioral') suggestions.push('Prepare STAR stories with quantifiable impact for common behavioral prompts.');
  if (weakestType === 'system-design') suggestions.push('Revise architecture fundamentals: scaling strategies, caching layers, and consistency trade-offs.');
  if (!suggestions.length) suggestions.push('Maintain momentum with mixed mock sessions and periodic peer review.');
  return suggestions;
}

function gradeEyeContact(pct = 0) {
  if (pct >= 75) return { grade: 'A', label: 'Excellent eye contact — projects confidence.' };
  if (pct >= 55) return { grade: 'B', label: 'Good eye contact — slightly improve camera focus.' };
  if (pct >= 35) return { grade: 'C', label: 'Fair — try to look at the camera more directly.' };
  return { grade: 'D', label: 'Low eye contact — camera presence needs significant practice.' };
}

function gradePosture(score = 0) {
  if (score >= 80) return 'Stable and confident body language.';
  if (score >= 60) return 'Mostly stable — minor restlessness detected.';
  return 'Noticeable movement — work on staying composed and still.';
}

function gradePace(wpm = 0) {
  if (wpm >= 110 && wpm <= 155) return { label: `${wpm} wpm — ideal interview pace.`, ok: true };
  if (wpm > 155) return { label: `${wpm} wpm — slightly fast, slow down for clarity.`, ok: false };
  if (wpm > 0) return { label: `${wpm} wpm — a bit slow, aim for a brisker pace.`, ok: false };
  return { label: 'Pace not measured.', ok: true };
}

function buildPerQuestionBreakdown(answers = [], questions = []) {
  return answers.map((ans, idx) => {
    const q = questions.find((qq) => qq.questionId === ans.questionId) || {};
    const eyeGrade = gradeEyeContact(ans.bodyLanguage?.eyeContactPct);
    const paceInfo = gradePace(ans.voiceMetrics?.paceWpm);
    const fillerRate = ans.voiceMetrics?.fillerWordRate || 0;
    return {
      index: idx + 1,
      questionId: ans.questionId,
      prompt: q.prompt || `Question ${idx + 1}`,
      type: q.type || ans.type || 'technical',
      difficulty: q.difficulty || 'easy',
      transcript: ans.transcript || '',
      answerValidity: ans.answerValidity || 'valid',
      technicalAccuracy: ans.technicalAccuracy || 0,
      technicalLabel: SCORE_LABEL(ans.technicalAccuracy || 0),
      confidenceScore: ans.confidenceScore || 0,
      confidenceLabel: SCORE_LABEL(ans.confidenceScore || 0),
      communicationScore: ans.communicationScore || 0,
      communicationLabel: SCORE_LABEL(ans.communicationScore || 0),
      feedback: ans.feedback || '',
      eyeContactPct: ans.bodyLanguage?.eyeContactPct || 0,
      eyeContactGrade: eyeGrade.grade,
      eyeContactNote: eyeGrade.label,
      postureScore: ans.bodyLanguage?.postureScore || 0,
      postureNote: gradePosture(ans.bodyLanguage?.postureScore),
      paceWpm: ans.voiceMetrics?.paceWpm || 0,
      paceLabel: paceInfo.label,
      paceOk: paceInfo.ok,
      fillerRate: Math.round((fillerRate || 0) * 100),
      fillerNote: fillerRate > 0.08
        ? 'High filler word usage — practice speaking without filler words.'
        : 'Filler word usage is within acceptable range.',
    };
  });
}

function generateSessionReport({ answers = [], scores = {}, profile = {}, questions = [] }) {
  const byType = answers.reduce((acc, ans) => {
    const key = ans.type || 'technical';
    if (!acc[key]) acc[key] = { c: 0, total: 0 };
    acc[key].c += ans.technicalAccuracy || 0;
    acc[key].total += 1;
    return acc;
  }, {});

  const typeAverages = Object.entries(byType).map(([type, v]) => ({
    type,
    avg: Math.round(v.c / Math.max(1, v.total)),
    count: v.total,
  }));
  const sortedTypes = [...typeAverages].sort((a, b) => a.avg - b.avg);
  const weakestType = sortedTypes[0]?.type || 'technical';
  const strongestType = sortedTypes[sortedTypes.length - 1]?.type || 'behavioral';
  const unknownCount = answers.filter((a) => a.answerValidity === 'unknown').length;
  const partialCount = answers.filter((a) => a.answerValidity === 'partial').length;
  const answeredCount = answers.length - unknownCount;

  // Average body language across all answered questions
  const avgEyeContact = answers.length
    ? Math.round(answers.reduce((s, a) => s + (a.bodyLanguage?.eyeContactPct || 0), 0) / answers.length)
    : 0;
  const avgPosture = answers.length
    ? Math.round(answers.reduce((s, a) => s + (a.bodyLanguage?.postureScore || 0), 0) / answers.length)
    : 0;
  const avgPaceWpm = answers.length
    ? Math.round(answers.reduce((s, a) => s + (a.voiceMetrics?.paceWpm || 0), 0) / answers.length)
    : 0;
  const avgFillerRate = answers.length
    ? Math.round((answers.reduce((s, a) => s + (a.voiceMetrics?.fillerWordRate || 0), 0) / answers.length) * 100)
    : 0;

  const strengths = [];
  if (scores.technicalAccuracy >= 75) strengths.push('Strong technical reasoning and accuracy.');
  if (scores.communication >= 75) strengths.push('Clear communication and well-structured responses.');
  if (scores.confidence >= 75) strengths.push('Confident verbal delivery under interview conditions.');
  if (scores.composure >= 75) strengths.push('Maintained composure under pressure moments.');
  if (avgEyeContact >= 65) strengths.push('Good camera presence and eye contact.');
  if (avgPosture >= 70) strengths.push('Composed body language throughout the session.');
  if (strongestType) strengths.push(`Performed best in ${strongestType} questions.`);
  if (!strengths.length) strengths.push('Consistent participation and willingness to iterate.');

  const weaknesses = [];
  if (scores.technicalAccuracy < 70) weaknesses.push('Inconsistent technical depth or incomplete edge-case handling.');
  if (scores.communication < 70) weaknesses.push('Answer flow and articulation need refinement.');
  if (scores.confidence < 70) weaknesses.push('Low confidence markers detected in voice delivery.');
  if (scores.composure < 70) weaknesses.push('Stress handling during difficult follow-ups can improve.');
  if (avgEyeContact < 50) weaknesses.push('Below-average eye contact — practice looking at the camera.');
  if (avgFillerRate > 10) weaknesses.push(`High filler word rate (~${avgFillerRate}%) detected — practice concise speech.`);
  if (unknownCount > 0) weaknesses.push(`Skipped or unanswered: ${unknownCount} question(s).`);
  if (!weaknesses.length) weaknesses.push('No critical weaknesses observed in this session.');

  const recommendations = [
    `Targeted practice area: ${weakestType} questions.`,
    `Recommended track: ${profile.role || 'General'} interview loop in ${profile.industry || 'software'}.`,
    unknownCount > 0
      ? 'When unsure, avoid stopping at "I do not know" — present assumptions and a basic approach first.'
      : 'Keep using layered answers: baseline solution → optimization → trade-offs.',
    avgFillerRate > 10
      ? `Work on eliminating filler words (current avg: ~${avgFillerRate}%). Try shadow-reading out loud daily.`
      : 'Maintain your clean speaking style and keep building vocabulary variety.',
    'Review this transcript and re-answer your 3 weakest questions within 24 hours.',
  ];

  const perQuestion = buildPerQuestionBreakdown(answers, questions);

  return {
    strengths,
    weaknesses,
    suggestedImprovements: buildImprovements(scores, weakestType),
    recommendations,
    typeAverages,
    weakestType,
    strongestType,
    sessionMeta: {
      totalQuestions: answers.length,
      answeredCount,
      unknownCount,
      partialCount,
      avgEyeContact,
      avgPosture,
      avgPaceWpm,
      avgFillerRate,
      eyeContactGrade: gradeEyeContact(avgEyeContact).grade,
      eyeContactNote: gradeEyeContact(avgEyeContact).label,
      paceLabel: gradePace(avgPaceWpm).label,
      postureNote: gradePosture(avgPosture),
    },
    perQuestion,
  };
}

module.exports = {
  generateSessionReport,
};
