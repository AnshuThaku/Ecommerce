const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); 

const Product = require('../models/ProductModel'); 
const User = require('../models/UserModel');       
const productsData = require('./data.js'); 

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const { connectDb } = require('../config/db');
connectDb();

// -------------------------------------------------------------------
// HELPER: Clean BSON objects ($oid, $date etc.)
// -------------------------------------------------------------------
const cleanBsonObj = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj.$oid) return obj.$oid;
    if (obj.$date) return new Date(obj.$date);
    if (Array.isArray(obj)) return obj.map(cleanBsonObj);
    const cleaned = {};
    for (const key in obj) cleaned[key] = cleanBsonObj(obj[key]);
    return cleaned;
};

// -------------------------------------------------------------------
// MAIN SEED FUNCTION (Direct Database Insert)
// -------------------------------------------------------------------
const seedProducts = async () => {
    try {
        console.log("🚀 Preparing Data for Database Insertion...\n");

        let adminUser = await User.findOne({ role: 'admin' });
        const sellerId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

        const formattedProducts = [];

        // Loop through ALL products in data.js
        for (let index = 0; index < productsData.length; index++) {
            let rawProduct = productsData[index];
            let product = cleanBsonObj(rawProduct);
            
            // Attach Seller ID
            product.seller = sellerId;

            // ⚡ FIX 1: Delete all hardcoded/invalid _ids to let MongoDB generate valid ones
            delete product._id;

            // ⚡ FIX 2: Clean IDs and Ensure 'public_id' exists for Main Images
            if (product.images && product.images.length > 0) {
                product.images = product.images.map((img, i) => {
                    delete img._id; // Clean old _id
                    return {
                        url: img.url || img,
                        public_id: img.public_id || `seed_main_${index}_${i}_${Date.now()}` // Add dummy public_id if missing
                    };
                });
            }

            // ⚡ FIX 3: Clean IDs and Ensure 'public_id' exists for Variant Images
            if (product.variants && product.variants.length > 0) {
                product.variants = product.variants.map((variant, vIndex) => {
                    delete variant._id; // Clean old _id
                    
                    if (variant.images && variant.images.length > 0) {
                        variant.images = variant.images.map((img, i) => {
                            delete img._id; // Clean old _id
                            return {
                                url: img.url || img,
                                public_id: img.public_id || `seed_variant_${index}_${vIndex}_${i}_${Date.now()}` // Add dummy public_id
                            };
                        });
                    }
                    return variant;
                });
            }

            // Remove Mongoose auto-generated fields to avoid conflicts
            delete product.createdAt;
            delete product.updatedAt;
            delete product.__v;

            formattedProducts.push(product);
        }

        console.log(`🧹 Deleting ${await Product.countDocuments()} old products from database...`);
        // ⚡ Delete ALL old products to avoid duplicates
        await Product.deleteMany({});
        
        console.log(`➕ Inserting ${formattedProducts.length} new products into database...`);
        // ⚡ Insert ALL fresh data
        await Product.insertMany(formattedProducts);
        
        console.log("\n=========================================");
        console.log("✅ SEEDING COMPLETE!");
        console.log("=========================================");
        console.log(`🛍️ Total Products Successfully Added : ${formattedProducts.length}`);
        console.log("=========================================\n");

        process.exit(0);

    } catch (error) {
        console.error("\n❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedProducts();