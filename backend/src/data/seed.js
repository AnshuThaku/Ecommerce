const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); 

const Product = require('../models/ProductModel'); 
const User = require('../models/UserModel');       
const productsDataRaw = require('./data.js'); 
const dns = require("dns");
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { connectDb } = require('../config/db');

// Export handling (Array check)
const productsData = Array.isArray(productsDataRaw) 
    ? productsDataRaw 
    : (productsDataRaw.products || [productsDataRaw]);

// BSON object cleaner ($oid, $date)
const cleanBsonObj = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj.$oid) return obj.$oid;
    if (obj.$date) return new Date(obj.$date);
    if (Array.isArray(obj)) return obj.map(cleanBsonObj);
    const cleaned = {};
    for (const key in obj) cleaned[key] = cleanBsonObj(obj[key]);
    return cleaned;
};

const seedProducts = async () => {
    try {
        await connectDb();
        console.log("🚀 Starting Fast Data Seeding (No BG Removal)...\n");

        // 1. Admin Seller Link
        let adminUser = await User.findOne({ role: 'admin' });
        const sellerId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

        const formattedProducts = [];

        for (let index = 0; index < productsData.length; index++) {
            let rawProduct = productsData[index];
            if (!rawProduct || typeof rawProduct !== 'object') continue;

            let product = cleanBsonObj(rawProduct);
            
            // Basic Info Cleanup
            product.seller = sellerId;
            delete product._id;
            delete product.createdAt;
            delete product.updatedAt;
            delete product.__v;

            // ⚡ Main Images Formatting (Keeping original URLs)
            if (product.images && Array.isArray(product.images)) {
                product.images = product.images.map((img, i) => {
                    const imageUrl = img.url || (typeof img === 'string' ? img : '');
                    return {
                        url: imageUrl,
                        public_id: img.public_id || `main_${index}_${i}_${Date.now()}`
                    };
                });
            }

            // ⚡ Variant Images Formatting (Keeping original URLs)
            if (product.variants && Array.isArray(product.variants)) {
                product.variants = product.variants.map((variant, vIndex) => {
                    delete variant._id; 
                    
                    if (variant.images && Array.isArray(variant.images)) {
                        variant.images = variant.images.map((img, i) => {
                            const imageUrl = img.url || (typeof img === 'string' ? img : '');
                            return {
                                url: imageUrl,
                                public_id: img.public_id || `variant_${index}_${vIndex}_${i}_${Date.now()}`
                            };
                        });
                    }
                    return variant;
                });
            }

            formattedProducts.push(product);
        }

        console.log(`🧹 Cleaning old heavy products from DB...`);
        await Product.deleteMany({});
        
        console.log(`➕ Inserting ${formattedProducts.length} lightweight products...`);
        const result = await Product.insertMany(formattedProducts);
        
        console.log("\n✅ SEEDING SUCCESSFUL!");
        console.log(`🛍️ Total Products in DB: ${result.length}`);
        process.exit(0);

    } catch (error) {
        console.error("\n❌ Seeding Error:", error.message);
        process.exit(1);
    }
};

seedProducts();