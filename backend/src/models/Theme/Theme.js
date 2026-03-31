// models/Theme/Theme.js
const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  campaignName: { type: String, required: true },
  festivalName: { type: String, required: true }, // 👈 Ye add karna zaroori hai
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
  // Notice: 'colors' wala object yahan se hata diya hai
}, { timestamps: true });

module.exports = mongoose.model('Theme', themeSchema);