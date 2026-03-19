const express = require('express');
const multer = require('multer');

const upload = require('../../middleware/upload/upload');
const {
  createProduct,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
} = require('../../controllers/productController/productController');

const {getSearchSuggestions,fullSearch} = require('../../controllers/productController/searchProductController');
const { toggleFeaturedStatus } = require('../../controllers/productController/productController');

// Ye do middleware check karte hain ki user logged in hai aur admin/company role se hai
const { protect } = require('../../middleware/authMiddleware');
const { adminOnly, superAdminOnly } = require('../../middleware/roleMiddleware');

const router = express.Router();

// ----------------------------------------------------
// PUBLIC ROUTES (For Customers / Anyone)
// ----------------------------------------------------

// 1. Pehle General Route
router.route('/').get(getAllProducts); 

// 2. PHIR SEARCH ROUTES (Hamesha /:id se upar hone chahiye)
// Path same hain: /search-suggestions aur /search
router.route('/search-suggestions').get(getSearchSuggestions); 
router.route('/search').get(fullSearch); 

// 3. SABSE AAKHIR MEIN DYNAMIC ID ROUTE
// Taki Express 'search-suggestions' ko ID na samajh le
router.route('/:id').get(getProductDetails); 


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

 router
  .route('/admin/product/:id/feature')
  .patch(protect, adminOnly, toggleFeaturedStatus);

module.exports = router;