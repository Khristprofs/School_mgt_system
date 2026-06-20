// helper/assessmentHelper.js
function calculateGradeAndRemark(score) {
  let grade, remark;

  if (score >= 70) {
    grade = "A";
    remark = "Excellent";
  } else if (score >= 60) {
    grade = "B";
    remark = "Very Good";
  } else if (score >= 50) {
    grade = "C";
    remark = "Good";
  } else if (score >= 45) {
    grade = "D";
    remark = "Pass";
  } else {
    grade = "F";
    remark = "Fail";
  }

  return { grade, remark };
}

module.exports = { calculateGradeAndRemark };
