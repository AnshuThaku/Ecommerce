const Product = require('../../models/product/productModel');
const History = require('../../models/History/HistoryModel');
const recommendationService = require('../../services/recomendationservice'); // Ensure correct path
const wrapAsync = require('../../utils/errorHandler/wrapAsync');

/**
 * @desc    Get All Home Page Data (Hybrid Model)
 * @route   GET /api/v1/home
 * @access  Public (Uses Optional Auth)
 */
exports.getHomePageData = wrapAsync(async (req, res) => {
    // 1. Identity Setup
    const userId = req.user ? req.user._id : null;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    const identity = { userId, guestId };

    // ---------------------------------------------------------
    // 2. PERSONALIZED SECTIONS (Based on User/Guest Behavior)
    // ---------------------------------------------------------
    
    const recentlyViewed = await recommendationService.getRecentlyViewed(identity);
    const recommended = await recommendationService.getPersonalizedProducts(identity);

    // ---------------------------------------------------------
    // 3. GLOBAL SECTIONS (Defaults for Everyone/New Users)
    // ---------------------------------------------------------
    
    // Zaroori fields jo frontend ko card render karne ke liye chahiye hi chahiye
    const requiredFields = 'name price discountPrice images variants category brand stock ratings';

    // Section A: Featured Products
    const featured = await Product.find({ isFeatured: true, isActive: true })
        .limit(5)
        .select(requiredFields);

    // Section B: Trending Now
    const trending = await Product.find({ isActive: true })
        .sort({ soldCount: -1 })
        .limit(8)
        .select(requiredFields);

    // Section C: New Arrivals
    const newArrivals = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(4)
        .select(requiredFields);

    // ---------------------------------------------------------
    // 4. COMBINED RESPONSE
    // ---------------------------------------------------------
    res.status(200).json({
        success: true,
        data: {
            recentlyViewed: recentlyViewed || [],
            recommended: recommended || [],
            featured,
            trending,
            newArrivals
        }
    });
});