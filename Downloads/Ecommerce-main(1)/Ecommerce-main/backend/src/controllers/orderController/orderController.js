const Order = require('../../models/order/orderModel'); // Apna path check kar lijiye
const Product = require('../../models/product/productModel'); // Apna path check kar lijiye
const wrapAsync = require('../../utils/errorHandler/wrapAsync');
const mongoose = require('mongoose');

exports.instantCheckout = wrapAsync(async (req, res) => {
  const { cartItems, totalAmount } = req.body;

  // 1. USER CHECK: Agar token se user nahi aaya, toh ek valid dummy ID bana do testing ke liye
  const userId = req.user ? req.user._id : new mongoose.Types.ObjectId();

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, error: "Cart is empty" });
  }

  try {
    // 2. Format Items exactly as the Order Schema wants them
    const formattedOrderItems = cartItems.map(item => ({
      product: item.productId || item.product, 
      name: item.name,
      image: item.image || 'default-image.jpg',
      price: item.price,
      quantity: item.quantity
    }));

    // 3. Create the Order with ALL REQUIRED FIELDS to satisfy MongoDB
    const newOrder = await Order.create({
      user: userId,
      orderItems: formattedOrderItems,
      itemsPrice: totalAmount,
      totalAmount: totalAmount,
      paymentInfo: {
        method: 'COD',
        paymentStatus: 'Paid' // Fake status for instant checkout testing
      },
      shippingAddress: {
        fullName: req.user ? req.user.name : "Luxury VIP Guest",
        phone: "9876543210",
        addressLine1: "123 Truee Luxury Avenue",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001" // Ab MongoDB error nahi dega!
      }
    });

    // 4. Update product popularity (soldCount)
    for (let item of cartItems) {
      if(item.productId || item.product) {
         await Product.findByIdAndUpdate(item.productId || item.product, {
           $inc: { soldCount: item.quantity }
         });
      }
    }

    // 5. Success Response
    res.status(200).json({ 
      success: true, 
      message: "Order placed successfully!",
      orderId: newOrder._id 
    });

  } catch (error) {
    console.error("Checkout Crash:", error);
    res.status(500).json({ success: false, error: "Failed to create order." });
  }
});