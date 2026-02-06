const mongoose = require('mongoose');
require('dotenv').config();

const auditDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('--- COLLECTIONS ---');
        console.log(collections.map(c => c.name));

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`${col.name}: ${count} documents`);

            if (col.name === 'notifications') {
                const sample = await mongoose.connection.db.collection(col.name).findOne();
                console.log('Sample Notification:', JSON.stringify(sample, null, 2));
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

auditDB();
