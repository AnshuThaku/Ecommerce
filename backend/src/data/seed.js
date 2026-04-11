const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); 
const Product = require('../models/ProductModel'); // Path theek hai ensure karein
const User = require('../models/UserModel');       // Path theek hai ensure karein
const productsData = require('./data.js'); 

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const { connectDb } = require('../config/db');
connectDb();





// Helper function to clean BSON types ($oid, $date)
const cleanBsonObj = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj.$oid) return obj.$oid;
    if (obj.$date) return new Date(obj.$date);

    // Recursively clean arrays
    if (Array.isArray(obj)) {
        return obj.map(cleanBsonObj);
    }

    // Recursively clean nested objects
    const cleaned = {};
    for (const key in obj) {
        cleaned[key] = cleanBsonObj(obj[key]);
    }
    return cleaned;
};

const seedProducts = async () => {
    try {
        console.log("Preparing Data...");

        let adminUser = await User.findOne({ role: 'admin' });
        const sellerId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

        const formattedProducts = productsData.map((rawProduct, index) => {
            // 1. Clean BSON wrappers like $oid and $date
            let product = cleanBsonObj(rawProduct);

            // 2. Add seller ID
            product.seller = sellerId;

            // 3. Add fake public_ids for images to pass validation
            if (product.images && product.images.length > 0) {
                product.images = product.images.map((img, i) => ({
                    url: img.url || img,
                    public_id: `seed_main_${index}_${i}`
                }));
            }

            if (product.variants && product.variants.length > 0) {
                product.variants = product.variants.map((variant, vIndex) => {
                    if (variant.images && variant.images.length > 0) {
                        variant.images = variant.images.map((img, i) => ({
                            url: img.url || img,
                            public_id: `seed_variant_${index}_${vIndex}_${i}`
                        }));
                    }
                    return variant;
                });
            }

            // Mongoose will auto-generate createdAt/updatedAt if we remove them
            delete product.createdAt;
            delete product.updatedAt;
            delete product.__v;

            return product;
        });

        // Delete old products
        await Product.deleteMany({});
        console.log("Old products deleted to avoid duplicates.");

        // Insert fresh data
        await Product.insertMany(formattedProducts);
        
        console.log(`✅ Success! ${formattedProducts.length} Products Added to Database.`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedProducts();