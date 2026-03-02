const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token,
            refreshToken,
        },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    if (!user.isActive) {
        res.status(401);
        throw new Error('Account is deactivated');
    }
    user.lastLogin = Date.now();
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            address: user.address,
            token,
            refreshToken,
        },
    });
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images');
    res.json({ success: true, data: user });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { name, email, phone, address, avatar } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (address) user.address = { ...user.address, ...address };
    if (avatar) user.avatar = avatar;

    if (req.body.password) {
        user.password = req.body.password;
    }
    const updated = await user.save();
    res.json({ success: true, data: { _id: updated._id, name: updated.name, email: updated.email, role: updated.role, avatar: updated.avatar, phone: updated.phone, address: updated.address, token: generateToken(updated._id) } });
});

// @desc    Wishlist toggle
// @route   PUT /api/auth/wishlist/:productId
const toggleWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const idx = user.wishlist.indexOf(productId);
    if (idx > -1) {
        user.wishlist.splice(idx, 1);
    } else {
        user.wishlist.push(productId);
    }
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, wishlist: user.wishlist });
});

module.exports = { register, login, getMe, updateProfile, toggleWishlist };
