const mongoose = require('mongoose');

  const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true }, // Order ke time ka naam
  price: { type: Number, required: true }, // Order ke time ka price
  image: { type: String, required: true }, // Order ke time ki image
  quantity: { type: Number, required: true, min: 1 }
});



const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Hum maan kar chal rahe hain ki checkout ke liye login zaroori hai
  },
  orderItems: [orderItemSchema], // Upar wala schema yahan use kiya
  
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },

  paymentInfo: {
    method: { 
      type: String, 
      enum: ['COD', 'Card', 'UPI', 'Razorpay'], 
      default: 'COD' 
    },
    transactionId: { type: String }, // Jab real payment gateway lagega tab kaam aayega
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending'
    }
  },

  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },

  itemsPrice: { type: Number, required: true, default: 0.0 }, // Sirf products ka total
  shippingPrice: { type: Number, required: true, default: 0.0 }, // Delivery charge
  totalAmount: { type: Number, required: true, default: 0.0 }, // Grand Total

  deliveredAt: { type: Date }
  
}, { 
  timestamps: true // Yeh automatically 'createdAt' aur 'updatedAt' field bana dega
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;