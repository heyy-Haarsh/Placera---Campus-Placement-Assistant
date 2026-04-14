function analyzeBodyLanguage(bodyLanguage = {}) {
  const eyeContactPct = Number(bodyLanguage.eyeContactPct);
  const postureScore = Number(bodyLanguage.postureScore);
  const expressionVariance = Number(bodyLanguage.expressionVariance);

  if (!Number.isFinite(eyeContactPct) && !Number.isFinite(postureScore) && !Number.isFinite(expressionVariance)) {
    return {
      enabled: false,
      nonVerbalScore: null,
      feedback: 'Webcam analytics not available for this response.',
    };
  }

  const eye = Number.isFinite(eyeContactPct) ? Math.max(0, Math.min(100, eyeContactPct)) : 70;
  const posture = Number.isFinite(postureScore) ? Math.max(0, Math.min(100, postureScore)) : 70;
  const expression = Number.isFinite(expressionVariance) ? Math.max(0, Math.min(100, expressionVariance)) : 65;
  const nonVerbalScore = Math.round((eye * 0.45) + (posture * 0.35) + (expression * 0.2));

  const feedback = [];
  if (eye < 60) feedback.push('Increase eye contact with the camera to improve perceived confidence.');
  if (posture < 60) feedback.push('Sit upright and keep shoulders stable during answers.');
  if (expression < 45) feedback.push('Add natural facial variation to avoid a flat delivery.');
  if (!feedback.length) feedback.push('Good non-verbal communication and professional presence.');

  return {
    enabled: true,
    nonVerbalScore,
    feedback: feedback.join(' '),
  };
}

module.exports = {
  analyzeBodyLanguage,
};
