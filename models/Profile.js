const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true,
        required: true
    },
    img: {
        type: String,
    },
    DOB: {
        type: String,
        required: true,
    },
    dateOfAdmission: {
        type: String,
    },
    graduationYear: {
        type: String,
    },
    bio: {
        type: String,
    },
    contactAddress: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema)