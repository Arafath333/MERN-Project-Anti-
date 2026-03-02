const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, markOrderPaid, markOrderDelivered, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/pay', protect, markOrderPaid);
// Admin only
router.get('/', protect, admin, getAllOrders);
router.put('/:id/deliver', protect, admin, markOrderDelivered);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
