const Product = require('../../models/product/productModel');
const Review = require('../../models/review/reviewModel');
const wrapAsync = require('../../utils/errorHandler/wrapAsync');
const ExpressError = require('../../utils/errorHandler/expressError');

// @desc    Create Review
// @route   POST /api/reviews/:productId
// @access  Private (Logged in Users)
exports.createReview = wrapAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  // Let's allow reviews on arbitrary external IDs (like FakeStore numerical IDs)
  let product = null;
  if (productId.length === 24) {
    // Looks like an ObjectId
    product = await Product.findById(productId);
  }

  // Check if user already reviewed
  const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
  if (alreadyReviewed) {
    return next(new ExpressError(400, 'You have already reviewed this product. Please edit your existing review.'));
  }

  // Create new review
  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    comment,
  });

  // If local product exists, add review to product array
  if (product) {
    product.reviews.push(review._id);
    await product.save({ validateBeforeSave: false });
  }

  const populatedReview = await Review.findById(review._id).populate('user', 'name');

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    review: populatedReview,
  });
});

// @desc    Get Reviews by Product ID
// @route   GET /api/reviews/:productId
// @access  Public
exports.getReviewsByProduct = wrapAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.status(200).json({
    success: true,
    reviews,
  });
});

// @desc    Update Review
// @route   PUT /api/reviews/:id
// @access  Private (Owner of the review)
exports.updateReview = wrapAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ExpressError(404, 'Review not found'));
  }

  // Ownership Check: Sirf wahi user edit kar sakta hai jisne review banaya hai
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ExpressError(403, 'You are not authorized to update this review'));
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  await review.save();

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    review,
  });
});

// @desc    Delete Review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner of the review)
exports.deleteReview = wrapAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ExpressError(404, 'Review not found'));
  }

  // Ownership Check
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ExpressError(403, 'You are not authorized to delete this review'));
  }

  const productId = review.product;

  await review.deleteOne();

  // Remove the review ID from the Product's reviews array
  await Product.findByIdAndUpdate(productId, {
    $pull: { reviews: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});
