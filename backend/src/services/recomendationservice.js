const History = require('../models/History/HistoryModel');
const Product = require('../models/product/productModel');

// 🧠 1. Get Recently Viewed (Sirf Views aayenge)
exports.getRecentlyViewed = async ({ userId, guestId }) => {
    if (!userId && !guestId) return [];

    const filter = userId ? { user: userId } : { guestId: guestId };
    
    const historyRecords = await History.find({ ...filter, product: { $exists: true } })
        .sort({ viewedAt: -1 })
        .limit(10);

    if (historyRecords.length === 0) return [];

    const productIds = historyRecords.map(record => record.product);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true })
        .select('name price discountPrice images variants category brand stock');

    const orderedProducts = [];
    productIds.forEach(id => {
        const prod = products.find(p => p._id.toString() === id.toString());
        if (prod) orderedProducts.push(prod);
    });

    return orderedProducts;
};

// 🧠 2. The Recommendation Engine (Views + Searches Dono se seekhega)
exports.getPersonalizedProducts = async ({ userId, guestId }) => {
    if (!userId && !guestId) return [];
    const filter = userId ? { user: userId } : { guestId: guestId };

    // STEP A: Views History nikalo
    const recentViews = await History.find({ ...filter, product: { $exists: true } })
        .sort({ viewedAt: -1 }).limit(10);
    const viewedProductIds = recentViews.map(h => h.product).filter(Boolean);
    const viewedProducts = await Product.find({ _id: { $in: viewedProductIds } }).select('category brand');

    const favCategories = [...new Set(viewedProducts.map(p => p.category).filter(c => c && c.trim() !== ''))];
    const favBrands = [...new Set(viewedProducts.map(p => p.brand).filter(b => b && b.trim() !== ''))];

    // STEP B: Search History nikalo
    const recentSearchesHistory = await History.find({ ...filter, searchQuery: { $exists: true } })
        .sort({ searchedAt: -1 }).limit(5);
    const recentSearches = [...new Set(recentSearchesHistory.map(h => h.searchQuery).filter(Boolean))];

    // Agar user ne na kuch dekha, na kuch search kiya -> No recommendations
    if (favCategories.length === 0 && favBrands.length === 0 && recentSearches.length === 0) return [];

    // STEP C: Smart Query Banao (Dono data mix karke)
    const orConditions = [];
    
    if (favCategories.length > 0) orConditions.push({ category: { $in: favCategories } });
    if (favBrands.length > 0) orConditions.push({ brand: { $in: favBrands } });

    // Jo words user ne search kiye the, un words ko category, brand ya name mein dhoondo
    recentSearches.forEach(term => {
        const regex = new RegExp(term, 'i');
        orConditions.push({ name: regex });
        orConditions.push({ category: regex });
        orConditions.push({ brand: regex });
    });

    // STEP D: Final Result Nikalo
    const recommended = await Product.find({
        isActive: true,
        _id: { $nin: viewedProductIds }, // Jo dekh chuka hai wo dobara mat dikhao
        $or: orConditions
    })
    .limit(8)
    .select('name price discountPrice images variants category brand stock');

    return recommended;
};