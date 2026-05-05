const mongoose = require('mongoose');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); 
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); 

const Product = require('../models/ProductModel.js'); 
const User = require('../models/UserModel');       
const productsDataRaw = require('./data.js'); 
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { connectDb } = require('../config/db');

// -------------------------------------------------------------------
// R2 Storage Setup (AWS S3 Client)
// -------------------------------------------------------------------
const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const HF_API_URL = "https://anshutkr-anshu-api-remover.hf.space/remove-bg";

// ⚡ LIMIT PRODUCTS: Yahan humne sirf pehle 26 products ko slice kar liya hai
const allProductsData = Array.isArray(productsDataRaw) ? productsDataRaw : [productsDataRaw];
const productsData = allProductsData.slice(0, 26); 

// -------------------------------------------------------------------
// HELPER: Fetch with Timeout (Hang hone se bachane ke liye)
// -------------------------------------------------------------------
const fetchWithTimeout = async (resource, options = {}) => {
    const { timeout = 30000 } = options; // Default 30s
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

// -------------------------------------------------------------------
// HELPER 1: Upload to Cloudflare R2
// -------------------------------------------------------------------
const uploadToR2 = async (buffer) => {
    const fileName = `ProductVariants/anshu_cut_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: "image/png",
    });

    await s3Client.send(command);
    
    return {
        url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
        public_id: fileName 
    };
};

// -------------------------------------------------------------------
// HELPER 2: API Request & R2 Flow (With Timeout)
// -------------------------------------------------------------------
const processImageBgAndUpload = async (imageUrl, indexInfo) => {
    if (!imageUrl) return null;
    
    try {
        console.log(`      📥 Processing [${indexInfo}]: ${imageUrl.split('/').pop().substring(0, 15)}...`);
        
        // 1. Fetch original image (30s timeout)
        const response = await fetchWithTimeout(imageUrl, { timeout: 30000 });
        if (!response.ok) throw new Error("Original image fetch failed");
        const blob = await response.blob();

        // 2. Remove BG via HF API (60s timeout kyunki AI process mein time lagta hai)
        const formData = new FormData();
        formData.append('file', blob, 'image.png');

        const apiRes = await fetchWithTimeout(HF_API_URL, { 
            method: 'POST', 
            body: formData,
            timeout: 60000 // 1 Minute Max Wait
        });
        
        if (!apiRes.ok) throw new Error(`API Error: ${apiRes.statusText}`);

        // 3. Get image buffer
        const arrayBuffer = await apiRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. Upload to Cloudflare R2
        console.log(`      ☁️  Uploading to R2...`);
        const r2Data = await uploadToR2(buffer);
        console.log(`      ✅  Success!`);
        
        return r2Data;
    } catch (err) {
        if (err.name === 'AbortError') {
            console.error(`      ⚠️  TIMEOUT: Image took too long. Using original URL.`);
        } else {
            console.error(`      ⚠️  FAILED: ${err.message}. Using original URL.`);
        }
        return { url: imageUrl, public_id: `fallback_${Date.now()}` };
    }
};

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
// MAIN SEED LOGIC
// -------------------------------------------------------------------
const seedProducts = async () => {
    try {
        await connectDb();
        console.log(`🚀 Starting R2 + AI BG Removal for ${productsData.length} Products...\n`);

        let adminUser = await User.findOne({ role: 'admin' });
        const sellerId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

        const formattedProducts = [];

        for (let index = 0; index < productsData.length; index++) {
            let product = cleanBsonObj(productsData[index]);
            if (!product) continue;

            console.log(`\n📦 Product ${index + 1}/${productsData.length}: ${product.name}`);
            
            product.seller = sellerId;
            delete product._id;
            delete product.createdAt;
            delete product.updatedAt;
            delete product.__v;

            // Process Main Images
            if (product.images && Array.isArray(product.images)) {
                const updatedImages = [];
                for (let i = 0; i < product.images.length; i++) {
                    const originalUrl = product.images[i].url || product.images[i];
                    const r2Data = await processImageBgAndUpload(originalUrl, `Main Img ${i+1}`);
                    updatedImages.push(r2Data);
                }
                product.images = updatedImages;
            }

            // Process Variant Images
            if (product.variants && Array.isArray(product.variants)) {
                for (let vIdx = 0; vIdx < product.variants.length; vIdx++) {
                    delete product.variants[vIdx]._id;
                    if (product.variants[vIdx].images && Array.isArray(product.variants[vIdx].images)) {
                        const updatedVarImages = [];
                        for (let i = 0; i < product.variants[vIdx].images.length; i++) {
                            const originalUrl = product.variants[vIdx].images[i].url || product.variants[vIdx].images[i];
                            const r2Data = await processImageBgAndUpload(originalUrl, `Variant ${vIdx+1} Img ${i+1}`);
                            updatedVarImages.push(r2Data);
                        }
                        product.variants[vIdx].images = updatedVarImages;
                    }
                }
            }
            formattedProducts.push(product);
        }

        console.log(`\n🧹 Deleting old data to prevent duplicates...`);
        await Product.deleteMany({});
        
        console.log(`➕ Inserting ${formattedProducts.length} new products into database...`);
        const result = await Product.insertMany(formattedProducts);
        
        console.log("\n✅ SEEDING COMPLETE!");
        console.log(`🛍️ Total Products in DB: ${result.length}`);
        process.exit(0);

    } catch (error) {
        console.error("\n❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedProducts();