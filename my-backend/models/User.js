const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: null
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true, // Allows null/undefined to not conflict
        validate: {
            validator: function (v) {
                // E.164 format for India: +91 followed by 10 digits
                return /^\+91\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid Indian phone number!`
        }
    },
    walletCoins: {
        type: Number,
        default: 0
    },
    tier: {
        type: String,
        enum: ['SILVER', 'GOLD', 'PLATINUM'],
        default: 'SILVER'
    },
    coupons: [{
        code: String,
        discount: Number,
        isUsed: { type: Boolean, default: false }
    }],
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true
    },
    phoneVerifiedAt: {
        type: Date,
        default: null
    },
    emailVerifiedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    // Optional: If you want to support password login later
    password: {
        type: String,
        select: false // Do not return by default
    },
    refreshToken: {
        type: String,
        select: false
    },
    resetToken: {
        type: String,
        select: false
    },
    resetTokenExpiry: {
        type: Date,
        select: false
    },
    profileImage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Ensure at least one identifier is present
userSchema.pre('save', async function () {
    if (!this.phone && !this.email) {
        throw new Error('User must have either phone or email');
    }
});

module.exports = mongoose.model('User', userSchema);
