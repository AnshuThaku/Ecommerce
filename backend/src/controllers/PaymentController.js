const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel'); 

// Razorpay ka instance banayein .env keys ke sath
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API 1: Naya Order Create Karna
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Frontend se amount aayega

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        const options = {
            amount: amount * 100, // Razorpay hamesha paise mein amount leta hai (e.g., 100 Rs = 10000 paise)
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        // Razorpay se order create karwao
        const order = await razorpayInstance.orders.create(options);
        
        // Frontend ko order details bhej do
        res.status(200).json({ 
            success: true, 
            order,
            key_id: process.env.RAZORPAY_KEY_ID // Frontend ko ID chahiye hoti hai popup kholne k liye
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: 'Error creating order' });
    }
};

// API 2: Payment Verify Karna aur Database mein Save Karna
exports.verifyPayment = async (req, res) => {
    try {
        // Frontend se payment hone ke baad ye 3 cheezein aayengi
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

        // Security ke liye apna signature khud banayein backend pe
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // Match karein ki Razorpay ka signature aur humara signature same hai ya nahi
        if (razorpay_signature === expectedSign) {

          const newOrder = new Order({
                user: req.user._id,
                products: orderDetails.products,
                totalAmount: orderDetails.totalAmount,
                paymentStatus: 'Paid',
                paymentId: razorpay_payment_id
            });
            await newOrder.save();
        

            return res.status(200).json({ 
                success: true, 
                message: "Payment verified successfully & Order Saved!" 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid signature sent! Payment failed." 
            });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: 'Error verifying payment' });
    }
};