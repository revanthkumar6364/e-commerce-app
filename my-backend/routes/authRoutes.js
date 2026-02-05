const express = require('express');
const router = require('express').Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Rate limiters
const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3,
    message: 'Too many OTP requests, please try again later'
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts, please try again later'
});

// OTP-based authentication
router.post('/otp/request', otpLimiter, authController.requestOtp);
router.post('/otp/verify', authController.verifyOtp);

// Password-based authentication
router.post('/register', authController.register);
router.post('/login/password', loginLimiter, authController.loginWithPassword);

// Password reset
router.post('/password/forgot', otpLimiter, authController.forgotPassword);
router.post('/password/reset', authController.resetPassword);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
