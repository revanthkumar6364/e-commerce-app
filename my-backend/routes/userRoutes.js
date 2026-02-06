const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /user/wallet - Fetch user's wallet info
router.get('/wallet', userController.getWallet);

// POST /user/exchange - Exchange coins for coupons
router.post('/exchange', userController.exchangeCoins);

// PUT /user/profile - Update user profile
router.put('/profile', userController.updateProfile);

// POST /user/orders - Place a new order
router.post('/orders', userController.placeOrder);

// GET /user/notifications - Get user notifications
router.get('/notifications', userController.getNotifications);

// POST /user/send-otp - Send payment OTP
router.post('/send-otp', userController.sendOTP);

// POST /user/verify-otp - Verify payment OTP
router.post('/verify-otp', userController.verifyOTP);

// GET /user/orders - Get user orders
router.get('/orders', userController.getOrders);

module.exports = router;
