const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).sort('sortOrder name');
    res.json({ success: true, data: categories });
});

const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }] });
    if (!category) { res.status(404); throw new Error('Category not found'); }
    res.json({ success: true, data: category });
});

const createCategory = asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) { res.status(404); throw new Error('Category not found'); }
    res.json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) { res.status(404); throw new Error('Category not found'); }
    category.isActive = false;
    await category.save();
    res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
