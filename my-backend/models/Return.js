const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    returnId: { type: String, unique: true, required: true },
    orderId: { type: String, required: true },
    reason: { type: String, required: true },
    description: String,
    buyerName: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Under Review', 'Pickup Arranged', 'Refund Processed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
