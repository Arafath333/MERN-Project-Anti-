const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
const getReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
        .populate('user', 'name avatar')
        .sort('-createdAt');
    res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Add review
// @route   POST /api/products/:productId/reviews
const addReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) { res.status(404); throw new Error('Product not found'); }

    const existing = await Review.findOne({ user: req.user._id, product: req.params.productId });
    if (existing) { res.status(400); throw new Error('You already reviewed this product'); }

    const review = await Review.create({
        user: req.user._id,
        product: req.params.productId,
        rating: req.body.rating,
        title: req.body.title,
        comment: req.body.comment,
    });
    res.status(201).json({ success: true, data: review });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) { res.status(404); throw new Error('Review not found'); }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Not authorized');
    }
    await review.remove();
    res.json({ success: true, message: 'Review removed' });
});

module.exports = { getReviews, addReview, deleteReview };
