const History = require('../models/History/HistoryModel');
const Product = require('../models/product/productModel');

// ============================================================================
// 🧠 1. RECENTLY VIEWED (Aapka pehle wala same rahega)
// ============================================================================
exports.getRecentlyViewed = async ({ userId, guestId }) => {
    if (!userId && !guestId) return [];

    const filter = userId ? { user: userId } : { guestId: guestId };
    const historyRecords = await History.find({ ...filter, product: { $exists: true } })
        .sort({ viewedAt: -1 }).limit(30).lean();

    if (!historyRecords || historyRecords.length === 0) return [];

    const uniqueProductIds = [];
    const seenIds = new Set();
    
    for (const record of historyRecords) {
        if (!record.product) continue;
        const prodIdStr = record.product._id ? record.product._id.toString() : record.product.toString();
        if (!seenIds.has(prodIdStr)) {
            seenIds.add(prodIdStr);
            uniqueProductIds.push(prodIdStr);
        }
        if (uniqueProductIds.length === 10) break;
    }

    if (uniqueProductIds.length === 0) return [];

    const products = await Product.find({ _id: { $in: uniqueProductIds }, isActive: true })
        .select('name price discountPrice images variants category brand stock ratings flashDeal soldCount')
        .lean();

    let orderedProducts = [];
    uniqueProductIds.forEach(idStr => {
        const prod = products.find(p => p._id.toString() === idStr);
        if (prod) orderedProducts.push(prod);
    });

    orderedProducts = Array.from(new Map(orderedProducts.map(item => [item._id.toString(), item])).values());
    return orderedProducts;
};


// ============================================================================
// 🎯 2. THE RECOMMENDATION ENGINE (Strict Category, Brand & Price Range)
// ============================================================================
exports.getPersonalizedProducts = async ({ userId, guestId }) => {
    if (!userId && !guestId) return [];
    const filter = userId ? { user: userId } : { guestId: guestId };

    try {
        // STEP 1: Sirf LATEST (Sabse aakhiri) dekha gaya product uthao (The Anchor)
        const latestView = await History.findOne({ ...filter, product: { $exists: true } })
            .sort({ viewedAt: -1 })
            .populate('product', 'category brand price discountPrice flashDeal name')
            .lean();

        // Agar koi history nahi hai -> Hide Section
        if (!latestView || !latestView.product) return [];

        const anchorProduct = latestView.product;
        const targetCategory = anchorProduct.category;
        const targetBrand = anchorProduct.brand;

        // STEP 2: Anchor Product ka EXACT Final Price calculate karo
        let anchorPrice = anchorProduct.price;
        if (anchorProduct.flashDeal && (anchorProduct.flashDeal.isActive === true || anchorProduct.flashDeal.isActive === 'true')) {
            anchorPrice = anchorProduct.flashDeal.dealPrice;
        } else if (anchorProduct.discountPrice > 0) {
            anchorPrice = anchorProduct.price - anchorProduct.discountPrice;
        }

        // STEP 3: Budget Range Banao (40% sasta se lekar 40% mehenga tak)
        const minBudget = anchorPrice * 0.6; // -40%
        const maxBudget = anchorPrice * 1.4; // +40%


        // STEP 4: Database se SAME CATEGORY ke saare products fetch kar lo
        const sameCategoryProducts = await Product.find({
            isActive: true,
            category: targetCategory,
            _id: { $ne: anchorProduct._id } // Jo abhi dekh rahe ho use dubara mat dikhao
        })
        .select('name price discountPrice images variants category brand stock ratings flashDeal soldCount')
        .lean();

        // STEP 5: JavaScript se EXACT Price match karo
        let matchedProducts = sameCategoryProducts.filter(p => {
            // Har product ka active price nikalo
            let pPrice = p.price;
            if (p.flashDeal && (p.flashDeal.isActive === true || p.flashDeal.isActive === 'true')) {
                pPrice = p.flashDeal.dealPrice;
            } else if (p.discountPrice > 0) {
                pPrice = p.price - p.discountPrice;
            }

            // Check karo kya ye budget me hai?
            return pPrice >= minBudget && pPrice <= maxBudget;
        });


        // 🚨 FALLBACK: Agar us exact budget me kuch nahi mila, toh category ke baaki items de do
        if (matchedProducts.length === 0) {
            matchedProducts = sameCategoryProducts;
        }

        // STEP 6: Sorting Priority (Category -> Brand Match -> Name Match)
        matchedProducts.sort((a, b) => {
            // 1st Priority: Same Brand ko upar rakho
            if (a.brand === targetBrand && b.brand !== targetBrand) return -1;
            if (a.brand !== targetBrand && b.brand === targetBrand) return 1;
            
            // 2nd Priority: Name matching (thoda milta julta naam ho)
            const aNameMatch = a.name.toLowerCase().includes(anchorProduct.name.split(' ')[0].toLowerCase());
            const bNameMatch = b.name.toLowerCase().includes(anchorProduct.name.split(' ')[0].toLowerCase());
            
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;

            return 0; // Baaki sab same level par
        });

        // Top 8 best matching results return karo
        return matchedProducts.slice(0, 8);

    } catch (error) {
        console.error("🚨 Recommendation Engine Error:", error);
        return []; 
    }
};