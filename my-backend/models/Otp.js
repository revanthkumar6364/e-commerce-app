const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        index: true // Faster lookups
    },
    channel: {
        type: String,
        enum: ['sms', 'email'],
        required: true
    },
    otpHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index: automatically deletes document after this time
    },
    attempts: {
        type: Number,
        default: 0
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    ip: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Otp', otpSchema);
