const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// POST /products/:productId/reviews - Add review
router.post('/:productId/reviews', productController.addReview);

// GET /products/:productId/reviews - Get reviews
router.get('/:productId/reviews', productController.getReviews);

module.exports = router;
