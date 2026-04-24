const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// ⚡ Yahan apna auth middleware import karein (path apne project ke hisaab se check kar lein)
// Maan lijiye aapka middleware 'protect' naam se hai authMiddleware file mein:
const { protect } = require('../middleware/authMiddleware'); 

// ⚡ Ab dono routes pe 'protect' laga dein, taaki req.user mil jaye
router.post('/create-order', protect, paymentController.createOrder);
router.post('/verify-payment', protect, paymentController.verifyPayment);

module.exports = router;