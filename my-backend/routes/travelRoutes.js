const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// POST /travel/book - Process flight booking and send e-ticket
router.post('/book', travelController.bookFlight);

module.exports = router;
