const express = require("express");
const router = express.Router();
const { addToCartController } = require("../controllers/addToCartController");
const { cartDetailsController } = require("../controllers/cartDetailsController");
const { updateProductController } = require("../controllers/updateProductController");
const { deleteCartController } = require("../controllers/deleteCartController");

router.delete("/delete", deleteCartController);

router.put("/update", updateProductController);

router.post("/add", addToCartController);
router.get('/', cartDetailsController);



module.exports = router;
