import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import SearchBar from '../../components/SearchBar'; 
import ShopSidebar from './ShopSidebar';
import ShopProductCard from './ShopProductCard';
import QuickViewModal from '../Product/QuickModel';
import Footer from '../Home/Footer'; 
import Toast from '../../components/Toast';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShopHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (type, message) => setToastMessage({ type, message });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
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
      } catch (e) { 
        console.error(e);
        showToast('error', 'Failed to load catalogue');
      } finally { 
        setLoading(false); 
      }
    };
    fetchAll();
  }, []);

  const handleCategoryToggle = (cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const handleColorToggle = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleRatingChange = (val) => setSelectedRating(prev => prev === val ? null : val);
  const handleDiscountChange = (val) => setSelectedDiscount(prev => prev === val ? null : val);

  const clearFilters = () => {
    setSelectedCategories([]); setSelectedColors([]); setSelectedRating(null); setSelectedDiscount(null);
    setSearchTerm(''); setPriceRange(maxPriceLimit);
  };

<<<<<<< HEAD
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p) return false;
      const discountPercent = p.discountPrice ? Math.round((p.discountPrice / p.price) * 100) : 0;
      const currentPrice = p.flashDeal?.isActive ? p.flashDeal.dealPrice : (p.price - (p.discountPrice || 0));

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesColor = selectedColors.length === 0 || (p.variants && p.variants.some(v => selectedColors.includes(v.color)));
      const matchesRating = !selectedRating || (p.ratings?.average || 0) >= selectedRating;
      const matchesDiscount = !selectedDiscount || discountPercent >= selectedDiscount;
      const matchesPrice = currentPrice <= priceRange;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesColor && matchesRating && matchesDiscount && matchesPrice && matchesSearch;
    }).sort((a, b) => {
      if (sortOrder === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortOrder === 'price-desc') return (b.price || 0) - (a.price || 0);
      return 0;
    });
  }, [products, selectedCategories, selectedColors, selectedRating, selectedDiscount, priceRange, searchTerm, sortOrder]);
=======
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
>>>>>>> d5a3c1a257fbde41902391e48c7ad8a4e6ff459b

  return (
    <div className="min-h-screen bg-[var(--theme-bg-light)] pt-[70px]">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--theme-bg-dark)] border-b border-white/5 h-[70px] flex items-center px-4 sm:px-8">
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between gap-10">
          <Link to="/"><img src="/Truee_Luxury_Logo.png" alt="Logo" className="h-10" /></Link>
          <div className="flex-1 max-w-xl hidden md:block"><SearchBar onSearch={setSearchTerm} /></div>
          <Link to="/" className="text-[10px] font-black text-white/50 hover:text-[var(--theme-primary)] uppercase tracking-widest transition-colors">Back to Home</Link>
        </div>
      </nav>

      <div className="bg-[var(--theme-bg-dark)] py-12 px-8 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto text-white">
          <h1 className="text-4xl font-serif mb-2">Luxury <span className="text-[var(--theme-primary)] italic">Catalogue</span></h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-40">
            <Link to="/">Home</Link> <ChevronRight size={10} /> <span>Shop</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row gap-10 items-start">
        <ShopSidebar 
          categories={[...new Set(products.map(p => p.category))].filter(Boolean)}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          selectedColors={selectedColors}
          onColorToggle={handleColorToggle}
          selectedRating={selectedRating}
          onRatingChange={handleRatingChange} 
          selectedDiscount={selectedDiscount}
          onDiscountChange={handleDiscountChange} 
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPriceLimit={maxPriceLimit}
          onClearFilters={clearFilters}
        />

        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-8 px-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Found {filteredProducts.length} Results</p>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-transparent text-[11px] font-bold uppercase tracking-widest border-b border-[var(--theme-primary)] focus:outline-none cursor-pointer">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low-High</option>
              <option value="price-desc">Price: High-Low</option>
            </select>
          </div>

          {loading ? (
            <div className="w-full py-24 flex justify-center"><div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--theme-primary)] rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(p => <ShopProductCard key={p._id} product={p} onQuickView={setSelectedProduct} showToast={showToast} />)}
            </div>
          )}
        </div>
      </main>

      <Footer />
      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}