const Product = require('../models/ProductModel'); 
const wrapAsync = require('../utils/wrapAsync');

// -------------------------------------------------------------------
// 1. SMART SUGGESTIONS API (Universal)
// -------------------------------------------------------------------
exports.getSearchSuggestions = wrapAsync(async (req, res) => {
  const searchQuery = req.query.q ? req.query.q.trim() : "";
  if (!searchQuery) return res.status(200).json({ success: true, suggestions: [] });

  const regex = { $regex: searchQuery, $options: 'i' };

  const suggestions = await Product.find({
    isActive: true, // ⚡ FIX: Sirf active products hi suggest ho
    $or: [
      { name: regex },
      { category: regex },
      { brand: regex },
      { 'variants.color': regex }
    ]
  })
  .sort({ soldCount: -1 }) 
  // ⚡ FIX: .select() mein wahi fields rakhe hain jo DB mein actual mein exist karte hain
  .select('name images price discountPrice category brand variants') 
  .limit(6)
  .lean(); // 🔥 Optimization: Lean query fast hoti hai

  res.status(200).json({ success: true, suggestions });
});

// -------------------------------------------------------------------
// 2. FULL SEARCH API (Deep Search)
// -------------------------------------------------------------------
exports.fullSearch = wrapAsync(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(200).json({ success: true, products: [], totalCount: 0 });
    }

    // 🧠 MAGIC: $regex aur 'i' (case-insensitive) ka use karke partial words pakdenge
    const searchRegex = new RegExp(q, 'i'); 

    const filter = {
        isActive: true,
        $or: [
            { name: searchRegex },
            { brand: searchRegex },
            { category: searchRegex },
            { description: searchRegex }, // Short description
            
            // ⚡ NAYE PREMIUM FIELDS MEIN DEEP SEARCH ⚡
            { 'techSpecs.description': searchRegex },
            { 'techSpecs.category': searchRegex },
            { 'lifestyleFeatures.title': searchRegex },
            { 'lifestyleFeatures.description': searchRegex },
            { 'highlights.title': searchRegex },
            { 'inTheBox': searchRegex } // Agar koi accessories search kare (e.g., "Charging Base")
        ]
    };

    const products = await Product.find(filter)
        // ⚡ Search page par dikhane ke liye zaroori fields (highlights bhi add kiya taaki badges dikha sakein)
        .select('name price discountPrice images variants category brand stock highlights')
        .limit(20) // Max 20 results for performance
        .lean(); // 🔥 Lean for performance

    res.status(200).json({
        success: true,
        totalCount: products.length,
        products
    });
});