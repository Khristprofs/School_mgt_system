const ReportCard = require("../models/ReportCard");
const Result = require("../models/Result");
const { getGrade, calculatePositions } = require("../helper/reportCardHelper");

exports.createReportCard = async (req, res) => {
  try {
    const { studentId, klassId, sessionId, termId, result, teacherRemark, principalRemark } = req.body;

    const studentResult = await Result.findById(result);
    if (!studentResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    const overallGrade = getGrade(studentResult.totalScore);

    const reportCard = new ReportCard({
      studentId,
      klassId,
      sessionId,
      termId,
      result,
      teacherRemark,
      principalRemark,
      overallGrade
    });

    await reportCard.save();
    res.status(201).json({ message: "Report Card created successfully", reportCard });
  } catch (error) {
    res.status(500).json({ message: "Error creating report card", error: error.message });
  }
};

exports.getAllReportCards = async (req, res) => {
  try {
    const reportCards = await ReportCard.find()
      .populate("studentId klassId sessionId termId result");
    res.status(200).json(reportCards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report cards", error: error.message });
  }
};

exports.getReportCardById = async (req, res) => {
  try {
    const reportCard = await ReportCard.findById(req.params.id)
      .populate("studentId klassId sessionId termId result");

    if (!reportCard) return res.status(404).json({ message: "Report Card not found" });

    res.status(200).json(reportCard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report card", error: error.message });
  }
};

exports.updateReportCard = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.result) {
      const studentResult = await Result.findById(updateData.result);
      if (!studentResult) {
        return res.status(404).json({ message: "Result not found" });
      }
      updateData.overallGrade = getGrade(studentResult.totalScore);
    }

    const reportCard = await ReportCard.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("studentId klassId sessionId termId result");

    if (!reportCard) return res.status(404).json({ message: "Report Card not found" });

    res.status(200).json({ message: "Report Card updated successfully", reportCard });
  } catch (error) {
    res.status(500).json({ message: "Error updating report card", error: error.message });
  }
};

exports.deleteReportCard = async (req, res) => {
  try {
    const reportCard = await ReportCard.findByIdAndDelete(req.params.id);
    if (!reportCard) return res.status(404).json({ message: "Report Card not found" });

    res.status(200).json({ message: "Report Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report card", error: error.message });
  }
};

exports.getReportCardsByClass = async (req, res) => {
  try {
    const { klassId } = req.params;
    let reportCards = await ReportCard.find({ klassId })
      .populate("studentId klassId sessionId termId result");

    reportCards = calculatePositions(reportCards);
    res.status(200).json(reportCards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching class report cards", error: error.message });
  }
};

exports.getReportCardsByClassAndTerm = async (req, res) => {
  try {
    const { klassId, termId } = req.params;
    let reportCards = await ReportCard.find({ klassId, termId })
      .populate("studentId klassId sessionId termId result");

    reportCards = calculatePositions(reportCards);
    res.status(200).json(reportCards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report cards for this trem", error: error.message });
  }
};

exports.getReportCardsByClassAndSession = async (req, res) => {
  try {
    const { klassId, sessionId } = req.params;
    let reportCards = await ReportCard.find({ klassId, sessionId })
      .populate("studentId klassId sessionId termId result");

    reportCards = calculatePositions(reportCards);
    res.status(200).json(reportCards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching class session report cards", error: error.message });
  }
};
