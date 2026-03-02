const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
        },
        slug: { type: String, unique: true },
        description: { type: String, default: '' },
        image: { url: String, public_id: String },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
        isActive: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const slugify = require('slugify');
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
