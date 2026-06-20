const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    examQuestionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        default: 1
    }
})

const ExamSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    klassId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Klass",
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true
    },
    termId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
        required: true
    },
    questions: [QuestionSchema],
    duration: {
        type: Number,
        default: 30
    },
    status: {
        type: String,
        enum: ["Draft", "Published", "Closed"],
        default: "Draft"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

ExamSchema.pre("save", function (next) {
    if (this.questions.length > 0) {
        this.maxScore = this.questions.reduce((acc, q) => acc + (q.marks || 0), 0);
    }
    next();
});

module.exports = mongoose.model('Exam', ExamSchema)
