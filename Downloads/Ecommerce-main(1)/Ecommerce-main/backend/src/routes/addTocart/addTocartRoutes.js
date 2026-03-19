const express = require("express");
const router = express.Router();
const { addToCartController } = require("../../controllers/cartController/addToCartController");
const { cartDetailsController } = require("../../controllers/cartController/cartDetailsController");
const { updateProductController } = require("../../controllers/cartController/updateProductController");
const { deleteCartController } = require("../../controllers/cartController/deleteCartController");

router.delete("/delete", deleteCartController);

router.put("/update", updateProductController);

router.post("/add", addToCartController);
router.get('/', cartDetailsController);



module.exports = router;
