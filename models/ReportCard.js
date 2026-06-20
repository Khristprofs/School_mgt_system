const mongoose = require('mongoose');

const ReportCardSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    klassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Klass',
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    termId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Term',
      required: true,
    },
    result: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Result',
      required: true,
    },
    teacherRemark: {
      type: String,
    },
    principalRemark: {
      type: String,
    },
    overallGrade: {
        type: String,
    },
    position: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReportCard', ReportCardSchema);