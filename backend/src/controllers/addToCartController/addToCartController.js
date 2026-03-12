const cartModel = require("../../models/cart/cartModel");
const wrapAsync = require("../../utils/errorHandler/wrapAsync");
const ExpressError = require("../../utils/errorHandler/expressError");

exports.addToCartController = wrapAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    
    // BUG 1 FIXED: Safely extract userId taaki error na aaye agar user login nahi hai.
    const userId = req.user ? req.user.id : null;
    const guestId = req.headers['x-guest-id'];

    if (!productId || !quantity) {
        throw new ExpressError(400, 'Product ID and quantity are required.');
    }
    
    if (!userId && !guestId) {
        throw new ExpressError(400, 'User ID or Guest ID is required.');
    }

    // Safely query the database (Sirf usi ID se dhoondo jo available hai)
    let cartExists;
    if (userId) {
        cartExists = await cartModel.findOne({ user: userId });
    } else {
        cartExists = await cartModel.findOne({ guestId: guestId });
    }

    if (cartExists) {
        // BUG 2 FIXED: Check karo ki kya product cart mein pehle se maujood hai
        const itemIndex = cartExists.items.findIndex(
            (item) => String(item.product) === String(productId)
        );

        if (itemIndex > -1) {
            // Agar same product hai, to naya ghusane ki jagah sirf quantity badhao
            cartExists.items[itemIndex].quantity += Number(quantity);
        } else {
            // Agar bilkul naya item hai, to use list mein add kar do
            cartExists.items.push({ product: productId, quantity: Number(quantity) });
        }

        await cartExists.save();
        res.status(200).json({ success: true, message: 'Cart updated successfully.', cart: cartExists });
    } 
    else {
        // Agar cart bilkul bhi nahi tha, naya cart banao
        const newCart = new cartModel({
            user: userId || null,
            guestId: userId ? null : guestId, // agar userId hai to guestId null rakho
            items: [{ product: productId, quantity: Number(quantity) }]
        });
        
        await newCart.save();
        res.status(201).json({ success: true, message: 'Cart created and product added.', cart: newCart });
    }
});

