const express = require('express');
const {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByProduct
} = require('../../controllers/reviewController/reviewController');

const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.route('/:productId')
  .get(getReviewsByProduct)
  .post(protect, createReview);

// Edit or delete an existing review (must be the owner)
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
