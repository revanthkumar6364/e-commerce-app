const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/contact', customerController.submitContact);
router.post('/returns', customerController.submitReturn);

module.exports = router;
