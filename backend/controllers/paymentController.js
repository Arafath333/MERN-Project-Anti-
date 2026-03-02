const asyncHandler = require('express-async-handler');

// @desc    Simple COD payment confirmation (no payment gateway)
// @route   POST /api/payments/confirm
const confirmPayment = asyncHandler(async (req, res) => {
    const { orderId, method = 'cod' } = req.body;
    if (!orderId) {
        res.status(400);
        throw new Error('orderId is required');
    }
    res.json({
        success: true,
        message: 'Payment recorded',
        paymentResult: {
            id: `PAY-${Date.now()}`,
            status: 'completed',
            method,
            update_time: new Date().toISOString(),
        },
    });
});

module.exports = { confirmPayment };
