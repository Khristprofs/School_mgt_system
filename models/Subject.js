const mongoose = require('mongoose')

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    klassId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Klass',
        trim: true,
        required: true,
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        trim: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Subject', SubjectSchema)