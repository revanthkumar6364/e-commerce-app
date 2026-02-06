const mongoose = require('mongoose');
const Notification = require('./models/Notification');
require('dotenv').config();

const checkNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
        const latestNotifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(3);

        console.log('--- LATEST NOTIFICATIONS ---');
        console.log(JSON.stringify(latestNotifications, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        process.exit(1);
    }
};

checkNotifications();
