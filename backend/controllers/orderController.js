const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create order
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice, itemsPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Verify stock and get current prices
    for (let item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) { res.status(404); throw new Error(`Product not found: ${item.product}`); }
        if (product.stock < item.quantity) { res.status(400); throw new Error(`Insufficient stock for ${product.name}`); }
        product.stock -= item.quantity;
        await product.save();
    }

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'stripe',
        taxPrice,
        shippingPrice,
        totalPrice,
        itemsPrice,
    });

    res.status(201).json({ success: true, data: order });
});

// @desc    Get my orders
// @route   GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'name images');
    if (!order) { res.status(404); throw new Error('Order not found'); }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Not authorized');
    }
    res.json({ success: true, data: order });
});

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
const markOrderPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'processing';
    order.paymentResult = req.body.paymentResult;
    const updated = await order.save();
    res.json({ success: true, data: updated });
});

// @desc    Mark order as delivered (admin)
// @route   PUT /api/orders/:id/deliver
const markOrderDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = 'delivered';
    const updated = await order.save();
    res.json({ success: true, data: updated });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find()
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);
    res.json({ success: true, total, count: orders.length, data: orders });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    order.orderStatus = req.body.status;
    if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
    const updated = await order.save();
    res.json({ success: true, data: updated });
});

module.exports = { createOrder, getMyOrders, getOrder, markOrderPaid, markOrderDelivered, getAllOrders, updateOrderStatus };
