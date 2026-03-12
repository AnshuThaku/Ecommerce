const express = require('express');
const multer = require('multer');
const upload = require('../../middleware/upload/upload');
const {
  createProduct,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails
} = require('../../controllers/productController/productController');

// Ye do middleware check karte hain ki user logged in hai aur admin/company role se hai
const { protect } = require('../../middleware/authMiddleware');
const { adminOnly, superAdminOnly } = require('../../middleware/roleMiddleware');

const router = express.Router();

// ----------------------------------------------------
// PUBLIC ROUTES (For Customers / Anyone)
// ----------------------------------------------------

router.route('/').get(getAllProducts); // Get all products for shop page
router.route('/:id').get(getProductDetails); // Get single product details by id


// ----------------------------------------------------
// ADMIN / COMPANY PROTECTED ROUTES
// ----------------------------------------------------

router
  .route('/admin/product/new')
  .post(protect, adminOnly, upload.any(), createProduct);

router
  .route('/admin/products')
  .get(protect, adminOnly, getAdminProducts);

router
  .route('/admin/product/:id')
  .put(protect, adminOnly, upload.any(), updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
