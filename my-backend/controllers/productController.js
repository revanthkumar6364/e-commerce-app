const Review = require('../models/Review');

const productController = {
    // Add a review
    addReview: async (req, res) => {
        try {
            const { productId } = req.params;
            const { userName, rating, comment, userId } = req.body;

            const newReview = new Review({
                productId: parseInt(productId),
                userName,
                rating,
                comment,
                userId: userId || null
            });

            await newReview.save();
            res.status(201).json({ success: true, review: newReview });
        } catch (error) {
            console.error('Add Review Error:', error);
            res.status(500).json({ success: false, message: 'Failed to add review' });
        }
    },

    // Get reviews for a product
    getReviews: async (req, res) => {
        try {
            const { productId } = req.params;
            const reviews = await Review.find({ productId: parseInt(productId) }).sort({ createdAt: -1 });
            res.status(200).json({ success: true, reviews });
        } catch (error) {
            console.error('Get Reviews Error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
        }
    }
};

module.exports = productController;
