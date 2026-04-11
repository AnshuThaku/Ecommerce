const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
      maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      maxLength: [8, 'Price cannot exceed 8 characters']
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
    },
    brand: {
      type: String,
      required: [true, 'Please enter product brand']
    },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      maxLength: [4, 'Stock cannot exceed 4 characters'],
      default: 1
    },
    // FIX: Main images ko array format mein update kiya jisme default empty hai
    images: {
      type: [
        {
          public_id: {
            type: String,
            required: true
          },
          url: {
            type: String,
            required: true
          }
        }
      ],
      default: []
    },
    variants: [
      {
        color: { type: String },
        size: { type: String },
        stock: { type: Number, default: 0 },
        price: { type: Number },
        images: [
          {
            public_id: { type: String },
            url: { type: String }
          }
        ]
      }
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
  
soldCount: { 
  type: Number, 
  default: 0 // Default 0 rahega, order hone par badhega
},
isFeatured: {
    type: Boolean,
    default: false
},
flashDeal: {
    isActive: { 
      type: Boolean, 
      default: false 
    },
    dealPrice: { 
      type: Number, 
      default: 0 
    },
    startTime: { 
      type: Date 
    },
    endTime: { 
      type: Date 
    }
  }
  },
  { timestamps: true }

);
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// ✅ Sahi Tarika (Crash-proof)
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = Product;