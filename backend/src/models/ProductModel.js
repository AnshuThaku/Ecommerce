// models/ProductModel.js ke andar apna schema is tarah update karein:
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }, // Short description ke liye use kar sakte hain
    brand: { type: String },
    category: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ public_id: String, url: String }],
    variants: [{ color: String, size: String, stock: Number, price: Number, images: [{ public_id: String, url: String }] }],
    flashDeal: { isActive: Boolean, dealPrice: Number, startTime: Date, endTime: Date },
    
    // ⚡ NAYE PREMIUM FIELDS ⚡
// Models/Product.js mein isse update karo:
techSpecs: [{ 
  category: String, 
  description: String, // Purane data ke liye
  details: [String]    // Naye Array data ke liye
}], 
   lifestyleFeatures: [{ title: String, description: String, imageUrl: String }], // e.g., [{ title: 'Waterproof', description: '...', imageUrl: '...' }]
    highlights: [{ iconName: String, title: String }], // e.g., [{ iconName: 'Battery', title: '24-hour battery' }]
    promotionalVideo: { url: String, thumbnailUrl: String }, 
    inTheBox: [String], // e.g., ['Speaker', 'Charging Base', 'Cable']

    boughtTogether: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }],
    
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);