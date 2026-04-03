import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ShopSidebar from './ShopSidebar';
import ShopProductCard from './ShopProductCard';
import QuickViewModal from '../Product/QuickModel';
import Footer from '../Home/Footer'; 
import Header1 from '../Home/Header1'; 
import Toast from '../../components/Toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Filter, X } from 'lucide-react';

export default function ShopHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (type, message) => setToastMessage({ type, message });
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // ── UI STATES ──
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); 

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/products`);
        if (data.success) {
          setProducts(data.products);

          const validPrices = data.products.map(p => p.price).filter(p => typeof p === 'number');
          const maxP = validPrices.length > 0 ? Math.max(...validPrices) : 100000;
          setMaxPriceLimit(maxP);
          setPriceRange({ min: 0, max: maxP });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);
  const allCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category))].filter(Boolean);
  }, [products]);

  const allBrands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))].filter(Boolean);
  }, [products]);

  useEffect(() => {
    if (location.state && !location.state.processed) {
      if (location.state.category && location.state.search) {
        setSelectedCategories([location.state.category]);
        setSearchTerm(location.state.search);
        setSelectedBrands([]); 
        setSelectedColors([]);
        setPriceRange({ min: 0, max: maxPriceLimit });
        setSelectedRating(null);
        setSelectedDiscount(null);
      } else if (location.state.category) {
        setSelectedCategories([location.state.category]);
        setSearchTerm(''); 
        setSelectedBrands([]);
        setSelectedColors([]);
        setPriceRange({ min: 0, max: maxPriceLimit });
        setSelectedRating(null);
        setSelectedDiscount(null);
      } else if (location.state.search) {
        setSearchTerm(location.state.search);
        setSelectedCategories([]); 
        setSelectedBrands([]);
        setSelectedColors([]);
        setPriceRange({ min: 0, max: maxPriceLimit });
        setSelectedRating(null);
        setSelectedDiscount(null);
      }
      
      navigate(location.pathname, { replace: true, state: { ...location.state, processed: true } });
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
    setPriceRange({ min: 0, max: maxPriceLimit });
    setSelectedColors([]);
    setSelectedRating(null);
    setSelectedDiscount(null);
  };

  // ── FILTERING ──
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => {
          if (!p.category) return false;
          const pc = p.category.toLowerCase().replace(/s$/, '');
          const sc = c.toLowerCase().replace(/s$/, '');
          return pc === sc || pc.includes(sc) || sc.includes(pc);
        });
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

      return matchesCategory && matchesBrand && matchesSearch && currentPrice >= priceRange.min && currentPrice <= priceRange.max && matchesColor && matchesRating && matchesDiscount;
    }).sort((a, b) => {
      const priceA = a.flashDeal?.isActive && a.flashDeal?.dealPrice ? a.flashDeal.dealPrice : ((a.price || 0) - (a.discountPrice || 0));
      const priceB = b.flashDeal?.isActive && b.flashDeal?.dealPrice ? b.flashDeal.dealPrice : ((b.price || 0) - (b.discountPrice || 0));
      if (sortOrder === 'price-asc') return priceA - priceB;    
      if (sortOrder === 'price-desc') return priceB - priceA;   
      return 0;
    });
  }, [products, selectedCategories, selectedBrands, searchTerm, priceRange, sortOrder, selectedColors, selectedRating, selectedDiscount]);
  const displayProducts = filteredProducts; // Use the correctly filtered products
  // ⚡ FIX: Ye line missing thi aapke code mein! Iske bina page crash ho raha tha.
  const isSidebarVisible = selectedCategories.length > 0 || selectedBrands.length > 0 || searchTerm.trim() !== '';

  const activeBreadcrumbText = searchTerm ? 'SEARCH' : (selectedCategories.length > 0 ? selectedCategories.join(', ').toUpperCase() : (selectedBrands.length > 0 ? selectedBrands.join(', ').toUpperCase() : 'ALL PRODUCTS'));
  const activeSelectionText = searchTerm ? `RESULTS FOR "${searchTerm.toUpperCase()}"` : (selectedCategories.length > 0 ? selectedCategories.join(', ').toUpperCase() : (selectedBrands.length > 0 ? selectedBrands.join(', ').toUpperCase() : 'ALL PRODUCTS'));

  return (
    <div className="min-h-screen bg-white font-sans text-center">
      <Header1 />
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-10 flex flex-col items-center">

        {/* Title Section matching the screenshot */}
        <div className="w-full text-center mb-6 mt-0 ">
          <h1 className="text-[32px] md:text-[42px] font-serif font-bold uppercase tracking-widest text-[#111] mb-2 ml-10">
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
          
          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden w-full flex justify-between items-center mb-2 border-b border-gray-200 pb-4">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 text-[12px] font-[800] tracking-[0.1em] uppercase text-[#111] bg-gray-50 px-5 py-2.5 rounded-sm shadow-sm active:scale-95 transition-transform"
            >
              <Filter className="w-4 h-4 text-black" /> Filters
            </button>
            <span className="text-[12px] tracking-widest text-[#555] font-bold uppercase">{displayProducts.length} Products</span>
          </div>

          {/* Sidebar Drawer on Mobile / Standard Sidebar on Desktop */}
          <div 
            className={`
              md:hidden fixed inset-0 z-[999999] bg-black/50 transition-opacity duration-300
              ${isMobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `} 
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <div 
              className={`
                absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl p-6 overflow-y-auto shrink-0 text-left
                transition-transform duration-300 
                ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}
              `}
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer Header (Mobile only) */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 mt-2">
                <h3 className="text-[20px] font-serif font-bold text-[#111]">Filters</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-full border border-gray-200">
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

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
          </div>

          <div className="hidden md:block w-full md:w-[220px] shrink-0 text-left">
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
