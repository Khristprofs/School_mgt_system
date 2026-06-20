const Quiz = require("../models/Quiz.js");

exports.calculateMaxScore = (questions) => {
  if (!questions || questions.length === 0) return 0;
  return questions.reduce((acc, q) => acc + (q.marks || 0), 0);
};

exports.findQuizById = async (id) => {
  return await Quiz.findById(id)
    .populate("subject classLevel session term createdBy")
    .exec();
};

exports.findAllQuizzes = async (filters = {}) => {
  return await Quiz.find(filters)
    .populate("subject classLevel session term createdBy")
    .exec();
};
