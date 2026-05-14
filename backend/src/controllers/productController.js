const Product = require('../models/ProductModel'); 
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require('mongoose');
const r2 = require("../config/cloudConfig");
const sharp = require('sharp'); 

// -------------------------------------------------------------------
// 1. CREATE PRODUCT (With Sharp Compression + R2 & Premium Fields)
// -------------------------------------------------------------------
exports.createProduct = wrapAsync(async (req, res, next) => {
    const { name, description, price, category, brand, stock, isActive, discountPrice } = req.body;

    if (!name || !description || !price || !category) {
        throw new ExpressError(400, 'Required fields missing');
    }

    let productData = {
        name, description, brand, category,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        stock: Number(stock) || 1,
        isActive: isActive === 'true' || isActive === true,
        seller: req.user._id, 
        images: [], 
        variants: [] 
    };

    // ⚡ PARSE PREMIUM FIELDS FROM FRONTEND ⚡
    if (req.body.flashDeal) productData.flashDeal = JSON.parse(req.body.flashDeal);
    if (req.body.techSpecs) productData.techSpecs = JSON.parse(req.body.techSpecs);
    if (req.body.lifestyleFeatures) productData.lifestyleFeatures = JSON.parse(req.body.lifestyleFeatures);
    if (req.body.highlights) productData.highlights = JSON.parse(req.body.highlights);
    if (req.body.inTheBox) productData.inTheBox = JSON.parse(req.body.inTheBox);
    if (req.body.promotionalVideo) productData.promotionalVideo = JSON.parse(req.body.promotionalVideo);

    // ⚡ FIX: BOUGHT TOGETHER PARSING ⚡
    if (req.body.boughtTogether !== undefined) {
        try {
            if (req.body.boughtTogether === '') {
                productData.boughtTogether = [];
            } else {
                const parsedBT = JSON.parse(req.body.boughtTogether);
                productData.boughtTogether = Array.isArray(parsedBT) ? parsedBT.filter(id => id && id.length === 24) : [];
            }
        } catch (e) {
            productData.boughtTogether = [];
        }
    }

    const variantImageFiles = req.files?.filter(f => f.fieldname.startsWith('variantImages_')) || [];

    if (req.body.variants) {
        const variantsData = JSON.parse(req.body.variants);
        const processedVariants = [];

        for (let i = 0; i < variantsData.length; i++) {
            const v = variantsData[i];
            const variant = {
                color: v.color, size: v.size,
                stock: Number(v.stock) || 0,
                price: v.price ? Number(v.price) : null,
                images: []
            };

            const thisVariantImages = variantImageFiles.filter(f => {
                const match = f.fieldname.match(/^variantImages_(\d+)_(\d+)$/);
                return match && parseInt(match[1]) === i;
            });

            for (const variantFile of thisVariantImages) {
                const optimizedBuffer = await sharp(variantFile.buffer)
                    .webp({ quality: 80 }) 
                    .toBuffer();

                const key = `Products/${Date.now()}-${Math.random().toString(36).substr(2, 5)}.webp`;
                
                await r2.send(new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: key,
                    Body: optimizedBuffer, 
                    ContentType: 'image/webp',
                }));

                variant.images.push({ public_id: key, url: `${process.env.R2_PUBLIC_URL}/${key}` });
            }
            processedVariants.push(variant);
        }
        productData.variants = processedVariants;
        
        if (processedVariants[0]?.images?.length > 0) {
            productData.images = [processedVariants[0].images[0]];
        }
    }

    const savedProduct = await Product.create(productData);
    res.status(201).json({ success: true, product: savedProduct });
});

// -------------------------------------------------------------------
// 2. GET ALL PRODUCTS
// -------------------------------------------------------------------
exports.getAllProducts = wrapAsync(async (req, res, next) => {
    const { category, brand, minPrice, maxPrice, color } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = { $in: category.split(',') };
    if (brand) filter.brand = { $in: brand.split(',') };
    
    const products = await Product.find(filter)
        .select('name price discountPrice images brand category flashDeal variants ratings highlights')
        .lean(); 

    res.status(200).json({ success: true, count: products.length, products });
});

// -------------------------------------------------------------------
// 3. GET SINGLE PRODUCT
// -------------------------------------------------------------------
exports.getProductDetails = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ExpressError(400, 'Invalid ID');

    const product = await Product.findById(id).populate('boughtTogether', 'name price discountPrice images brand category').lean();
    if (!product) throw new ExpressError(404, 'Product not found');

    const currentTime = new Date();
    const isDealActive = !!(product.flashDeal?.isActive && new Date(product.flashDeal.endTime) > currentTime);

    const relatedProducts = await Product.find({
        _id: { $ne: product._id },
        isActive: true,
        category: product.category 
    }).limit(4).select('name price images brand').lean();

    res.status(200).json({ success: true, product, isDealActive, relatedProducts });
});

