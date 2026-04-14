function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function computeSessionScores({ answers = [], adaptivePressureMode = false }) {
  const confidence = avg(answers.map((a) => a.confidenceScore || 0));
  const communication = avg(answers.map((a) => a.communicationScore || 0));
  const technicalAccuracy = avg(answers.map((a) => a.technicalAccuracy || 0));
  const composureBase = Math.round((confidence * 0.55) + (communication * 0.45));
  const composure = adaptivePressureMode ? Math.max(0, composureBase - 3) : composureBase;
  const overallGrade = Math.round(
    (confidence * 0.25) +
    (communication * 0.25) +
    (technicalAccuracy * 0.4) +
    (composure * 0.1)
  );

  return {
    confidence,
    communication,
    technicalAccuracy,
    composure,
    overallGrade: Math.max(0, Math.min(100, overallGrade)),
  };
}

module.exports = {
  computeSessionScores,
};
