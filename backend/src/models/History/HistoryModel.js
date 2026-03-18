const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestId: { type: String, default: null },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  viewedAt: { type: Date, default: Date.now },
  searchQuery: { type: String, required: false },
  searchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Sirf simple indexing rakhein, UNIQUE nahi
historySchema.index({ user: 1 });
historySchema.index({ guestId: 1 });

module.exports = mongoose.model('History', historySchema);