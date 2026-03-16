const Product = require('../../models/product/productModel');
const wrapAsync = require('../../utils/errorHandler/wrapAsync');
const ExpressError = require('../../utils/errorHandler/expressError');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../../config/cloudConfig/cloudConfig");

// @desc    Create new product
// @route   POST /api/products/admin/product/new
// @access  Private (Admin/Company)
exports.createProduct = wrapAsync(async (req, res, next) => {
  const{name,description,price,category} = req.body;

  if (!name || !description || !price || !category) {
    throw new ExpressError(400, 'Name, description, price, and category are required.');
  }
  let productData = { ...req.body };
  
  // Set seller from authenticated user
  productData.seller = req.user._id;

  // Separate main images and variant images from req.files
  const mainImages = req.files?.filter(f => f.fieldname === 'images') || [];
  const variantImageFiles = req.files?.filter(f => f.fieldname.startsWith('variantImage_')) || [];

  // Handle main product images upload
  if (mainImages.length > 0) {
    const uploadedImages = [];
    
    for (const file of mainImages) {
      const folderName = "ProductDetails";
      const cleanFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-").toLowerCase()}`;
      const key = `${folderName}/${cleanFileName}`;

      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));

      const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
      uploadedImages.push({
        public_id: key,
        url: fileUrl
      });
    }
    
    productData.images = uploadedImages;
  }

  // Handle variants with images
  if (req.body.variants) {
    const variantsData = JSON.parse(req.body.variants);
    const processedVariants = [];

    for (let i = 0; i < variantsData.length; i++) {
      const v = variantsData[i];
      const variant = {
        color: v.color,
        size: v.size,
        stock: v.stock || 0,
        price: v.price || null
      };

      // Check if this variant has a new image
      if (v.hasNewImage) {
        const variantFile = variantImageFiles.find(f => f.fieldname === `variantImage_${i}`);
        if (variantFile) {
          const key = `ProductVariants/${Date.now()}-${variantFile.originalname.replace(/\s+/g, "-").toLowerCase()}`;
          
          await r2.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: variantFile.buffer,
            ContentType: variantFile.mimetype,
          }));

          variant.image = {
            public_id: key,
            url: `${process.env.R2_PUBLIC_URL}/${key}`
          };
        }
      }

      processedVariants.push(variant);
    }

    productData.variants = processedVariants;
  }

  const product = await Product.create(productData);

  res.status(201).json({ success: true, product });
});

// @desc    Get all products (Public - for Customers)
// @route   GET /api/products
// @access  Public
exports.getAllProducts = wrapAsync(async (req, res, next) => {
  // Yahan hum feature add kar sakte hain jaise Search, Filter, Pagination
  const products = await Product.find({ isActive: true }).populate({
    path: 'reviews',
    select: 'rating',
  }); 

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
exports.getProductDetails = wrapAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'reviews',
    select: 'rating comment createdAt user',
    populate: {
      path: 'user',
      select: 'name _id' // Sirf name (_id is always selected by default, adding just to be explicit) aur koi private data (email, password) nahi!
    }
  });

  if (!product) {
    return next(new ExpressError('Product not found', 404));
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
  const products = await Product.find().populate({
    path: 'reviews',
    select: 'rating',
  });

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
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ExpressError('Product not found', 404));

  // Separate main images and variant images from req.files
  const mainImages = req.files?.filter(f => f.fieldname === 'images') || [];
  const variantImageFiles = req.files?.filter(f => f.fieldname.startsWith('variantImage_')) || [];

  // Logic for handling multiple new main image uploads during update
  if (mainImages.length > 0) {
    // 1. Delete all old images from R2 if they exist
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await r2.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: img.public_id,
          }));
        }
      }
    }

    // 2. Upload new images
    const uploadedImages = [];
    for (const file of mainImages) {
      const key = `ProductDetails/${Date.now()}-${file.originalname.replace(/\s+/g, "-").toLowerCase()}`;
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));
      
      uploadedImages.push({
        public_id: key,
        url: `${process.env.R2_PUBLIC_URL}/${key}`
      });
    }
    
    req.body.images = uploadedImages;
  }

  // Handle variants with images
  if (req.body.variants) {
    const variantsData = JSON.parse(req.body.variants);
    const processedVariants = [];

    for (let i = 0; i < variantsData.length; i++) {
      const v = variantsData[i];
      const variant = {
        color: v.color,
        size: v.size,
        stock: v.stock || 0,
        price: v.price || null
      };

      // Check if this variant has a new image
      if (v.hasNewImage) {
        const variantFile = variantImageFiles.find(f => f.fieldname === `variantImage_${i}`);
        if (variantFile) {
          // Delete old variant image if exists
          if (v.existingImage?.public_id) {
            await r2.send(new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: v.existingImage.public_id,
            }));
          }

          const key = `ProductVariants/${Date.now()}-${variantFile.originalname.replace(/\s+/g, "-").toLowerCase()}`;
          
          await r2.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: variantFile.buffer,
            ContentType: variantFile.mimetype,
          }));

          variant.image = {
            public_id: key,
            url: `${process.env.R2_PUBLIC_URL}/${key}`
          };
        }
      } else if (v.existingImage) {
        // Keep existing image
        variant.image = v.existingImage;
      }

      processedVariants.push(variant);
    }

    req.body.variants = processedVariants;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
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

  // 1. Agar images cloud se hatani hongi, toh logic idhar likhna padega
  // Cloudinary destroy logic yahan aayega future mein

  // 2. Document delete karo
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});


