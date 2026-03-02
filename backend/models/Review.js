const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, maxlength: 100 },
        comment: { type: String, required: true, maxlength: 1000 },
        isApproved: { type: Boolean, default: true },
        helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

// Prevent duplicate review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRatings = async function (productId) {
    const Product = require('./Product');
    const stats = await this.aggregate([
        { $match: { product: productId } },
        { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
    ]);
    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratings: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].numReviews,
        });
    } else {
        await Product.findByIdAndUpdate(productId, { ratings: 0, numReviews: 0 });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post('remove', function () {
    this.constructor.calcAverageRatings(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
