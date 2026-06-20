const Test = require("../models/Test");
const Teacher = require('../models/Teacher');
const Session = require('../models/Session');
const Term = require('../models/Term');
const Klass = require('../models/Klass');
const Subject = require('../models/Subject');

exports.createTest = async (req, res) => {
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
    const existingTest = await Test.findOne({ title, klassId, subjectId, sessionId, termId });
    if (existingTest) {
      return res.status(400).json({ message: 'Quiz already exists' })
    }
    const test = new Test({
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
    await quiz.save();
    res.status(201).json({ message: "Test created successfully", test });
  } catch (error) {
    res.status(500).json({ message: "Error creating test", error: error.message });
  }
};

exports.getAllTests = async (req, res) => {
  try {
    const { klassId, subjectId, sessionId, termId } = req.query;
    const filters = {};

    if (klassId) filters.klassId = klassId;
    if (subjectId) filters.subjectId = subjectId;
    if (sessionId) filters.sessionId = sessionId;
    if (termId) filters.termId = termId;

    const tests = await findAllTests(filters);
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests", error: error.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await findQuizById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};

exports.getTestsByClass = async (req, res) => {
  try {
    const tests = await findAllQuizzes({ klassId: req.params.klassId });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests for class", error: error.message });
  }
};

exports.getTestsByClassAndTerm = async (req, res) => {
  try {
    const tests = await findAllQuizzes({ klassId: req.params.klassId, termId: req.params.termId });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests for class in term", error: error.message });
  }
};

exports.getTestsByClassAndSession = async (req, res) => {
  try {
    const tests = await findAllQuizzes({ klassId: req.params.klassId, sessionId: req.params.sessionId });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests for class in session", error: error.message });
  }
};

exports.getTestsBySubjectAndClass = async (req, res) => {
  try {
    const tests = await findAllQuizzes({ subjectId: req.params.subjectId, klassId: req.params.klassId });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests for subject in class", error: error.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const { title, description, subjectId, klassId, sessionId, termId, questions, duration, status } = req.body;

    let test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Quiz not found" });

    test.title = title ?? test.title;
    test.description = description ?? test.description;
    test.subjectId = subjectId ?? test.subjectId;
    test.klassId = klassId ?? test.klassId;
    test.sessionId = sessionId ?? test.sessionId;
    test.termId = termId ?? test.termId;
    test.questions = questions ?? test.questions;
    test.duration = duration ?? test.duration;
    test.status = status ?? test.status;

    await test.save();
    res.status(200).json({ message: "Test updated successfully", test });
  } catch (error) {
    res.status(500).json({ message: "Error updating test", error: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting test", error: error.message });
  }
};
