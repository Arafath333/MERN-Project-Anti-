const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const total = await User.countDocuments();
    const users = await User.find().sort('-createdAt').skip(skip).limit(limit);
    res.json({ success: true, total, count: users.length, data: users });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    user.isActive = false;
    await user.save();
    res.json({ success: true, message: 'User deactivated' });
});

// @desc    Admin dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
    const Order = require('../models/Order');
    const Product = require('../models/Product');

    const [totalUsers, totalProducts, totalOrders, revenueAgg] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    // Recent orders
    const recentOrders = await Order.find().populate('user', 'name').sort('-createdAt').limit(5);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
        success: true,
        data: { totalUsers, totalProducts, totalOrders, totalRevenue, recentOrders, monthlyRevenue },
    });
});

module.exports = { getUsers, getUser, updateUser, deleteUser, getDashboardStats };
