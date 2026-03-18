const Product = require('../../models/product/productModel');
const wrapAsync = require('../../utils/errorHandler/wrapAsync');
const ExpressError = require('../../utils/errorHandler/expressError');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require('mongoose');
const r2 = require("../../config/cloudConfig");

// @desc    Create new product
// @route   POST /api/products/admin/product/new
// @access  Private (Admin/Company)
exports.createProduct = wrapAsync(async (req, res, next) => {
  console.log("--- BACKEND DATA RECEIVED ---");
  console.log("Req Files:", req.files);
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

  const variantImageFiles = req.files?.filter(f => f.fieldname.startsWith('variantImages_')) || [];

  if (req.body.variants) {
    const variantsData = JSON.parse(req.body.variants);
    const processedVariants = [];

    for (let i = 0; i < variantsData.length; i++) {
      const v = variantsData[i];
      const variant = {
        color: v.color,
        size: v.size,
        stock: v.stock ? Number(v.stock) : 0,
        price: v.price ? Number(v.price) : null,
        images: []
      };

      const thisVariantImages = variantImageFiles.filter(f => {
        const match = f.fieldname.match(/^variantImages_(\d+)_(\d+)$/);
        return match && parseInt(match[1]) === i;
      });

      for (const variantFile of thisVariantImages) {
        const key = `ProductVariants/${Date.now()}-${Math.random().toString(36).substr(2, 5)}-${variantFile.originalname.replace(/\s+/g, "-").toLowerCase()}`;
        
        await r2.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: variantFile.buffer,
          ContentType: variantFile.mimetype,
        }));

        variant.images.push({
          public_id: key,
          url: `${process.env.R2_PUBLIC_URL}/${key}`
        });
      }

      processedVariants.push(variant);
    }

    productData.variants = processedVariants;

    // MAIN LOGIC: Set first variant's first image as main product image
    if (processedVariants.length > 0 && processedVariants[0].images?.length > 0) {
      productData.images = [processedVariants[0].images[0]];
    }
  }

  const product = await Product.create(productData);
  res.status(201).json({ success: true, product });
});

// @desc    Get all products (Public - for Customers)
// @route   GET /api/products
// @access  Public
exports.getAllProducts = wrapAsync(async (req, res, next) => {
  // 🛠️ FIX: Removed .populate('reviews') to prevent 500 error
  const products = await Product.find({ isActive: true }); 

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductDetails = wrapAsync(async (req, res, next) => {
  const { id } = req.params;

  // 🛡️ SHIELD: Pehle check karo ki ID ka format asli MongoDB ID jaisa hai ya nahi
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError(400, 'Invalid Product ID format'));
  }

  // 🛠️ FIND: Ab bina kisi dar ke product dhoondo (Bina populate ke)
  const product = await Product.findById(id);

  if (!product) {
    return next(new ExpressError(404, 'Product not found'));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// @desc    Get all products (Admin)
// @route   GET /api/products/admin/products
// @access  Private (Admin)
exports.getAdminProducts = wrapAsync(async (req, res, next) => {
  // 🛠️ FIX: Removed .populate('reviews')
  const products = await Product.find();

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// @desc    Update Product
// @route   PUT /api/products/admin/product/:id
// @access  Private (Admin/Company)
exports.updateProduct = wrapAsync(async (req, res, next) => {
  console.log("--- BACKEND DATA RECEIVED ---");
  console.log("Req Files:", req.files);
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ExpressError('Product not found', 404));

  const { name, description, price, category, brand, stock, isActive, discountPrice } = req.body;
  
  let updateData = {
    name,
    description,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : 0,
    category,
    brand,
    stock: stock ? Number(stock) : 1,
    isActive: isActive === 'true' || isActive === true,
  };

  const variantImageFiles = req.files?.filter(f => f.fieldname.startsWith('variantImages_')) || [];

  if (req.body.variants) {
    const variantsData = JSON.parse(req.body.variants);
    const processedVariants = [];

    for (let i = 0; i < variantsData.length; i++) {
      const v = variantsData[i];
      const variant = {
        color: v.color,
        size: v.size,
        stock: v.stock ? Number(v.stock) : 0,
        price: v.price ? Number(v.price) : null,
        images: v.existingImages || [] 
      };

      const thisVariantImages = variantImageFiles.filter(f => {
        const match = f.fieldname.match(/^variantImages_(\d+)_(\d+)$/);
        return match && parseInt(match[1]) === i;
      });

      for (const variantFile of thisVariantImages) {
        const key = `ProductVariants/${Date.now()}-${Math.random().toString(36).substr(2, 5)}-${variantFile.originalname.replace(/\s+/g, "-").toLowerCase()}`;
        
        await r2.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: variantFile.buffer,
          ContentType: variantFile.mimetype,
        }));

        variant.images.push({
          public_id: key,
          url: `${process.env.R2_PUBLIC_URL}/${key}`
        });
      }

      processedVariants.push(variant);
    }

    updateData.variants = processedVariants;

    if (processedVariants.length > 0 && processedVariants[0].images?.length > 0) {
      updateData.images = [processedVariants[0].images[0]];
    } else {
      updateData.images = [];
    }
  }

  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
   returnDocument: 'after', // Updated document wapas milega
    runValidators: true,
  });

  res.status(200).json({ success: true, product });
});

// @desc    Delete Product
// @route   DELETE /api/products/admin/product/:id
// @access  Private (Admin)
exports.deleteProduct = wrapAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ExpressError('Product not found', 404));
  }

  // TODO: Add cloud destruction logic later if needed
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/**
 * @desc    Toggle Featured Status of a Product
 * @route   PATCH /api/v1/products/admin/product/:id/feature
 * @access  Private (Admin Only)
 */
exports.toggleFeaturedStatus = wrapAsync(async (req, res, next) => {
    // 1. Product dhoondo
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ExpressError(404, 'Product not found'));
    }

    // 2. Toggle the boolean value (Agar true hai toh false, false hai toh true)
    product.isFeatured = !product.isFeatured;
    
    // 3. Save it
    await product.save();

    res.status(200).json({
        success: true,
        message: `Product is now ${product.isFeatured ? 'Featured' : 'Unfeatured'}`,
        isFeatured: product.isFeatured
    });
});