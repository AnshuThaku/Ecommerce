const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Saare controllers ko ek hi baar mein sahi se import karo
const {
  createProduct,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  toggleFeaturedStatus // 👈 Ab ye properly handle hoga
} = require('../controllers/productController');

const { 
  getSearchSuggestions, 
  fullSearch 
} = require('../controllers/searchProductController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// --- 1. SEARCH ROUTES ---
router.route('/search-suggestions').get(getSearchSuggestions); 
router.route('/search').get(fullSearch); 

// --- 2. ADMIN ROUTES (Hamesha /:id se upar hone chahiye) ---
router.route('/admin/product/new').post(protect, adminOnly, upload.any(), createProduct);
router.route('/admin/products').get(protect, adminOnly, getAdminProducts);

router
  .route('/admin/product/:id')
  .put(protect, adminOnly, upload.any(), updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router
  .route('/admin/product/:id/feature')
  .patch(protect, adminOnly, toggleFeaturedStatus);

// --- 3. PUBLIC ROUTES ---
router.route('/').get(getAllProducts); 

// 🚨 WARNING: Dynamic ID route SABSE LAST mein hona chahiye! 🚨
router.route('/:id').get(getProductDetails); 

module.exports = router;