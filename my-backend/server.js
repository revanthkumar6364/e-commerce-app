// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure CORS to allow frontend
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: clientUrl }));

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/demo_auth_db';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.warn('⚠️  Primary MongoDB connection failed:', err.message);
    if (mongoUri.includes('mongodb+srv') || mongoUri.includes('localhost')) {
      console.log('🔄 Attempting local fallback...');
      try {
        await mongoose.connect('mongodb://127.0.0.1:27017/demo_auth_db', { serverSelectionTimeoutMS: 3000 });
        console.log('✅ Local MongoDB connected as fallback');
      } catch (localErr) {
        console.error('❌ Both Atlas and Local MongoDB connections failed.');
        console.info('👉 TIP: Ensure MongoDB is installed and running locally, or check your Atlas IP whitelist.');
      }
    }
  }
};

connectDB();

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/travel', require('./routes/travelRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/api', require('./routes/customerRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.get('/', (req, res) => res.send('Hello from backend!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
