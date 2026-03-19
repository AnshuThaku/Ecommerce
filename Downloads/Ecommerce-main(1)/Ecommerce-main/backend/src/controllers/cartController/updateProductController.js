const cartModel = require("../../models/cart/cartModel");
const wrapAsync = require("../../utils/errorHandler/wrapAsync");
const ExpressError = require("../../utils/errorHandler/expressError");

exports.updateProductController = wrapAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user ? req.user.id : null;
    const guestId = req.headers['x-guest-id'];
    if (!productId || quantity === undefined) {
        throw new ExpressError(400, 'Product ID and quantity are required.');
    }
    if (!userId && !guestId) {
        throw new ExpressError(400, 'User ID or Guest ID is required.');
    }   
    let cartExists;
    if (userId) {
        cartExists = await cartModel.findOne({ user: userId });
    } else {
        cartExists = await cartModel.findOne({ guestId: guestId });
    }
    if (!cartExists) {
        throw new ExpressError(404, 'Cart not found for the user or guest.');
    }
    const itemIndex = cartExists.items.findIndex(
        (item) => String(item.product) === String(productId)
    );
    if (itemIndex === -1) {
        throw new ExpressError(404, 'Product not found in the cart.');
    }
    if (quantity <= 0) {
        // Agar quantity 0 ya negative hai, to item ko cart se hata do
        cartExists.items.splice(itemIndex, 1);
    } else {
        // Nahi to quantity update kar do
        cartExists.items[itemIndex].quantity = Number(quantity);
    }
    await cartExists.save();
    res.status(200).json({ success: true, message: 'Cart updated successfully.', cart: cartExists });
});