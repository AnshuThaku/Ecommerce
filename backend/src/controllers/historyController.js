const History = require('../../models/History/HistoryModel');
const wrapAsync = require('../../utils/errorHandler/wrapAsync');

// =========================================================
// 1. TRACK HISTORY (Saves both Views and Searches)
// =========================================================
exports.trackHistory = wrapAsync(async (req, res) => {
    const { type, productId, searchQuery } = req.body;
    
    // AuthMiddleware se user ID lega, nahi toh Header/Body se Guest ID
    const userId = req.user ? req.user._id : null;
    const guestId = req.body.guestId || req.headers['x-guest-id'];

    // Identity check: Dono me se ek hona compulsory hai
    if (!userId && !guestId) {
        return res.status(200).json({ 
            success: false, 
            message: "No user or guest identity found to track." 
        });
    }

    try {
        // --- CASE A: PRODUCT VIEW ---
        if (type === 'view' && productId) {
            // Check if productId is a valid MongoDB ObjectId to prevent 500 crash
            if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ success: false, message: "Invalid Product ID" });
            }

            const filter = userId ? { user: userId, product: productId } : { guestId: guestId, product: productId };
            
            await History.findOneAndUpdate(
                filter,
                { viewedAt: Date.now() },
                { 
                    upsert: true, 
                  returnDocument: 'after',
                    setDefaultsOnInsert: true 
                }
            );
        } 
        
        // --- CASE B: SEARCH QUERY ---
        else if (type === 'search' && searchQuery) {
            const queryToSave = searchQuery.trim().toLowerCase();
            const filter = userId ? { user: userId, searchQuery: queryToSave } : { guestId: guestId, searchQuery: queryToSave };
            
            await History.findOneAndUpdate(
                filter,
                { searchedAt: Date.now() },
                { 
                    upsert: true, 
                  returnDocument: 'after', 
                    setDefaultsOnInsert: true 
                }
            );
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        // Terminal me error dikhayega taaki aap debug kar sakein
        console.error("🚨 History Track Error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
});


// =========================================================
// 2. GET HISTORY (Fetches either Searches or Views)
// =========================================================
exports.getHistory = wrapAsync(async (req, res) => {
    const { guestId, type } = req.query; 
    const userId = req.user ? req.user._id : null;

    // Agar koi identity nahi hai, toh seedha empty array dedo
    if (!userId && !guestId) {
        return res.status(200).json({ success: true, history: [] });
    }

    // Dynamic Filter
    let filter = userId ? { user: userId } : { guestId: guestId };

    // --- CASE A: RECENT SEARCHES ---
    if (type === 'search') {
        filter.searchQuery = { $exists: true }; // Sirf wo records jisme text search ho

        const searches = await History.find(filter)
            .sort({ searchedAt: -1 }) // Latest search pehle
            .limit(10)
            .select('searchQuery searchedAt');

        return res.status(200).json({ success: true, history: searches });
    } 

    // --- CASE B: RECENTLY VIEWED PRODUCTS ---
    else {
        filter.product = { $exists: true }; // Sirf wo records jisme product ID ho

        const historyRecords = await History.find(filter)
            .sort({ viewedAt: -1 }) // Latest view pehle
            .limit(15)
            .populate({
                path: 'product',
                // Zaroori fields fetch karna taaki frontend par image/price dikhe
                select: 'name price discountPrice slug images variants category stock brand'
            });

        // Agar database se koi product delete ho gaya ho, toh us record ko remove kar do
        const validHistory = historyRecords.filter(record => record.product !== null);

        return res.status(200).json({ success: true, history: validHistory });
    }
});