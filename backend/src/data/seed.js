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

            // ⚡ NAYA LOGIC: Saari purani ya invalid IDs ko delete kar do
            // Mongoose automatically perfectly valid naye IDs bana dega!
            delete product._id;
            delete product.createdAt;
            delete product.updatedAt;
            delete product.__v;

            // Variants ke andar ki IDs bhi delete karo
            if (product.variants && Array.isArray(product.variants)) {
                product.variants.forEach(variant => {
                    delete variant._id;
                    if (variant.images && Array.isArray(variant.images)) {
                        variant.images.forEach(img => delete img._id);
                    }
                });
            }

            // Main images ki IDs bhi delete karo
            if (product.images && Array.isArray(product.images)) {
                product.images.forEach(img => delete img._id);
            }

            formattedProducts.push(product);
        }

        console.log(`🧹 Deleting old products from database...`);
        // Delete ALL old products
        await Product.deleteMany({});
        
        console.log(`➕ Inserting ${formattedProducts.length} new products into database...`);
        // Insert ALL fresh data
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