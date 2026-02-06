const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['SMS', 'EMAIL'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    target: {
        type: String, // Phone number or Email
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'SENT', 'FAILED'],
        default: 'SENT'
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
