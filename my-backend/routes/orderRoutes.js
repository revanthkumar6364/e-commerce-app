const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /orders - Create a new order after payment success
router.post('/', orderController.createOrder);

// GET /orders/:orderId - Track an order by its ID
router.get('/:orderId', orderController.trackOrder);

module.exports = router;
