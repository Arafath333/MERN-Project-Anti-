const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        slug: { type: String, unique: true },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        shortDescription: { type: String, maxlength: 300 },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        comparePrice: { type: Number, default: 0 },
        images: [{ url: String, public_id: String }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        brand: { type: String, default: '' },
        stock: { type: Number, required: true, default: 0, min: 0 },
        sku: { type: String, unique: true, sparse: true },
        ratings: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        tags: [String],
        specifications: [{ key: String, value: String }],
        weight: { type: Number, default: 0 },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
});

// Generate slug from name
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
