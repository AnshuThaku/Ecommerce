const cartModel = require("../../models/cart/cartModel");
const wrapAsync = require("../../utils/errorHandler/wrapAsync");
const ExpressError = require("../../utils/errorHandler/expressError");


exports.deleteCartController = wrapAsync(async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const guestId = req.headers['x-guest-id'];
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
    await cartExists.remove();
    res.status(200).json({ success: true, message: 'Cart deleted successfully.' });
});