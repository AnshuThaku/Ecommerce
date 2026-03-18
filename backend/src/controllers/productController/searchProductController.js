const Product = require('../../models/Product/productModel'); 
const wrapAsync = require('../../utils/errorHandler/wrapAsync');

// 1. SMART SUGGESTIONS API (Universal)
exports.getSearchSuggestions = wrapAsync(async (req, res) => {
  const searchQuery = req.query.q ? req.query.q.trim() : "";
  if (!searchQuery) return res.status(200).json({ success: true, suggestions: [] });

  const regex = { $regex: searchQuery, $options: 'i' };

  const suggestions = await Product.find({
    $or: [
      { name: regex },
      { category: regex },
      { brand: regex },
      { 'variants.color': regex }
    ]
  })
  .sort({ soldCount: -1 }) 
  .select('name images image price discountPrice slug category brand variants') 
  .limit(6); 

  res.status(200).json({ success: true, suggestions });
});



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
            { description: searchRegex } // Optional: Description mein bhi dhoondega
        ]
    };

    const products = await Product.find(filter)
        .select('name price discountPrice images variants category brand stock')
        .limit(20); // Max 20 results for performance

    res.status(200).json({
        success: true,
        totalCount: products.length,
        products
    });
});

