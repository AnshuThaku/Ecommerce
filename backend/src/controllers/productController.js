const Product = require('../models/ProductModel'); 
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require('mongoose');
const r2 = require("../config/cloudConfig");
const sharp = require('sharp'); 

// -------------------------------------------------------------------
// 1. CREATE PRODUCT (With Sharp Compression + R2)
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
        seller: req.user._id, // ⚡ Ensure route is protected, else req.user._id will crash
        images: [], 
        variants: [] 
    };

    if (req.body.flashDeal) productData.flashDeal = JSON.parse(req.body.flashDeal);

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
                // ⚡ FIX: Use Sharp to optimize buffer
                const optimizedBuffer = await sharp(variantFile.buffer)
                    .webp({ quality: 80 }) // 80% quality ke sath webp banayega
                    .toBuffer();

                // ⚡ STEP 3: CLOUDFLARE R2 UPLOAD
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
        
        // Product ki main 'images' array mein first variant ki first image daal do (Display ke liye)
        if (processedVariants[0]?.images?.length > 0) {
            productData.images = [processedVariants[0].images[0]];
        }
    }

    const savedProduct = await Product.create(productData);
    res.status(201).json({ success: true, product: savedProduct });
});

// -------------------------------------------------------------------
// 2. GET ALL PRODUCTS (Fast Query with .lean() & .select())
// -------------------------------------------------------------------
exports.getAllProducts = wrapAsync(async (req, res, next) => {
    const { category, brand, minPrice, maxPrice, color } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = { $in: category.split(',') };
    if (brand) filter.brand = { $in: brand.split(',') };
    
    // ⚡ Optimization: .select() only needed fields and .lean() for speed
    const products = await Product.find(filter)
        .select('name price discountPrice images brand category flashDeal variants ratings')
        .lean(); // 🔥 Lean queries are 5x faster

    res.status(200).json({ success: true, count: products.length, products });
});

// -------------------------------------------------------------------
// 3. GET SINGLE PRODUCT
// -------------------------------------------------------------------
exports.getProductDetails = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ExpressError(400, 'Invalid ID');

    // ⚡ Optimization: Lean query
    const product = await Product.findById(id).lean();
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
exports.updateProduct = wrapAsync(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) throw new ExpressError(404, 'Product not found');

    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.flashDeal) req.body.flashDeal = JSON.parse(req.body.flashDeal);
    if (req.body.variants) req.body.variants = JSON.parse(req.body.variants);

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
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
exports.getAdminProducts = wrapAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, count: products.length, products });
});

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