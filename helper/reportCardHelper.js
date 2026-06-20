
function getGrade(score) {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
}

function calculatePositions(reportCards) {
  reportCards.sort((a, b) => b.result.totalScore - a.result.totalScore);

  let currentPosition = 1;
  let lastScore = null;

  reportCards.forEach((rc, index) => {
    if (lastScore !== null && rc.result.totalScore === lastScore) {
      rc.postion = currentPosition;
    } else {
      currentPosition = index + 1;
      rc.postion = currentPosition;
    }
    lastScore = rc.result.totalScore;
  });

  return reportCards;
}

module.exports = { getGrade, calculatePositions };
