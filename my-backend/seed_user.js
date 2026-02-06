const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

        const mockUserId = '65c1a2b3e4b0c1a2b3e4b0c1';

        // Remove existing user if any
        await User.findByIdAndDelete(mockUserId).catch(() => { });

        const newUser = new User({
            _id: mockUserId,
            name: 'Aura Customer',
            email: 'aura.premium@example.com',
            phone: '+919876543210',
            walletCoins: 1500,
            tier: 'GOLD',
            status: 'active'
        });

        await newUser.save();
        console.log('✅ SEEDED DEFAULT USER SUCCESSFULLY');
        console.log('ID:', newUser._id);
        console.log('Name:', newUser.name);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
};

seedUser();
