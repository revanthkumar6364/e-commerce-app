const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUserOTP = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
        const user = await User.findById('65c1a2b3e4b0c1a2b3e4b0c1');
        if (user) {
            console.log('--- USER OTP DATA ---');
            console.log(`User: ${user.name}`);
            console.log(`Current OTP: ${user.otp}`);
            console.log(`Expiry: ${user.otpExpiry}`);
        } else {
            console.log('User not found');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUserOTP();
