const Result = require("../models/Result");
const Student = require("../models/Student");
const Assessment = require("../models/Assessment");
const Klass = require("../models/Klass");
const Term = require("../models/Term");
const Session = require("../models/Session");
const { calculateAverage, calculatePositions } = require("../helper/resultHelper");

exports.createResult = async (req, res) => {
  try {
    const { studentId, klassId, sessionId, termId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const klass = await Klass.findById(klassId);
    if (!klass) return res.status(404).json({ message: "Class not found" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const term = await Term.findById(termId);
    if (!term) return res.status(404).json({ message: "Term not found" });

    const assessments = await Assessment.find({
      studentId,
      klassId,
      sessionId,
      termId,
    }).populate('subjectId', 'name');

    if (assessments.length === 0) {
      return res.status(404).json({ message: "No assessments found for this student" });
    }

    // Check if result already exists
    const existingResult = await Result.findOne({ studentId, klassId, sessionId, termId });
    if (existingResult) {
      return res.status(400).json({ message: "Result already exists for this student" });
    }

    // Build subject data and compute totals
    const subjects = assessments.map(a => ({
      subjectId: a.subjectId._id,
      totalScore: a.totalScore,
      grade: a.grade,
      remark: a.remark,
    }));

    const totalScore = assessments.reduce((sum, a) => sum + a.totalScore, 0);
    const averageScore = totalScore / assessments.length;

    const result = new Result({
      studentId,
      klassId,
      sessionId,
      termId,
      subjects,
      totalScore,
      averageScore,
    });

    await result.save();

    res.status(201).json({
      message: "Result created successfully",
      result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating result", error: error.message });
  }
};

exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate("studentId klassId sessionId termId assessment");
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching results", error: error.message });
    }
};

exports.getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate("studentId klassId sessionId termId assessment");
        if (!result) return res.status(404).json({ message: "Result not found" });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching result", error: error.message });
    }
};

exports.updateResult = async (req, res) => {
    try {
        const { assessmentId } = req.body;

        let updateData = { ...req.body };

        if (assessmentId) {
            const assessment = await Assessment.findById(assessmentId);
            if (!assessment) {
                return res.status(404).json({ message: "Assessment not found" });
            }

            const totalScore = assess.totalScore;
            const averageScore = calculateAverage(totalScore, 1);

            updateData.totalScore = totalScore;
            updateData.averageScore = averageScore;
        }

        const result = await Result.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate("studentId klassId sessionId termId assessment");

        if (!result) return res.status(404).json({ message: "Result not found" });

        res.status(200).json({ message: "Result updated successfully", result });
    } catch (error) {
        res.status(500).json({ message: "Error updating result", error: error.message });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        const result = await Result.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: "Result not found" });

        res.status(200).json({ message: "Result deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting result", error: error.message });
    }
};

exports.getClassResults = async (req, res) => {
    try {
        const { klassId, sessionId, termId } = req.query;

        const filters = {};
        if (klassId) filters.klassId = klassId;
        if (sessionId) filters.sessionId = sessionId;
        if (termId) filters.termId = termId;

        let results = await Result.find(filters)
            .populate("studentId klassId sessionId termId assessment");

        results = calculatePositions(results);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching class results", error: error.message });
    }
};