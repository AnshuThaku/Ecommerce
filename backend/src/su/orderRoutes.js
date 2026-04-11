const express = require('express');
const { instantCheckout } = require('../controllers/orderController');
const router = express.Router();


router.post('/instant-checkout', instantCheckout);

module.exports = router;
