import React, { useState, useEffect, useMemo, useRef } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import SearchBar from '../../components/SearchBar'; 
import ShopSidebar from './ShopSidebar';
import ShopProductCard from './ShopProductCard';
import QuickViewModal from '../Product/QuickModel';
import Footer from '../Home/Footer'; 
import Toast from '../../components/Toast';
import { Search, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShopHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (type, message) => setToastMessage({ type, message });
  
  // ── UI STATES ──
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); 

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(100000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  const [sortOrder, setSortOrder] = useState('newest');

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

  // ── ACTIONS ──
  const handleCategoryToggle = (cat) => {
    setSelectedCategories([cat]); 
    setSearchTerm(''); 
    setActiveMegaMenu(null);
    setIsSearchExpanded(false);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

<<<<<<< HEAD
  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
    setPriceRange(maxPriceLimit);
  };

  // ── FILTERING ──
=======

>>>>>>> 96934e5cc486a4ef38d8239262397636c2b3a143
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const currentPrice = p.flashDeal?.isActive ? p.flashDeal.dealPrice : (p.price - (p.discountPrice || 0));
      return matchesCategory && matchesSearch && currentPrice <= priceRange;
    }).sort((a, b) => {
      if (sortOrder === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortOrder === 'price-desc') return (b.price || 0) - (a.price || 0);
      return 0; 
    });
<<<<<<< HEAD
  }, [products, selectedCategories, searchTerm, priceRange, sortOrder]);

  const isSidebarVisible = selectedCategories.length > 0 || searchTerm.trim() !== '';
=======
  }, [products, selectedCategories, selectedColors, selectedRating, selectedDiscount, priceRange, searchTerm, sortOrder]);
  const HeaderNav = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
         <img src="/Truee_Luxury_Logo.png" alt="Logo"  className="h-8 md:h-10 object-contain" />
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

