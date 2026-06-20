const mongoose = require('mongoose');

const PaymentProfileSchema = new mongoose.Schema({
    fw_secret_key: {
        type: String,
    },
    fw_public_key: {
        type: String,
    },
    activate_fw: {
        type: Boolean,
        default: false
    },
    ps_secret_key: {
        type: String,
    },
    ps_public_key: {
        type: String,
    },
    activate_ps: {
        type: Boolean,
        default: false,
    },
    account_no: {
        type: String
    },
    account_name: {
        type: String
    },
    bank_name: {
        type: String
    },
}, { timestamps: true })

module.exports = mongoose.model('PaymentProfile', PaymentProfileSchema);