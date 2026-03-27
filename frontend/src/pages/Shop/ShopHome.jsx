import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/Toast';
import SearchBar from '../../components/SearchBar'; 
import { Filter, SlidersHorizontal, Sparkles, ChevronRight, Heart, Eye, ShoppingCart, Zap, Clock, IndianRupee } from 'lucide-react';
import Footer from '../Home/Footer'; 
import Logo from "../../../public/Truee_Luxury_Logo.png";

export default function ShopHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  const [products, setProducts] = useState([]);
  const [recommended, setRecommended] = useState([]); 
  const [flashDeals, setFlashDeals] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); 

  // 💰 Price Range State
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  const [priceRange, setPriceRange] = useState(100000);
  
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (type, message) => setToastMessage({ type, message });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromUrl = queryParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('All');
    }
  }, [location.search]);

  const fetchPublicProducts = async () => {
    try {
      const { data } = await axiosInstance.get('/products');
      const allProds = data.products || [];
      setProducts(allProds);

      // Max price calculate karo slider ke liye
      if(allProds.length > 0) {
        const maxP = Math.max(...allProds.map(p => p.price));
        setMaxPriceLimit(maxP);
        setPriceRange(maxP);
      }
    } catch (error) {
      showToast('error', 'Failed to load catalogue');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendationsAndDeals = async () => {
    try {
      let guestId = localStorage.getItem('guestId');
      if (!guestId && !user) return; 
      const { data } = await axiosInstance.get(`/home?t=${Date.now()}`, {
        headers: { 'x-guest-id': guestId, 'Cache-Control': 'no-cache' }
      });
      if (data.success) {
        if (data.data.recommended) setRecommended(data.data.recommended);
        if (data.data.flashDeals) setFlashDeals(data.data.flashDeals); 
      }
    } catch (error) {
      console.error("Failed to load recommendations", error);
    }
  };

  useEffect(() => {
    fetchPublicProducts();
    fetchRecommendationsAndDeals();
    window.scrollTo(0, 0); 
  }, [user]);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const flashDealIds = flashDeals.map(deal => deal._id.toString());

  // ⚡ Final Processed Products with Category + Price Filter
  const processedProducts = useMemo(() => {
    return products
      .filter(p => selectedCategory === 'All' ? true : p.category === selectedCategory)
      .filter(p => !flashDealIds.includes(p._id.toString())) 
      .filter(p => {
         const currentP = p.flashDeal?.isActive ? p.flashDeal.dealPrice : (p.price - (p.discountPrice || 0));
         return currentP <= priceRange;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice > 0 ? a.price - a.discountPrice : a.price;
        const priceB = b.discountPrice > 0 ? b.price - b.discountPrice : b.price;
        if (sortOrder === 'price-asc') return priceA - priceB;
        if (sortOrder === 'price-desc') return priceB - priceA;
        return 0; 
      });
  }, [products, selectedCategory, sortOrder, priceRange, flashDeals]);

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    if (newCat === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(newCat)}`);
    }
  };

  const createProductUrl = (p) => {
    if (!p) return '#';
    const cat = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'luxury';
    const brand = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'exclusive';
    const name = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product';
    return `/${cat}/${brand}/${name}/p/${p._id}`;
  };

  const getMainImage = (p) => {
    if (p.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
    if (p.images?.[0]?.url) return p.images[0].url;
    return 'https://placehold.co/400x400/f9f9f9/C8A253?text=LUXE'; 
  };

  const ShopProductCard = ({ product }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [isDealActive, setIsDealActive] = useState(false);

    useEffect(() => {
      if (product?.flashDeal?.isActive && product?.flashDeal?.endTime) {
        const updateTimer = () => {
          const dist = new Date(product.flashDeal.endTime).getTime() - Date.now();
          if (dist > 0) {
            setIsDealActive(true);
            setTimeLeft({
              h: Math.floor((dist / (1000 * 60 * 60)) % 24),
              m: Math.floor((dist / 1000 / 60) % 60),
              s: Math.floor((dist / 1000) % 60)
            });
          } else setIsDealActive(false);
        };
        updateTimer();
        const t = setInterval(updateTimer, 1000);
        return () => clearInterval(t);
      }
    }, [product]);

    const displayPrice = isDealActive ? product.flashDeal.dealPrice : product.price - (product.discountPrice || 0);

    return (
      <div 
        onClick={() => navigate(createProductUrl(product))}
        className={`group relative flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl w-full h-full cursor-pointer ${
          isDealActive ? 'border border-red-500/30' : 'border border-gray-100 hover:border-gray-200'
        }`}
      >    
        <div className="relative h-[180px] sm:h-[220px] bg-[#f9f9f9] overflow-hidden flex items-center justify-center p-4">        
          {isDealActive && (
            <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-md">
              <Zap className="w-2.5 h-2.5 fill-current" /> Deal
            </div>
          )}
          {product.discountPrice > 0 && !isDealActive && (
            <div className="absolute top-3 left-3 z-10 bg-[#d3b574] text-white text-[8px] font-black px-2 py-0.5 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-md">
              {Math.round((product.discountPrice / product.price) * 100)}% OFF
            </div>
          )}

          <img src={getMainImage(product)} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />

          <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><Heart className="w-4 h-4" /></button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(createProductUrl(product)); }} className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center hover:bg-[#d3b574]/10 text-gray-500 hover:text-[#d3b574] transition-all"><Eye className="w-4 h-4" /></button>
          </div>

          <button 
            onClick={async (e) => {
              e.preventDefault(); e.stopPropagation();
              try {
                await axiosInstance.post('/cart/add', { productId: product._id, quantity: 1 });
                window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { increase: 1 } }));
                showToast('success', 'Added to cart');
              } catch (err) { showToast('error', 'Login to add items'); }
            }}
            className={`absolute bottom-0 left-0 w-full h-10 flex items-center justify-center space-x-2 text-white lg:translate-y-full group-hover:translate-y-0 transition-all duration-300 z-20 ${isDealActive ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-[#d3b574] hover:text-black'}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isDealActive ? 'Claim Deal' : 'Add To Cart'}</span>
          </button>
        </div>

        <div className="p-4 bg-white text-center flex flex-col flex-1 border-t border-gray-50">
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#d3b574] mb-1">{product.brand || product.category}</p>
          <h4 className="text-[12px] font-medium text-black mb-2 group-hover:text-[#d3b574] transition-colors line-clamp-1 w-full">{product.name}</h4>
          
          <div className="flex flex-col items-center justify-center gap-1 w-full mt-auto">
            <div className="flex items-baseline gap-2">
              <span className={`text-[15px] font-black ${isDealActive ? 'text-red-600' : 'text-black'}`}>₹{displayPrice.toLocaleString('en-IN')}</span>
              {(product.discountPrice > 0 || isDealActive) && <span className="text-[10px] text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>}
            </div>
            {isDealActive && timeLeft && (
              <div className="text-red-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                <Clock className="w-3 h-3" /> Ends in {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const HeaderNav = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
          <img src={Logo} alt="Truee Luxury Logo" className="h-8 md:h-10 object-contain" />
        </Link>
        <div className="flex-1 max-w-xl px-4 md:px-8 hidden md:block">
           <SearchBar />
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/" className="text-[11px] font-black text-gray-500 hover:text-[#d3b574] transition-colors uppercase tracking-widest">Back to Home</Link>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#d3b574] selection:text-black pt-16">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      <HeaderNav />

      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-serif text-black font-medium">
                {selectedCategory === 'All' ? 'Curated Collection' : selectedCategory}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                 <Link to="/" className="hover:text-[#d3b574] transition-colors font-medium">Home</Link> <ChevronRight size={12}/> <span>Shop</span> {selectedCategory !== 'All' && <><ChevronRight size={12}/> <span className="text-black font-medium">{selectedCategory}</span></>}
              </p>
           </div>
           <div className="md:hidden w-full mt-4"><SearchBar /></div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6 md:gap-8">
        
        {/* --- LEFT SIDEBAR (FILTERS) --- */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24 space-y-8">
            
            {/* 1. Category Filter */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><Filter size={13}/> Categories</h3>
              <div className="space-y-2.5">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="category" value={cat} checked={selectedCategory === cat} onChange={handleCategoryChange} className="w-3.5 h-3.5 text-[#d3b574] bg-gray-50 border-gray-200 focus:ring-[#d3b574] cursor-pointer" />
                    <span className={`text-[13px] transition-colors ${selectedCategory === cat ? 'font-bold text-black' : 'text-gray-600 group-hover:text-[#d3b574]'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 💰 2. PRICE RANGE FILTER 💰 */}
            <div>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><IndianRupee size={13}/> Price Range</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-600">
                     <span>₹0</span>
                     <span className="text-[#d3b574] bg-[#d3b574]/10 px-2 py-0.5 rounded">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={maxPriceLimit} 
                    value={priceRange} 
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#d3b574]"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                     <div className="bg-gray-50 border border-gray-100 rounded-md p-2 text-center">
                        <p className="text-[8px] uppercase text-gray-400 font-bold">Min</p>
                        <p className="text-[11px] font-black text-black">₹0</p>
                     </div>
                     <div className="bg-gray-50 border border-gray-100 rounded-md p-2 text-center">
                        <p className="text-[8px] uppercase text-gray-400 font-bold">Max</p>
                        <p className="text-[11px] font-black text-black">₹{priceRange.toLocaleString('en-IN')}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* 3. Sort Filter */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2"><SlidersHorizontal size={13}/> Sort By</h3>
              <div className="space-y-2.5">
                {[
                  { value: 'newest', label: 'Latest Arrivals' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' }
                ].map(sort => (
                  <label key={sort.value} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="sort" value={sort.value} checked={sortOrder === sort.value} onChange={(e) => setSortOrder(e.target.value)} className="w-3.5 h-3.5 text-[#d3b574] bg-gray-50 border-gray-200 focus:ring-[#d3b574] cursor-pointer" />
                    <span className={`text-[13px] transition-colors ${sortOrder === sort.value ? 'font-bold text-black' : 'text-gray-600 group-hover:text-[#d3b574]'}`}>{sort.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* --- RIGHT MAIN CONTENT AREA --- */}
        <div className="flex-1 flex flex-col gap-8">
          {flashDeals.length > 0 && (
            <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100/60 shadow-inner overflow-hidden relative">
              <div className="absolute top-0 left-0 w-0.5 bg-red-500 h-full"></div>
              <h2 className="text-xl md:text-2xl font-serif text-red-600 mb-6 flex items-center gap-2 font-medium">
                 <Zap className="text-red-500 fill-red-500 w-5 h-5" /> Limited Time Flash Deals
              </h2>
              <div className="flex gap-4 md:gap-5 overflow-x-auto pb-2 hide-scrollbar snap-x">
                {flashDeals.map((product, index) => (
                  <div key={`flash-${product._id}-${index}`} className="snap-start flex-shrink-0 w-[220px]"><ShopProductCard product={product} /></div>
                ))}
              </div>
            </div>
          )}
          
          {recommended.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-0.5 bg-[#d3b574] h-full"></div>
              <h2 className="text-xl md:text-2xl font-serif text-black mb-6 flex items-center gap-2 font-medium">
                 <Sparkles className="text-[#d3b574] w-5 h-5" /> Recommended For You
              </h2>
              <div className="flex gap-4 md:gap-5 overflow-x-auto pb-2 hide-scrollbar snap-x">
                {recommended.map((product, index) => (
                  <div key={`rec-${product._id}-${index}`} className="snap-start flex-shrink-0 w-[220px]"><ShopProductCard product={product} /></div>
                ))}
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="flex items-center justify-between mb-5 px-1">
               <span className="text-[12px] font-bold text-gray-500">Showing {processedProducts.length} Treasures</span>
            </div>

            {loading ? (
              <div className="w-full flex justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"><div className="w-9 h-9 border-2 border-gray-200 border-t-[#d3b574] rounded-full animate-spin"></div></div>
            ) : processedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                 <h3 className="text-lg font-serif italic text-black mb-1.5">No treasures found</h3>
                 <p className="text-gray-500 text-xs mb-6">Try adjusting your category or budget limit.</p>
                 <button onClick={() => {setSelectedCategory('All'); setPriceRange(maxPriceLimit); navigate('/shop');}} className="bg-[#d3b574] text-white font-bold uppercase tracking-widest text-[9px] px-7 py-2.5 rounded-full hover:bg-black transition-colors shadow-md">Reset All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {processedProducts.map((product) => (<ShopProductCard key={product._id} product={product} />))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer accentColor="#d3b574" bg="#111" textColor="white" />
      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } html { scroll-behavior: smooth; }`}} />
    </div>
  );
}