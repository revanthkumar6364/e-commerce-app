const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: { type: Number, required: true }, // Using Numeric ID from products.js
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isVerifiedPurchase: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
