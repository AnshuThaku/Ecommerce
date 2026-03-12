const express = require("express");
const router = express.Router();
const { addToCartController } = require("../../controllers/addToCartController/addToCartController");
const { cartDetailsController } = require("../../controllers/addToCartController/cartDetailsController");

router.post("/add", addToCartController);
router.get('/', cartDetailsController);

module.exports = router;