>>>>>>> 96934e5cc486a4ef38d8239262397636c2b3a143

  return (
    <div className="min-h-screen bg-[var(--theme-bg-light)] pt-[60px]">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* ── NAVBAR ── */}
      <nav 
        className="fixed top-0 left-0 right-0 z-[100] bg-[var(--theme-bg-dark)] border-b border-white/5 h-[60px] flex items-center shadow-2xl transition-all duration-300"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-[1440px] w-full mx-auto px-8 flex items-center justify-between relative h-full">
          
          <div className={`flex items-center flex-1 transition-all duration-700 ${isSearchExpanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <Link to="/" className="flex-shrink-0 cursor-pointer mr-10">
              <img src="/Truee_Luxury_Logo.png" alt="Logo" className="h-6 w-auto" />
            </Link>

            <div className="hidden md:flex items-center h-full">
              {allCategories.slice(0, 6).map(cat => (
                <button 
                  key={cat}
                  onMouseEnter={() => setActiveMegaMenu(cat)}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 cursor-pointer h-[60px] px-5 ${
                    selectedCategories.includes(cat) || activeMegaMenu === cat ? 'text-[var(--theme-primary)]' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={`flex items-center gap-6 transition-all duration-700 ${isSearchExpanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <button onClick={() => setIsSearchExpanded(true)} className="text-white/50 hover:text-[var(--theme-primary)] cursor-pointer p-2">
              <Search size={18} strokeWidth={2.5} />
            </button>
            <Link to="/cart" className="relative p-2 text-white/50 hover:text-[var(--theme-primary)] cursor-pointer">
              <ShoppingBag size={18} strokeWidth={2.2} />
            </Link>
          </div>

          {/* ⚡ APPLE SEARCH OVERLAY ⚡ */}
          <div 
            className={`absolute inset-0 z-[110] bg-[var(--theme-bg-dark)] flex items-center justify-center px-10 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isSearchExpanded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="w-full max-w-[800px] flex items-center gap-6">
              <div className="flex-1">
                {/* ⚡ FIX: Enter dabane pe ab bar hide nahi hoga */}
                <SearchBar 
                   onSearch={(val) => {
                     setSearchTerm(val); 
                     setSelectedCategories([]); // Naya search karne par purani category hate
                     if(!val) setIsSearchExpanded(false); // Agar empty enter kiya toh band ho jayega
                   }} 
                   placeholder="Search products..." 
                />
              </div>
              {/* ⚡ FIX: Ye X dabane par search empty hoga aur overlay band hoga */}
              <button 
                onClick={() => { 
                  setIsSearchExpanded(false); 
                  setSearchTerm(''); 
                }} 
                className="text-white/30 hover:text-white cursor-pointer p-2 transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MEGA MENU (Rich Options) ── */}
      <div 
        onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)} 
        onMouseLeave={() => setActiveMegaMenu(null)} 
        className={`fixed top-[60px] left-0 right-0 z-[90] bg-[#fdfdfd] border-b border-gray-200 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-xl ${activeMegaMenu && !isSearchExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="max-w-[1200px] mx-auto px-10 py-16 grid grid-cols-4 gap-12">
          {/* Col 1 */}
          <div className="space-y-5">
            <h5 className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Explore {activeMegaMenu}</h5>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleCategoryToggle(activeMegaMenu)} className="text-left text-xl font-bold text-gray-900 hover:text-[var(--theme-primary)] cursor-pointer">Explore All</button>
              <button className="text-left text-lg font-semibold text-gray-600 hover:text-[var(--theme-primary)] cursor-pointer">{activeMegaMenu} Pro</button>
              <button className="text-left text-lg font-semibold text-gray-600 hover:text-[var(--theme-primary)] cursor-pointer">{activeMegaMenu} Ultra</button>
              <button className="text-left text-lg font-semibold text-gray-600 hover:text-[var(--theme-primary)] cursor-pointer">{activeMegaMenu} Essential</button>
            </div>
          </div>
          {/* Col 2 */}
          <div className="space-y-5">
            <h5 className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Shop</h5>
            <div className="flex flex-col gap-3">
              <button className="text-left text-sm font-bold text-gray-700 hover:text-[var(--theme-primary)] cursor-pointer">Shop {activeMegaMenu}</button>
              <button className="text-left text-sm font-bold text-gray-700 hover:text-[var(--theme-primary)] cursor-pointer">Accessories</button>
              <button className="text-left text-sm font-bold text-gray-700 hover:text-[var(--theme-primary)] cursor-pointer">Trade-In</button>
            </div>
          </div>
          {/* Col 3 */}
          <div className="space-y-5">
            <h5 className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Support</h5>
            <div className="flex flex-col gap-3">
              <button className="text-left text-sm font-bold text-gray-700 hover:text-[var(--theme-primary)] cursor-pointer">{activeMegaMenu} Support</button>
              <button className="text-left text-sm font-bold text-gray-700 hover:text-[var(--theme-primary)] cursor-pointer">Luxury Care+</button>
            </div>
          </div>
          {/* Col 4 */}
          <div className="bg-gray-50 p-8 rounded-[1.5rem] flex flex-col justify-center border border-gray-100 text-center">
             <p className="text-[9px] font-black text-[var(--theme-primary)] uppercase mb-2">New Arrival</p>
             <p className="text-sm font-bold text-gray-800 leading-snug">The all-new {activeMegaMenu} collection is here.</p>
          </div>
        </div>
      </div>

      {/* ── HERO TEXT (Hidden if Sidebar is active) ── */}
      {!isSidebarVisible && (
        <div className="pt-16 pb-6 px-4 text-center animate-fade-in relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-[var(--theme-bg-dark)] tracking-tighter mb-2">
            Luxury <span className="text-[var(--theme-primary)]">Catalogue.</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium italic">Refining excellence in every detail.</p>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-[1800px] mx-auto px-8 md:px-20 py-8 flex flex-col md:flex-row gap-12 items-start relative z-10">
        
        {/* Sidebar */}
        {isSidebarVisible && (
          <div className="w-full md:w-72 shrink-0 animate-slide-in">
            <ShopSidebar 
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPriceLimit={maxPriceLimit}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {isSidebarVisible && (
            <div className="flex justify-between items-center mb-6 px-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {searchTerm ? `Results for "${searchTerm}"` : `${selectedCategories[0]} Collection`}
              </p>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)} 
                className="bg-transparent text-[11px] font-bold uppercase tracking-widest border-b border-[var(--theme-primary)] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low-High</option>
                <option value="price-desc">Price: High-Low</option>
              </select>
            </div>
          )}

          {loading ? (
            <div className="w-full py-32 flex justify-center"><div className="w-8 h-8 border-4 border-gray-100 border-t-[var(--theme-primary)] rounded-full animate-spin"></div></div>
          ) : (
            <div className={`grid gap-8 ${isSidebarVisible ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <ShopProductCard key={p._id} product={p} onQuickView={setSelectedProduct} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-400 text-lg mb-4">No exclusive items found.</p>
                  <button onClick={clearFilters} className="text-[var(--theme-primary)] font-bold uppercase tracking-widest text-xs border border-[var(--theme-primary)] px-6 py-2 rounded-full hover:bg-[var(--theme-primary)] hover:text-[var(--theme-bg-dark)] transition-colors cursor-pointer">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}