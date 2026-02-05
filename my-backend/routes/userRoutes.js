const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /user/wallet - Fetch user's wallet info
router.get('/wallet', userController.getWallet);

// POST /user/exchange - Exchange coins for coupons
router.post('/exchange', userController.exchangeCoins);

module.exports = router;
