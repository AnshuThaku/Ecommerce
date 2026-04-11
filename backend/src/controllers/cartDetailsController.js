const cartModel = require("../../models/cart/cartModel");
const wrapAsync = require("../../utils/errorHandler/wrapAsync");

exports.cartDetailsController = wrapAsync(async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const guestId = req.headers['x-guest-id'];

    if (!userId && !guestId) {
        return res.status(200).json({ success: true, items: [] });
    }

    let cart;
    if (userId) {
        cart = await cartModel.findOne({ user: userId });
    } else {
        cart = await cartModel.findOne({ guestId: guestId });
    }

    if (!cart) {
        return res.status(200).json({ success: true, items: [] });
    }

    // Return items directly so frontend can access data.items
    res.status(200).json({ success: true, items: cart.items });
});
