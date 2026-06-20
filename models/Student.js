const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true
    },
    klassId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Klass',
        trim: true,
        required: true
    },
    regNo: {
        type: String,
        required: true,
        trim: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Student', StudentSchema)