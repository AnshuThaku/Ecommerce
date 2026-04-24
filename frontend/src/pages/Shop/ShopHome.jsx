import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ShopTopbar from './ShopSidebar'; 
import ShopProductCard from './ShopProductCard';
import QuickViewModal from '../Product/ProductDetailModel';
import Footer from '../Home/Footer'; 
import Header1 from '../Home/Header1'; 
import Toast from '../../components/Toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function ShopHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  
  const [sortOrder, setSortOrder] = useState('best-selling');
  const [inStockOnly, setInStockOnly] = useState(false);

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
  
  const allCategories = useMemo(() => [...new Set(products.map(p => p.category))].filter(Boolean), [products]);
  const allBrands = useMemo(() => [...new Set(products.map(p => p.brand))].filter(Boolean), [products]);

  useEffect(() => {
    if (location.state && !location.state.processed) {
      if (location.state.categories) {
        setSelectedCategories(location.state.categories);
        setSearchTerm('');
      } else if (location.state.category) {
        setSelectedCategories([location.state.category]);
        setSearchTerm('');
      }

      if (location.state.search) {
        setSearchTerm(location.state.search);
        if (!location.state.categories) {
          setSelectedCategories([]); 
        }
      }

      navigate(location.pathname, { replace: true, state: { ...location.state, processed: true } });
    }
  }, [location.state, navigate]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchTerm('');
    setPriceRange({ min: 0, max: maxPriceLimit });
    setInStockOnly(false);
    setSortOrder('best-selling');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      
      const query = searchTerm.toLowerCase();
      
      // ⚡ FIX 1: Added p.category check here so Smart Keywords (like "Speaker") work perfectly!
      const matchesSearch = !query || 
        p.name?.toLowerCase().includes(query) || 
        p.brand?.toLowerCase().includes(query) || 
        p.category?.toLowerCase().includes(query);
      
      const currentPrice = p.flashDeal?.isActive ? p.flashDeal.dealPrice : (p.price - (p.discountPrice || 0));
      const matchesStock = inStockOnly ? p.stock > 0 : true;

      return matchesCategory && matchesBrand && matchesSearch && currentPrice >= priceRange.min && currentPrice <= priceRange.max && matchesStock;
    }).sort((a, b) => {
      const priceA = a.flashDeal?.isActive ? a.flashDeal.dealPrice : (a.price - (a.discountPrice || 0));
      const priceB = b.flashDeal?.isActive ? b.flashDeal.dealPrice : (b.price - (b.discountPrice || 0));
      if (sortOrder === 'price-asc') return priceA - priceB;
      if (sortOrder === 'price-desc') return priceB - priceA;
      return 0;
    });
  }, [products, selectedCategories, selectedBrands, searchTerm, priceRange, sortOrder, inStockOnly]);

  let activeBreadcrumbText = 'ALL PRODUCTS';
  let activeSelectionText = 'The Collection';

  if (searchTerm) {
    activeBreadcrumbText = 'SEARCH';
    activeSelectionText = `Results for "${searchTerm}"`;
  } else if (selectedCategories.length > 0) {
    activeBreadcrumbText = 'CATEGORY';
    activeSelectionText = selectedCategories.length > 1 ? 'Selected Categories' : selectedCategories[0];
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header1 />
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 pt-12 pb-16 flex flex-col items-center">

      {/* ── ⚡ REFINED LUXURY TITLE SECTION (COMPACT & QUOTE-FREE) ── */}
        <div className="w-full flex flex-col items-center text-center mt-4 mb-8 md:mb-12">
          
          {/* Breadcrumbs - Ultra Slim */}
          <div 
            className="flex items-center justify-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold tracking-[0.25em] uppercase mb-3"
            style={{ color: "#999" }}
          >
            <Link to="/" className="hover:text-black transition-colors duration-300">HOME</Link>
            <span className="opacity-30">/</span>
            <span className="text-[#111]">{activeBreadcrumbText}</span>
          </div>

          {/* Main Title - No Quotes, Minimalist & Elegant */}
          <h1 
            className="text-[28px] sm:text-[34px] md:text-[40px] tracking-tight text-[#111] leading-none px-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: '600' }}
          >
            {searchTerm ? (
              <span className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <span className="text-gray-400 font-normal italic text-[20px] sm:text-[28px]">Results for</span>
                <span className="capitalize">{searchTerm}</span>
              </span>
            ) : (
              activeSelectionText
            )}
          </h1>

          {/* Minimalist Decorative Dash */}
          <div className="mt-5 w-10 h-[1.5px] bg-black opacity-80"></div>
        </div>
        {/* ─────────────────────────────────────────────────────────── */}

        {/* ── FILTER BAR ── */}
        <div className="w-full mb-8">
          <ShopTopbar
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryToggle={(cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
            brands={allBrands}
            selectedBrands={selectedBrands}
            onBrandToggle={(br) => setSelectedBrands(prev => prev.includes(br) ? prev.filter(b => b !== br) : [...prev, br])}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPriceLimit={maxPriceLimit}
            onClearFilters={clearFilters}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            sortBy={sortOrder}
            setSortBy={setSortOrder}
          />
        </div>

        {/* ── PRODUCT GRID ── */}
        <div className="w-full">
          {loading ? (
            <div className="w-full py-40 flex flex-col items-center gap-4">
               <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
               <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Fetching Perfection</p>
            </div>
          ) : (
            // ⚡ FIX 2: Mobile par grid-cols-2 kar diya gaya hai aur gap theek kar diya hai!
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <ShopProductCard key={p._id} product={p} onQuickView={setSelectedProduct} />
                ))
              ) : (
                <div className="col-span-full text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-gray-400 font-serif italic text-lg mb-6">No masterpieces found matching your criteria.</p>
                  <button onClick={clearFilters} className="bg-black text-white px-10 py-4 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all cursor-pointer">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <Footer />
    </div>
  );
}