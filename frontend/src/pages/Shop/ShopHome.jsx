import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ShopTopbar from './ShopSidebar'; // Make sure the path matches your filename
import ShopProductCard from './ShopProductCard';
import QuickViewModal from '../Product/QuickModel';
import Footer from '../Home/Footer'; 
import Header1 from '../Home/Header1'; 
import Toast from '../../components/Toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandsSection from '../../components/Brands';

export default function ShopHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (type, message) => setToastMessage({ type, message });
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  
  const [sortOrder, setSortOrder] = useState('best-selling');
  const [inStockOnly, setInStockOnly] = useState(false);

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
  
  const allCategories = useMemo(() => [...new Set(products.map(p => p.category))].filter(Boolean), [products]);
  const allBrands = useMemo(() => [...new Set(products.map(p => p.brand))].filter(Boolean), [products]);

  useEffect(() => {
    if (location.state && !location.state.processed) {
      if (location.state.category && location.state.search) {
        setSelectedCategories([location.state.category]);
        setSearchTerm(location.state.search);
        clearOtherFilters();
      } else if (location.state.category) {
        setSelectedCategories([location.state.category]);
        setSearchTerm(''); 
        clearOtherFilters();
      } else if (location.state.search) {
        setSearchTerm(location.state.search);
        setSelectedCategories([]); 
        clearOtherFilters();
      }
      navigate(location.pathname, { replace: true, state: { ...location.state, processed: true } });
    }
  }, [location.state, navigate, maxPriceLimit]);

  const clearOtherFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setPriceRange({ min: 0, max: maxPriceLimit });
    setSelectedRating(null);
    setSelectedDiscount(null);
  }

  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setSearchTerm(''); 
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
    setInStockOnly(false);
    setSortOrder('best-selling');
  };

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
      const matchesSearch = !query || (p.name && p.name.toLowerCase().includes(query)) || (p.brand && p.brand.toLowerCase().includes(query));   
      
      const actualPrice = p.price || 0;
      const actualDiscount = p.discountPrice || 0;
      const currentPrice = p.flashDeal?.isActive && p.flashDeal?.dealPrice ? p.flashDeal.dealPrice : (actualPrice - actualDiscount);
      
      const isStockAvailable = p.stock > 0 || (p.variants && p.variants.some(v => v.stock > 0));
      const matchesStock = inStockOnly ? isStockAvailable : true;

      return matchesCategory && matchesBrand && matchesSearch && currentPrice >= priceRange.min && currentPrice <= priceRange.max && matchesStock;
    }).sort((a, b) => {
      const priceA = a.flashDeal?.isActive && a.flashDeal?.dealPrice ? a.flashDeal.dealPrice : ((a.price || 0) - (a.discountPrice || 0));
      const priceB = b.flashDeal?.isActive && b.flashDeal?.dealPrice ? b.flashDeal.dealPrice : ((b.price || 0) - (b.discountPrice || 0));
      
      if (sortOrder === 'price-asc') return priceA - priceB;    
      if (sortOrder === 'price-desc') return priceB - priceA;   
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt); 
      return 0;
    });
  }, [products, selectedCategories, selectedBrands, searchTerm, priceRange, sortOrder, inStockOnly]);
  
  const displayProducts = filteredProducts;

  const activeBreadcrumbText = searchTerm ? 'SEARCH' : (selectedCategories.length > 0 ? selectedCategories.join(', ').toUpperCase() : (selectedBrands.length > 0 ? selectedBrands.join(', ').toUpperCase() : 'ALL PRODUCTS'));
  const activeSelectionText = searchTerm ? `RESULTS FOR "${searchTerm.toUpperCase()}"` : (selectedCategories.length > 0 ? selectedCategories.join(', ').toUpperCase() : (selectedBrands.length > 0 ? selectedBrands.join(', ').toUpperCase() : 'ALL PRODUCTS'));

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-center">
      <Header1 />
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex flex-col items-center">

        {/* ⚡ Title Section - Centered */}
        <div className="w-full flex flex-col items-center text-center mb-8">
          <h1 className="text-[28px] md:text-[40px] font-serif font-bold tracking-tight text-[#111] mb-2 uppercase">
               {activeSelectionText}
          </h1>
          <div className="text-[11px] font-medium tracking-widest uppercase text-[#888] flex items-center justify-center gap-2">
              <Link to="/" className="hover:text-[#111] transition-colors cursor-pointer">HOME</Link>
              <span>/</span>
              <span className="text-[#111]">{activeBreadcrumbText}</span>
          </div>
        </div>

        {/* ⚡ FILTER BAR - Placed Below Title */}
        <ShopTopbar
           categories={allCategories}
           selectedCategories={selectedCategories}
           onCategoryToggle={handleCategoryToggle}
           brands={allBrands}
           selectedBrands={selectedBrands}
           onBrandToggle={handleBrandToggle}
           priceRange={priceRange}
           setPriceRange={setPriceRange}
           maxPriceLimit={maxPriceLimit}
           onClearFilters={clearFilters}
           inStockOnly={inStockOnly}
           setInStockOnly={setInStockOnly}
           sortBy={sortOrder}
           setSortBy={setSortOrder}
        />

        {/* Layout Box: Product Grid */}
        <div className="w-full mt-4">
          {loading ? (
              <div className="w-full py-32 flex justify-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div></div>
          ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                {displayProducts.length > 0 ? (
                  displayProducts.map(p => (
                      <ShopProductCard key={p._id} product={p} onQuickView={setSelectedProduct} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-24 bg-white border border-gray-100 rounded-sm">
                    <p className="text-gray-500 text-[15px] mb-5">No products found matching your current filters.</p>
                    <button onClick={clearFilters} className="text-black font-bold uppercase tracking-widest text-[11px] border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-colors cursor-pointer">
                      Clear All Filters
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