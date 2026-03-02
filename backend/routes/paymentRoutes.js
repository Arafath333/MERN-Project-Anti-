const express = require('express');
const router = express.Router();
const { confirmPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/confirm', protect, confirmPayment);

module.exports = router;
