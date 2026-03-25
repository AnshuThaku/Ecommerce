const Product = require('../../models/product/productModel');
const History = require('../../models/History/HistoryModel');
const recommendationService = require('../../services/recomendationservice'); 
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

    // Missing 'flashDeal' field fixed here
    const requiredFields = 'name price discountPrice images variants category brand stock ratings soldCount flashDeal';

    // ---------------------------------------------------------
    // 2. PERSONALIZED SECTIONS (Based on User/Guest Behavior)
    // ---------------------------------------------------------
    
    // Engine se data aayega. Ab isme duplication (Set logic se) already fix ho chuka hai.
    let recentlyViewed = await recommendationService.getRecentlyViewed(identity);
    let recommended = await recommendationService.getPersonalizedProducts(identity);

    // 🚫 MAINE YAHAN SE "FALLBACK LOGIC" HATA DIYA HAI. 🚫
    // Ab agar naya user hoga -> recommended array [] jayega -> Frontend is section ko hide kar dega.

    // ---------------------------------------------------------
    // 3. GLOBAL SECTIONS (Defaults for Everyone/New Users)
    // ---------------------------------------------------------
    
    // 1. Saare active products utha lo jinki detail chahiye
    const allActiveProducts = await Product.find({ isActive: true })
        .select(requiredFields)
        .lean(); 

    // 2. Pure JavaScript se khud dhundo kahan deal on hai
    const flashDeals = allActiveProducts
        .filter(p => {
            return p.flashDeal && (p.flashDeal.isActive === true || p.flashDeal.isActive === 'true');
        })
        .slice(0, 4); 

    // Section A: Featured Products
    const featured = await Product.find({ isFeatured: true, isActive: true })
        .limit(5)
        .select(requiredFields)
        .lean();

    // Section B: Trending Now
    const trending = await Product.find({ isActive: true })
        .sort({ soldCount: -1 })
        .limit(8)
        .select(requiredFields)
        .lean();

    // Section C: New Arrivals
    const newArrivals = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(4)
        .select(requiredFields)
        .lean();

    // ---------------------------------------------------------
    // 4. COMBINED RESPONSE
    // ---------------------------------------------------------
    res.status(200).json({
        success: true,
        data: {
            flashDeals,         
            recentlyViewed: recentlyViewed || [], 
            recommended: recommended || [], // Naye user ke liye ye empty jayega
            featured,
            trending,
            newArrivals
        }
    });
});