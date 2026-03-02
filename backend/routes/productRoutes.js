const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getRelatedProducts } = require('../controllers/productController');
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Reviews sub-routes
router.get('/:productId/reviews', getReviews);
router.post('/:productId/reviews', protect, addReview);
router.delete('/reviews/:id', protect, deleteReview);

module.exports = router;
