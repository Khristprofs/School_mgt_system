const Exam = require("../models/Exam");
const Teacher = require('../models/Teacher');
const Session = require('../models/Session');
const Term = require('../models/Term');
const Klass = require('../models/Klass');
const Subject = require('../models/Subject');

exports.createExam = async (req, res) => {
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
    const existingExam = await Exam.findOne({ title, klassId, subjectId, sessionId, termId });
    if (existingExam) {
      return res.status(400).json({ message: 'Quiz already exists' })
    }
    const exam = new Exam({
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
    await exam.save();
    res.status(201).json({ message: "Exam created successfully", Exam });
  } catch (error) {
    res.status(500).json({ message: "Error creating Exam", error: error.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const { klassId, subjectId, sessionId, termId } = req.query;
    const filters = {};

    if (klassId) filters.klassId = klassId;
    if (subjectId) filters.subjectId = subjectId;
    if (sessionId) filters.sessionId = sessionId;
    if (termId) filters.termId = termId;

    const exams = await findAllExams(filters);
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams", error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await findQuizById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};

exports.getExamsByClass = async (req, res) => {
  try {
    const exams = await findAllQuizzes({ klassId: req.params.klassId });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams for class", error: error.message });
  }
};

exports.getExamsByClassAndTerm = async (req, res) => {
  try {
    const exams = await findAllQuizzes({ klassId: req.params.klassId, termId: req.params.termId });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams for class in term", error: error.message });
  }
};

exports.getExamsByClassAndSession = async (req, res) => {
  try {
    const exams = await findAllQuizzes({ klassId: req.params.klassId, sessionId: req.params.sessionId });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams for class in session", error: error.message });
  }
};

exports.getExamsBySubjectAndClass = async (req, res) => {
  try {
    const exams = await findAllQuizzes({ subjectId: req.params.subjectId, klassId: req.params.klassId });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams for subject in class", error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { title, description, subjectId, klassId, sessionId, termId, questions, duration, status } = req.body;

    let exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    exam.title = title ?? exam.title;
    exam.description = description ?? exam.description;
    exam.subjectId = subjectId ?? exam.subjectId;
    exam.klassId = klassId ?? exam.klassId;
    exam.sessionId = sessionId ?? exam.sessionId;
    exam.termId = termId ??eExam.termId;
    exam.questions = questions ?? exam.questions;
    exam.duration = duration ?? exam.duration;
    exam.status = status ?? exam.status;

    await exam.save();
    res.status(200).json({ message: "Exam updated successfully", Exam });
  } catch (error) {
    res.status(500).json({ message: "Error updating Exam", error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Exam", error: error.message });
  }
};
