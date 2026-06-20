const AssessmentItem = require("../models/AssessmentItems");
const Session = require("../models/Session");
const Term = require("../models/Term");
const Klass = require("../models/Klass");
const Student = require("../models/Student");

exports.createAssessmentItem = async (req, res) => {
    try {
        const {
            studentId,
            subjectId,
            klassId,
            sessionId,
            termId,
            type,
            title,
            score,
            maxScore,
        } = req.body;

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
        const student = await Student.findById(klassId);
        if (!student) {
            return res.status(400).json({ message: 'Student not found' });
        }
        const existingAssessmentItem = await AssessmentItem.findOne({ studentId, klassId, subjectId, type, termId });
        if (existingAssessmentItem) {
            return res.status(400).json({ message: 'Assessment item already exists' })
        }
        const assessmentItem = new AssessmentItem({
            studentId,
            subjectId,
            klassId,
            sessionId,
            termId,
            type,
            title,
            score,
            maxScore,
            created_by: req.user._id,
        });

        await assessmentItem.save();

        res.status(201).json({
            success: true,
            message: "Assessment item created successfully",
            data: assessmentItem,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating assessment item", error: err.message });
    }
};

exports.getAllAssessmentItems = async (req, res) => {
    try {
        const assessmentItems = await AssessmentItem.find()
            .populate("studentId subjectId klassId sessionId termId created_by", "name title username");

        res.status(200).json({
            success: true,
            count: assessmentItems.length,
            data: assessmentItems,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching assessment items", error: err.message });
    }
};

exports.getAssessmentItemById = async (req, res) => {
    try {
        const assessmentItem = await AssessmentItem.findById(req.params.id)
            .populate("studentId subjectId klassId sessionId termId created_by", "name title username");

        if (!assessmentItem) return res.status(404).json({ success: false, message: "Assessment item not found" });

        res.status(200).json({ success: true, data: assessmentItem });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching assessment item", error: err.message });
    }
};

exports.getAssessmentItemsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        const assessmentItems = await AssessmentItem.find({ studentId })
            .populate("subjectId klassId sessionId termId created_by", "name title username");

        res.status(200).json({ success: true, count: assessmentItems.length, data: assessmentItems });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching student assessment items", error: err.message });
    }
};

exports.getAssessmentItemsByClass = async (req, res) => {
    try {
        const { klassId } = req.params;

        const assessmentItems = await AssessmentItem.find({ klassId })
            .populate("studentId subjectId sessionId termId created_by", "name title username");

        res.status(200).json({ success: true, count: assessmentItems.length, data: assessmentItems });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching class assessment items", error: err.message });
    }
};

exports.getAssessmentItemsByTerm = async (req, res) => {
    try {
        const { termId } = req.params;

        const assessmentItems = await AssessmentItem.find({ termId })
            .populate("studentId subjectId klassId sessionId created_by", "name title username");

        res.status(200).json({ success: true, count: assessmentItems.length, data: assessmentItems });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching term assessment items", error: err.message });
    }
};

exports.getAssessmentItemsBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const assessmentItems = await AssessmentItem.find({ sessionId })
            .populate("studentId subjectId klassId termId created_by", "name title username");

        res.status(200).json({ success: true, count: assessmentItems.length, data: assessmentItems });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching session assessment items", error: err.message });
    }
};

exports.getAssessmentItemsBySubjectAndKlass = async (req, res) => {
    try {
        const { subjectId, klassId } = req.params;

        const assessmentItems = await AssessmentItem.find({ subjectId, klassId })
            .populate("studentId sessionId termId created_by", "name title username");

        res.status(200).json({ success: true, count: assessmentItems.length, data: assessmentItems });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching subject/class assessment items", error: err.message });
    }
};

exports.updateAssessmentItem = async (req, res) => {
    try {
        const updates = req.body;

        const assessmentItem = await AssessmentItem.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!assessmentItem) return res.status(404).json({ success: false, message: "Assessment item not found" });

        res.status(200).json({ success: true, message: "Assessment item updated successfully", data: assessmentItem });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating assessment item", error: err.message });
    }
};

exports.deleteAssessmentItem = async (req, res) => {
    try {
        const assessmentItem = await AssessmentItem.findByIdAndDelete(req.params.id);

        if (!assessmentItem) return res.status(404).json({ success: false, message: "Assessment item not found" });

        res.status(200).json({ success: true, message: "Assessment item deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting assessment item", error: err.message });
    }
};