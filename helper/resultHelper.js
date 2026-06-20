function calculateAverage(totalScore, count) {
  if (!count || count === 0) return 0;
  return totalScore / count;
}

function calculatePositions(results) {
  // Sort by totalScore descending
  results.sort((a, b) => b.totalScore - a.totalScore);

  let currentPosition = 1;
  let lastScore = null;
  let sameRankCount = 0;

  results.forEach((res, index) => {
    if (lastScore !== null && res.totalScore === lastScore) {
      // same score → same position
      res.position = currentPosition;
      sameRankCount++;
    } else {
      // new score → update position
      currentPosition = index + 1;
      res.position = currentPosition;
      sameRankCount = 1;
    }
    lastScore = res.totalScore;
  });

  return results;
}

module.exports = { calculateAverage, calculatePositions };
