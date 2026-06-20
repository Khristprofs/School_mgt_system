const mongoose = require('mongoose')

const TimetableSchema = new mongoose.Schema({
    klassId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Klass',
        trim: true,
        required: true,
    },
    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        trim: true,
        required: true
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        trim: true,
        required: true
    },
    day: {
        type: String,
        required: true,
        trim: true
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('Timetable', TimetableSchema)