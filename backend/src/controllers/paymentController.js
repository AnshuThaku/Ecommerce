const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel'); // Apna file path ek baar check kar lena (capital O ya small o)

// Razorpay ka instance banayein .env keys ke sath
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------------------------------------------------------------------
// API 1: Naya Order Create Karna
// -------------------------------------------------------------------
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Frontend se amount aayega

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        const options = {
            amount: amount * 100, // Razorpay hamesha paise (paisa) mein amount leta hai
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        // Razorpay se order create karwao
        const order = await razorpayInstance.orders.create(options);
        
        // Frontend ko order details bhej do
        res.status(200).json({ 
            success: true, 
            order,
            key_id: process.env.RAZORPAY_KEY_ID 
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: 'Error creating order' });
    }
};

// -------------------------------------------------------------------
// API 2: Payment Verify Karna aur Database mein Save Karna
// -------------------------------------------------------------------
exports.verifyPayment = async (req, res) => {
    try {
        // Frontend se aane wali details
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

        // Security ke liye backend par signature recreate karein
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // 1. Check karein ki signature match hota hai ya nahi
        if (razorpay_signature === expectedSign) {
            // ✅ PAYMENT 100% SUCCESSFUL

            try {
                // ⚡ FIX: Fallback for req.user if middleware is missing
                const userId = req.user ? req.user._id : null;

                // ⚡ FIX: Matching Exact Mongoose Schema
                const newOrder = new Order({
                    user: userId, 
                    items: orderDetails.items, // frontend se 'items' aa raha hai
                    totalAmount: orderDetails.totalAmount,
                    shippingAddress: orderDetails.shippingAddress, // frontend ne poora object bheja hai
                    paymentMethod: 'Razorpay',
                    paymentStatus: 'Paid',
                    transactionId: razorpay_payment_id
                });
                
                await newOrder.save();

                return res.status(200).json({ 
                    success: true, 
                    message: "Payment verified successfully & Order Saved!" 
                });

            } catch (dbError) {
                // Agar Payment ho gaya par DB save nahi hua
                console.error("❌ Database Save Error:", dbError.message);
                return res.status(500).json({ 
                    success: false, 
                    message: "Payment successful but Database Error: " + dbError.message 
                });
            }

        } else {
            // ❌ FAKE/HACKED PAYMENT
            return res.status(400).json({ 
                success: false, 
                message: "Invalid signature sent! Payment failed." 
            });
        }
    } catch (error) {
        console.error("Verification Route Error:", error);
        res.status(500).json({ success: false, message: 'Error verifying payment' });
    }
};