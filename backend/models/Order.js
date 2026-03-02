const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [orderItemSchema],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String },
        },
        paymentMethod: { type: String, required: true, default: 'stripe' },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        itemsPrice: { type: Number, required: true, default: 0.0 },
        orderStatus: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
            default: 'pending',
        },
        isPaid: { type: Boolean, default: false },
        paidAt: Date,
        isDelivered: { type: Boolean, default: false },
        deliveredAt: Date,
        trackingNumber: { type: String, default: '' },
        stripePaymentIntentId: { type: String },
        notes: { type: String, default: '' },
    },
    { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
