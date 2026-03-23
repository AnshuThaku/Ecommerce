const cartModel = require("../../models/cart/cartModel");
// ⚡ ADDED: Product model import kiya taaki original price check kar sakein
const Product = require("../../models/product/productModel"); 
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

    // ⚡ NAYA LOGIC 1: Product ko database se nikalo (Asli Price aur Deal check karne ke liye)
    const product = await Product.findById(productId);
    if (!product) {
        throw new ExpressError(404, 'Product not found.');
    }

    // ⚡ NAYA LOGIC 2: Dynamic Price Calculation (Deal Security)
    let finalPrice = product.price - (product.discountPrice || 0); // Default Selling Price
    const currentTime = new Date();

    // Check karo kya is exact time par deal zinda hai?
    const isDealActive = product.flashDeal && 
                         product.flashDeal.isActive === true && 
                         new Date(product.flashDeal.startTime) <= currentTime && 
                         new Date(product.flashDeal.endTime) > currentTime;

    if (isDealActive) {
        finalPrice = product.flashDeal.dealPrice; // Sasta Flash Deal Price lagao
    }

    // Safely query the database
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
            // ⚡ Price bhi update kar do (In case user ne pehle bina deal ke add kiya tha, aur ab deal aa gayi)
            cartExists.items[itemIndex].price = finalPrice; 
        } else {
            // Agar bilkul naya item hai, to use list mein add kar do
            cartExists.items.push({ 
                product: productId, 
                quantity: Number(quantity),
                price: finalPrice // ⚡ Save the calculated price
            });
        }

        await cartExists.save();
        res.status(200).json({ success: true, message: 'Cart updated successfully.', cart: cartExists });
    } 
    else {
        // Agar cart bilkul bhi nahi tha, naya cart banao
        const newCart = new cartModel({
            user: userId || null,
            guestId: userId ? null : guestId, // agar userId hai to guestId null rakho
            items: [{ 
                product: productId, 
                quantity: Number(quantity),
                price: finalPrice // ⚡ Save the calculated price
            }]
        });
        
        await newCart.save();
        res.status(201).json({ success: true, message: 'Cart created and product added.', cart: newCart });
    }
});