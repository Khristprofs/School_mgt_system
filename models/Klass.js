const mongoose = require('mongoose')

const KlassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    levelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        trim: true,
        required: true,
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        trim: true
    },
    klassTitle: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Klass', KlassSchema)