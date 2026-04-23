const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/g');
// Agar aapne token verification middleware banaya hai toh usko bhi attach kar lein
// const { verifyToken } = require('../middlewares/auth');

router.post('/create-order', paymentController.createOrder); // isme verifyToken laga sakte hain
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;