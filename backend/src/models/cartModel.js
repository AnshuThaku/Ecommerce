const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: String, // Changed to String to support FakeStoreAPI IDs (e.g. "1")
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.'],
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Null if guest
  },
  guestId: {
    type: String,
    default: null // Null if logged in user
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true } // 👈 NAYA: Ye hona zaroori hai
}],
  items: [cartItemSchema]
}, { timestamps: true });

// Index to speed up queries for carts based on user or guestId
cartSchema.index({ user: 1, guestId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
