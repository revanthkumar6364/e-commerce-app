const mongoose = require('mongoose');
const Notification = require('./models/Notification');
require('dotenv').config();

const checkAllNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
        const notifications = await Notification.find({})
            .sort({ createdAt: -1 });

        console.log('--- ALL NOTIFICATIONS ---');
        console.log(JSON.stringify(notifications, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        process.exit(1);
    }
};

checkAllNotifications();