// -------------------------------------------------------------------
// 4. UPDATE PRODUCT
// -------------------------------------------------------------------
// -------------------------------------------------------------------
// 4. UPDATE PRODUCT (FIXED: Added Image Upload Logic)
// -------------------------------------------------------------------
exports.updateProduct = wrapAsync(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) throw new ExpressError(404, 'Product not found');

    if (req.body.price) req.body.price = Number(req.body.price);
    
    // ⚡ PARSE PREMIUM FIELDS ON UPDATE ⚡
    if (req.body.flashDeal) req.body.flashDeal = JSON.parse(req.body.flashDeal);
    if (req.body.techSpecs) req.body.techSpecs = JSON.parse(req.body.techSpecs);
    if (req.body.lifestyleFeatures) req.body.lifestyleFeatures = JSON.parse(req.body.lifestyleFeatures);
    if (req.body.highlights) req.body.highlights = JSON.parse(req.body.highlights);
    if (req.body.inTheBox) req.body.inTheBox = JSON.parse(req.body.inTheBox);
    if (req.body.promotionalVideo) req.body.promotionalVideo = JSON.parse(req.body.promotionalVideo);

    // ⚡ SANITIZE BOUGHT TOGETHER ⚡
    if (req.body.boughtTogether !== undefined) {
        try {
            if (req.body.boughtTogether === '') {
                req.body.boughtTogether = [];
            } else if (typeof req.body.boughtTogether === 'string') {
                const parsedBT = JSON.parse(req.body.boughtTogether);
                req.body.boughtTogether = Array.isArray(parsedBT) ? parsedBT.filter(id => id && id.length === 24) : [];
            }
        } catch (e) {
            req.body.boughtTogether = [];
        }
    }

    // ⚡ THE MISSING MAGIC: IMAGE UPLOAD LOGIC FOR UPDATE ⚡
    const variantImageFiles = req.files?.filter(f => f.fieldname.startsWith('variantImages_')) || [];

    // Pehle se parse hoke aayega kyuki frontend stringify karke bhejta hai
    if (req.body.variants) {
        const variantsData = typeof req.body.variants === 'string' ? JSON.parse(req.body.variants) : req.body.variants;
        const processedVariants = [];

        for (let i = 0; i < variantsData.length; i++) {
            const v = variantsData[i];
            
            // Purani images ko maintain rakho jo frontend ne retain ki hain
            const variant = {
                color: v.color, size: v.size,
                stock: Number(v.stock) || 0,
                price: v.price ? Number(v.price) : null,
                images: v.existingImages || [] 
            };

            // Is variant ki nayi aayi hui images filter karo
            const thisVariantImages = variantImageFiles.filter(f => {
                const match = f.fieldname.match(/^variantImages_(\d+)_(\d+)$/);
                return match && parseInt(match[1]) === i;
            });

            // Nayi images compress karke R2 par upload karo
            for (const variantFile of thisVariantImages) {
                const optimizedBuffer = await sharp(variantFile.buffer)
                    .webp({ quality: 80 }) 
                    .toBuffer();

                const key = `Products/${Date.now()}-${Math.random().toString(36).substr(2, 5)}.webp`;
                
                await r2.send(new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: key,
                    Body: optimizedBuffer, 
                    ContentType: 'image/webp',
                }));

                // Upload hone ke baad nayi image variant array me daal do
                variant.images.push({ public_id: key, url: `${process.env.R2_PUBLIC_URL}/${key}` });
            }
            processedVariants.push(variant);
        }
        
        // Final variants array aur main product images update karo
        req.body.variants = processedVariants;

        if (processedVariants[0]?.images?.length > 0) {
            req.body.images = [processedVariants[0].images[0]];
        }
    }

    // ⚡ Ab save karo saari images aur text ke sath
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true,
    });

    res.status(200).json({ success: true, product: updatedProduct });
});

// -------------------------------------------------------------------
// 5. DELETE PRODUCT
// -------------------------------------------------------------------
exports.deleteProduct = wrapAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new ExpressError(404, 'Product not found');
    res.status(200).json({ success: true, message: 'Product deleted' });
});

// -------------------------------------------------------------------
// 6. GET ADMIN PRODUCTS
// -------------------------------------------------------------------
exports.getAdminProducts = async (req, res, next) => {
    try {
        console.log("👉 Database se admin products fetch ho rahe hain...");
        const products = await Product.find();
        console.log(`✅ Success! ${products.length} products found.`);
        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        console.error("🔥 ERROR IN getAdminProducts:", error); 
        res.status(500).json({ success: false, message: error.message });
    }
};

// -------------------------------------------------------------------
// 7. TOGGLE FEATURED STATUS
// -------------------------------------------------------------------
exports.toggleFeaturedStatus = wrapAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ExpressError(404, 'Product not found'));
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
        success: true,
        isFeatured: product.isFeatured
    });
});