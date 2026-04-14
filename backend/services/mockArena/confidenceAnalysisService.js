const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'actually', 'basically'];

function computeFillerRate(transcript = '') {
  const words = transcript.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return 0.1;
  const fillers = words.filter((w) => FILLER_WORDS.includes(w)).length;
  return fillers / words.length;
}

function analyzeVoiceAndConfidence({ transcript = '', voiceMetrics = {} }) {
  const paceWpm = Number(voiceMetrics.paceWpm) || 120;
  const tone = Number(voiceMetrics.tone) || 50;
  const pausesPerMinute = Number(voiceMetrics.pausesPerMinute) || 5;
  const fillerWordRate = Number.isFinite(Number(voiceMetrics.fillerWordRate))
    ? Number(voiceMetrics.fillerWordRate)
    : computeFillerRate(transcript);

  const paceScore = paceWpm >= 105 && paceWpm <= 165 ? 85 : 60;
  const toneScore = Math.max(0, Math.min(100, 100 - Math.abs(tone - 60)));
  const pauseScore = pausesPerMinute <= 6 ? 82 : Math.max(45, 90 - pausesPerMinute * 6);
  const fillerScore = Math.max(30, 100 - Math.round(fillerWordRate * 400));
  const clarityScore = Math.round((paceScore * 0.25) + (toneScore * 0.25) + (pauseScore * 0.2) + (fillerScore * 0.3));
  const confidenceScore = Math.round((toneScore * 0.3) + (paceScore * 0.25) + (pauseScore * 0.2) + (fillerScore * 0.25));

  return {
    clarityScore: Math.max(0, Math.min(100, clarityScore)),
    confidenceScore: Math.max(0, Math.min(100, confidenceScore)),
    communicationStyle: fillerWordRate > 0.08 ? 'needs more concise phrasing' : 'clear and measured',
    metrics: { paceWpm, tone, pausesPerMinute, fillerWordRate },
  };
}

module.exports = {
  analyzeVoiceAndConfidence,
};
