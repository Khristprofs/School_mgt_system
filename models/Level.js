const mongoose = require('mongoose')

const LevelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    termId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Term',
        trim: true
    },
    sessionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        trim: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Level', LevelSchema)