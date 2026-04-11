import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ShopTopbar from './ShopSidebar'; 
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
        // Using lean and select for faster performance as discussed
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
      if (location.state.category) setSelectedCategories([location.state.category]);
      if (location.state.search) setSearchTerm(location.state.search);
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
      const matchesSearch = !query || p.name.toLowerCase().includes(query) || p.brand?.toLowerCase().includes(query);
      
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

  const activeBreadcrumbText = searchTerm ? 'SEARCH' : (selectedCategories[0] || 'ALL PRODUCTS');
  const activeSelectionText = searchTerm ? `Results for "${searchTerm}"` : (selectedCategories[0] || 'The Collection');

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header1 />
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 pt-12 pb-16 flex flex-col items-center">

        {/* ── ⚡ LUXURY TITLE SECTION ── */}
        <div className="w-full flex flex-col items-center text-center mb-12 md:mb-16">
          <h1 
            className="text-[36px] md:text-[46px] font-serif tracking-tight text-[#111] mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700' }}
          >
            {activeSelectionText}
          </h1>

          <div 
            className="flex items-center justify-center gap-4 text-[10px] md:text-[11px] font-medium tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif", color: "#999" }}
          >
            <Link to="/" className="hover:text-black transition-all duration-300">HOME</Link>
            <span className="opacity-30">/</span>
            <span className="text-[#333] font-bold">{activeBreadcrumbText}</span>
          </div>

          <div className="mt-8 w-16 h-[1.5px] bg-[#d4af37] opacity-50"></div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="w-full mb-8">
          <ShopTopbar
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryToggle={(cat) => setSelectedCategories(prev => prev.includes(cat) ? [] : [cat])}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <ShopProductCard key={p._id} product={p} onQuickView={setSelectedProduct} />
                ))
              ) : (
                <div className="col-span-full text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-gray-400 font-serif italic text-lg mb-6">No masterpieces found matching your criteria.</p>
                  <button onClick={clearFilters} className="bg-black text-white px-10 py-4 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all">
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