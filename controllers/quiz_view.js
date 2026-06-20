const Quiz = require("../models/Quiz");
const { calculateMaxScore, findQuizById, findAllQuizzes } = require("../helper/quizhelper");
const Teacher = require('../models/Teacher');
const Session = require('../models/Session');
const Term = require('../models/Term');
const Klass = require('../models/Klass');
const Subject = require('../models/Subject');

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, subjectId, klassId, sessionId, termId, questions, duration, status, created_by } = req.body;
    const teacher = await Teacher.findById(created_by);
    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' })
    }
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ message: 'Session not found' });
    }
    const term = await Term.findById(termId);
    if (!term) {
      return res.status(400).json({ message: 'Term not found' });
    }
    const klass = await Klass.findById(klassId);
    if (!klass) {
      return res.status(400).json({ message: 'Class not found' });
    }
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(400).json({ message: 'Subject not found' });
    }
    const existingQuiz = await Quiz.findOne({ title, klassId, subjectId, sessionId, termId });
    if (existingQuiz) {
      return res.status(400).json({ message: 'Quiz already exists' })
    }
    const quiz = new Quiz({
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      questions,
      duration,
      status,
      created_by: created_by,
    });

    quiz.maxScore = calculateMaxScore(questions);

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("subjectId klassId sessionId termId");
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await findQuizById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};

exports.getQuizzesByClass = async (req, res) => {
  try {
    const quizzes = await findAllQuizzes({ klassId: req.params.klassId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes for class", error: error.message });
  }
};

exports.getQuizzesByClassAndTerm = async (req, res) => {
  try {
    const quizzes = await findAllQuizzes({ klassId: req.params.klassId, termId: req.params.termId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes for class in term", error: error.message });
  }
};

exports.getQuizzesByClassAndSession = async (req, res) => {
  try {
    const quizzes = await findAllQuizzes({ klassId: req.params.klassId, sessionId: req.params.sessionId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes for class in session", error: error.message });
  }
};

exports.getQuizzesBySubjectAndClass = async (req, res) => {
  try {
    const quizzes = await findAllQuizzes({ subjectId: req.params.subjectId, klassId: req.params.klassId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes for subject in class", error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, subjectId, klassId, sessionId, termId, questions, duration, status } = req.body;

    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    quiz.title = title ?? quiz.title;
    quiz.description = description ?? quiz.description;
    quiz.subjectId = subjectId ?? quiz.subjectId;
    quiz.klassId = klassId ?? quiz.klassId;
    quiz.sessionId = sessionId ?? quiz.sessionId;
    quiz.termId = termId ?? quiz.termId;
    quiz.questions = questions ?? quiz.questions;
    quiz.duration = duration ?? quiz.duration;
    quiz.status = status ?? quiz.status;

    // recalculate score if questions changed
    if (questions) {
      quiz.maxScore = calculateMaxScore(questions);
    }

    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error: error.message });
  }
};
