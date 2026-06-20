const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    klassId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    feeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fee',
        required: true,
    },
    trans_id: {
        type: String,
    },
    trx_ref: {
        type: String,
    },
    amount: {
        type: mongoose.Schema.Types.Double,
        required: true,
        min: 0,
    },
    trans_date: {
        type: Date,
        default: Date.now,
    },
    mode_of_payment: {
        type: String,
        enum: ['Paystack', 'Flutterwave', 'Bank_transfer', 'Cash'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending',
    },
    isInstallment: {
        type: Boolean,
        default: false,
    },
    channel: {
        type: String,
        enum: ['Web', 'Mobile', 'Pos', 'Card', 'Cash'],
    },
    paid_at: {
        type: Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);