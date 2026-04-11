const Product = require('../models/ProductModel'); 
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require('mongoose');
const r2 = require("../config/cloudConfig");

// -------------------------------------------------------------------
// 1. CREATE PRODUCT
// -------------------------------------------------------------------
exports.createProduct = wrapAsync(async (req, res, next) => {
    const { name, description, price, category, brand, stock, isActive, discountPrice } = req.body;

    if (!name || !description || !price || !category) {
        throw new ExpressError(400, 'Name, description, price, and category are required.');
    }

    let productData = {
        name,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        category,
        brand,
        stock: stock ? Number(stock) : 1,
        isActive: isActive === 'true' || isActive === true,
        seller: req.user._id,
        images: [], 
        variants: [] 
    };

    if (req.body.flashDeal) {
        productData.flashDeal = JSON.parse(req.body.flashDeal);
    }

    // Image & Variant Logic
    const variantImageFiles = req.files?.filter(f => f.fieldname.startsWith('variantImages_')) || [];

    if (req.body.variants) {
        const variantsData = JSON.parse(req.body.variants);
        const processedVariants = [];

        for (let i = 0; i < variantsData.length; i++) {
            const v = variantsData[i];
            const variant = {
                color: v.color,
                size: v.size,
                stock: Number(v.stock) || 0,
                price: v.price ? Number(v.price) : null,
                images: []
            };

            const thisVariantImages = variantImageFiles.filter(f => {
                const match = f.fieldname.match(/^variantImages_(\d+)_(\d+)$/);
                return match && parseInt(match[1]) === i;
            });

            for (const variantFile of thisVariantImages) {
                const key = `ProductVariants/${Date.now()}-${variantFile.originalname.replace(/\s+/g, "-")}`;
                await r2.send(new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: key,
                    Body: variantFile.buffer,
                    ContentType: variantFile.mimetype,
                }));
                variant.images.push({ public_id: key, url: `${process.env.R2_PUBLIC_URL}/${key}` });
            }
            processedVariants.push(variant);
        }
        productData.variants = processedVariants;
        if (processedVariants[0]?.images?.length > 0) productData.images = [processedVariants[0].images[0]];
    }

    const savedProduct = await Product.create(productData);
    res.status(201).json({ success: true, product: savedProduct });
});

// -------------------------------------------------------------------
// 2. GET ALL PRODUCTS (Public)
// -------------------------------------------------------------------
exports.getAllProducts = wrapAsync(async (req, res, next) => {
    const { category, brand, minPrice, maxPrice, color, rating, discount } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = { $in: category.split(',') };
    if (brand) filter.brand = { $in: brand.split(',') };
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (color) filter['variants.color'] = { $in: color.split(',') };
    if (rating) filter['ratings'] = { $gte: Number(rating) };

    const products = await Product.find(filter);

    let filteredProducts = products;
    if (discount === 'true') {
        filteredProducts = products.filter(p => p.discountPrice > 0 || (p.flashDeal?.isActive));
    }

    res.status(200).json({ success: true, count: filteredProducts.length, products: filteredProducts });
});

// -------------------------------------------------------------------
// 3. GET SINGLE PRODUCT
// -------------------------------------------------------------------
exports.getProductDetails = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ExpressError(400, 'Invalid ID format');

    const product = await Product.findById(id);
    if (!product) throw new ExpressError(404, 'Product not found');

    const currentTime = new Date();
    const isDealActive = !!(product.flashDeal?.isActive && new Date(product.flashDeal.endTime) > currentTime);

    const relatedProducts = await Product.find({
        _id: { $ne: product._id },
        isActive: true,
        category: product.category 
    }).limit(4);

    res.status(200).json({ success: true, product, isDealActive, relatedProducts });
});

// -------------------------------------------------------------------
// 4. TOGGLE FEATURED (Zaroori for Routes)
// -------------------------------------------------------------------
exports.toggleFeaturedStatus = wrapAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ExpressError(404, 'Product not found');

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({ success: true, isFeatured: product.isFeatured });
});

// -------------------------------------------------------------------
// 5. UPDATE PRODUCT
// -------------------------------------------------------------------
exports.updateProduct = wrapAsync(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) throw new ExpressError(404, 'Product not found');

    // Use req.body and handle number conversions
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
// 6. DELETE PRODUCT
// -------------------------------------------------------------------
exports.deleteProduct = wrapAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new ExpressError(404, 'Product not found');
    res.status(200).json({ success: true, message: 'Product deleted' });
});

// -------------------------------------------------------------------
// 7. GET ADMIN PRODUCTS
// -------------------------------------------------------------------
exports.getAdminProducts = wrapAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, count: products.length, products });
});