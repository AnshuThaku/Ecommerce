import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ShopSidebar from './ShopSidebar';
import ShopProductCard from './ShopProductCard';
import QuickViewModal from '../Product/QuickModel';
import Footer from '../Home/Footer'; 
import Header1 from '../Home/Header1'; 
import Toast from '../../components/Toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function ShopHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (type, message) => setToastMessage({ type, message });
  const location = useLocation();
  const navigate = useNavigate();
  
  // ── UI STATES ──
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); 

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(100000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/products');
        if (data.success) {
          setProducts(data.products);
          const validPrices = data.products.map(p => p.price).filter(p => typeof p === 'number');
          const maxP = validPrices.length > 0 ? Math.max(...validPrices) : 100000;
          setMaxPriceLimit(maxP);
          setPriceRange(maxP);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const allCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category))].filter(Boolean);
  }, [products]);

  const allBrands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))].filter(Boolean);
  }, [products]);

  useEffect(() => {
    if (location.state) {
      if (location.state.category && location.state.search) {
        setSelectedCategories([location.state.category]);
        setSearchTerm(location.state.search);
        setSelectedBrands([]); 
        setSelectedColors([]);
        setPriceRange(maxPriceLimit);
        setSelectedRating(null);
        setSelectedDiscount(null);
      } else if (location.state.category) {
        setSelectedCategories([location.state.category]);
        setSearchTerm(''); 
        setSelectedBrands([]);
        setSelectedColors([]);
        setPriceRange(maxPriceLimit);
        setSelectedRating(null);
        setSelectedDiscount(null);
      } else if (location.state.search) {
        setSearchTerm(location.state.search);
        setSelectedCategories([]); 
        setSelectedBrands([]);
        setSelectedColors([]);
        setPriceRange(maxPriceLimit);
        setSelectedRating(null);
        setSelectedDiscount(null);
      }
      
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate, maxPriceLimit]);

  // ── ACTIONS ──
  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setSearchTerm(''); 
    setActiveMegaMenu(null);
    setIsSearchExpanded(false);
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchTerm('');
    setPriceRange(maxPriceLimit);
    setSelectedColors([]);
    setSelectedRating(null);
    setSelectedDiscount(null);
  };

  // ── FILTERING ──
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => p.category && p.category.toLowerCase() === c.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.some(b => p.brand && p.brand.toLowerCase() === b.toLowerCase());
      const query = searchTerm ? searchTerm.toLowerCase().trim() : '';
      const matchesSearch = !query || 
        (p.name && p.name.toLowerCase().includes(query)) || 
        (p.brand && p.brand.toLowerCase().includes(query));   
      
      const actualPrice = p.price || 0;
      const actualDiscount = p.discountPrice || 0;
      const currentPrice = p.flashDeal?.isActive && p.flashDeal?.dealPrice ? p.flashDeal.dealPrice : (actualPrice - actualDiscount);
      
      const matchesColor = selectedColors.length === 0 || 
        (p.variants && p.variants.some(v => v.color && selectedColors.some(c => c.toLowerCase() === v.color.toLowerCase()))) || 
        (p.color && selectedColors.some(c => c.toLowerCase() === p.color.toLowerCase()));
        
      const matchesRating = !selectedRating || ((p.avgRating || 0) >= selectedRating); 
      
      const discountPercentage = actualPrice > 0 ? Math.round(((actualPrice - currentPrice) / actualPrice) * 100) : 0;
      const matchesDiscount = !selectedDiscount || (discountPercentage >= selectedDiscount);

      return matchesCategory && matchesBrand && matchesSearch && currentPrice <= priceRange && matchesColor && matchesRating && matchesDiscount;
    }).sort((a, b) => {
      const priceA = a.flashDeal?.isActive && a.flashDeal?.dealPrice ? a.flashDeal.dealPrice : ((a.price || 0) - (a.discountPrice || 0));
      const priceB = b.flashDeal?.isActive && b.flashDeal?.dealPrice ? b.flashDeal.dealPrice : ((b.price || 0) - (b.discountPrice || 0));
      if (sortOrder === 'price-asc') return priceA - priceB;    
      if (sortOrder === 'price-desc') return priceB - priceA;   
      return 0;
    });
  }, [products, selectedCategories, selectedBrands, searchTerm, priceRange, sortOrder, selectedColors, selectedRating, selectedDiscount]);
  const displayProducts = products; // TEMPORARILY ALWAYS SHOW ALL PRODUCTS AS REQUESTED
  // ⚡ FIX: Ye line missing thi aapke code mein! Iske bina page crash ho raha tha.
  const isSidebarVisible = selectedCategories.length > 0 || selectedBrands.length > 0 || searchTerm.trim() !== '';

  const activeBreadcrumbText = searchTerm ? 'SEARCH' : (selectedCategories.length > 0 ? selectedCategories.join(', ').toUpperCase() : (selectedBrands.length > 0 ? selectedBrands.join(', ').toUpperCase() : 'SPEAKERS'));
  const activeSelectionText = searchTerm ? `RESULTS FOR "${searchTerm.toUpperCase()}"` : (selectedCategories.length > 0 ? selectedCategories.join(', ').toUpperCase() : (selectedBrands.length > 0 ? selectedBrands.join(', ').toUpperCase() : 'SPEAKERS'));

  return (
    <div className="min-h-screen bg-white font-sans text-center">
      <Header1 />
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-10 flex flex-col items-center">

        {/* Title Section matching the screenshot */}
        <div className="w-full text-center mb-6 mt-0">
          <h1 className="text-[32px] md:text-[42px] font-serif font-bold uppercase tracking-widest text-[#111] mb-2">
               {activeSelectionText}
          </h1>
          <div className="text-[10px] font-semibold tracking-widest uppercase text-[#555] flex items-center justify-center gap-2">
              <Link to="/" className="hover:text-[#111] transition-colors">HOME</Link>
              <span>&gt;</span>
              <span className="text-[#111] uppercase">{activeBreadcrumbText}</span>
          </div>
        </div>

        {/* Layout Box: Sidebar + Grid */}
        <div className="w-full flex flex-col md:flex-row items-start gap-12 lg:gap-20">
          
          <div className="w-full md:w-[220px] shrink-0 text-left">
            <ShopSidebar
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              brands={allBrands}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPriceLimit={maxPriceLimit}
              selectedColors={selectedColors}
              onColorToggle={(color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              selectedDiscount={selectedDiscount}
              onDiscountChange={setSelectedDiscount}
              onClearFilters={clearFilters}
            />
          </div>

          <div className="flex-1 w-full">
            {loading ? (
                <div className="w-full py-32 flex justify-center"><div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                  {displayProducts.length > 0 ? (
                    displayProducts.map(p => (
                        <ShopProductCard key={p._id} product={p} onQuickView={setSelectedProduct} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-gray-400 text-lg mb-4">No exact matches found.</p>
                      <button onClick={clearFilters} className="text-black font-bold uppercase tracking-widest text-xs border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer">
                        Clear Filters
                      </button>
                    </div>
                  )}
               </div>
            )}
          </div>

        </div>
      </main>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      <Footer />
    </div>
  );
}
