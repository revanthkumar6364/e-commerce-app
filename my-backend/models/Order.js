const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for guest checkout
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    items: [{
        id: String,
        title: String,
        price: Number,
        qty: Number,
        image: String
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Processing', 'Ready for Delivery', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    estimatedDelivery: {
        type: String,
        default: '3-5 Business Days'
    },
    agentInfo: {
        name: { type: String, default: 'Agent Rahul' },
        phone: { type: String, default: '+91 98765 43210' }
    },
    address: {
        name: String,
        pincode: String,
        address: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
