const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /admin/stats - Admin Dashboard Statistics
router.get('/stats', adminController.getStats);

module.exports = router;
