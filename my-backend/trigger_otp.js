const mongoose = require('mongoose');
const User = require('./models/User');
const Notification = require('./models/Notification');
require('dotenv').config();

const triggerOTP = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

        const userId = '65c1a2b3e4b0c1a2b3e4b0c1';
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found!');
            process.exit(1);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const notification = new Notification({
            userId: user._id,
            type: 'SMS',
            title: 'Payment Verification OTP',
            message: `Your OTP for the luxury purchase is ${otp}. It expires in 10 minutes.`,
            target: user.phone || '+919876543210',
            status: 'SENT'
        });
        await notification.save();

        console.log('✅ OTP TRIGGERED SUCCESSFULLY:', otp);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

triggerOTP();
