const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all products with filter/search/pagination
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
    const features = new APIFeatures(Product.find({ isActive: true }).populate('category', 'name slug'), req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

    const total = await Product.countDocuments({ isActive: true });
    const products = await features.query;

    res.json({
        success: true,
        count: products.length,
        total,
        page: parseInt(req.query.page) || 1,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 12)),
        data: products,
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOne({
        $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }],
    })
        .populate('category', 'name slug')
        .populate({ path: 'reviews', populate: { path: 'user', select: 'name avatar' } });

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json({ success: true, data: product });
});

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
    req.body.seller = req.user._id;
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: product });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    product.isActive = false;
    await product.save();
    res.json({ success: true, message: 'Product removed' });
});

// @desc    Get featured products
// @route   GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true, isActive: true })
        .populate('category', 'name')
        .limit(8);
    res.json({ success: true, data: products });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
const getRelatedProducts = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) { res.status(404); throw new Error('Product not found'); }
    const related = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
        isActive: true,
    }).limit(4).populate('category', 'name');
    res.json({ success: true, data: related });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getRelatedProducts };
