import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance'; 
import { Link } from 'react-router-dom';

export default function SaleCategories() {
  const [saleProducts, setSaleProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/products');
        
        if (data.success && data.products) {
          const discountedProducts = data.products.filter(
            (p) => p.discountPrice > 0 || (p.flashDeal && p.flashDeal.isActive)
          );

          setSaleProducts(discountedProducts);

          const fetchedBrands = [...new Set(discountedProducts.map((p) => p.brand?.toUpperCase()).filter(Boolean))];
          setBrands(['ALL', ...fetchedBrands]);
        }
      } catch (error) {
        console.error("Error fetching sale products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  const displayedProducts = activeBrand === 'ALL' 
    ? saleProducts 
    : saleProducts.filter(p => p.brand?.toUpperCase() === activeBrand);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(price);
  };

  const getMainImage = (p) => {
    if (p.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
    if (p.images?.[0]?.url) return p.images[0].url;
    return 'https://placehold.co/400x400/f9f9f9/C8A253?text=No+Image'; 
  };

  if (loading) {
    // ⚡ THEME UPDATE: Spinner color updated to primary
    return <div className="w-full py-20 flex justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--theme-primary)] rounded-full animate-spin"></div></div>;
  }

  if (saleProducts.length === 0) return null;

  return (
    // ⚡ THEME UPDATE: bg-[#fafafa] changed to bg-theme-bg-light
    <section className="py-20 bg-theme-bg-light transition-colors duration-500" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ⚡ THEME UPDATE: text-black to text-theme-text-main */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-theme-text-main mb-4 tracking-tight transition-colors duration-500">
          Categories
        </h2>

        {/* Brands Tabs */}
        <div className="flex flex-nowrap overflow-x-auto items-center gap-4 md:gap-6 mb-16 py-4 px-4 sm:px-8 hide-scrollbar snap-x">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              // ⚡ THEME UPDATE: Active state colors (border and text) mapped to theme variables
              className={`shrink-0 px-8 py-3 text-[11px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm bg-white shadow-[0_4px_20px_rgba(0,0,0,0.20)] hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.35)] hover:-translate-y-1 ${
                activeBrand === brand
                  ? 'text-theme-text-main scale-105 border-b-[3px] border-[var(--theme-primary)]' 
                  : 'text-gray-500' 
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2 md:px-6 justify-items-center">
          {displayedProducts.map((product) => {
            const isDealActive = product.flashDeal?.isActive && new Date(product.flashDeal.endTime).getTime() > Date.now();
            const finalPrice = isDealActive ? product.flashDeal.dealPrice : product.price - (product.discountPrice || 0);

            return (
              <Link 
                to={`/product/${product._id}`} 
                key={product._id} 
                className="group relative bg-white rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:-translate-y-2 shadow-[0_4px_20px_rgba(0,0,0,0.20)] w-full max-w-[260px] h-[380px] overflow-hidden"
              >
                
                {/* Sale Ribbon 
                    ⚡ THEME UPDATE: Ribbon color updated to primary
                */}
                <div className="absolute top-1 -left-13 w-[1400px] bg-[var(--theme-primary)] text-theme-text-light text-[12px] font-black py-2.5 text-center tracking-widest -rotate-45 z-10 shadow-sm">
                  SALE!
                </div>

                {/* Product Image */}
                <div className="flex-1 w-full relative flex items-center justify-center mt-6 mb-2">
                  <img 
                    src={getMainImage(product)} 
                    alt={product.name} 
                    className="max-w-full max-h-[160px] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Details Section */}
                <div className="w-full mt-auto pb-1 text-center">
                  {/* ⚡ THEME UPDATE: Title color */}
                  <h3 className="text-[14px] font-bold text-theme-text-main mb-2 px-1 mx-auto break-words whitespace-normal leading-snug transition-colors duration-500" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-center gap-1 mb-3 mt-1">
                    {[...Array(5)].map((_, i) => (
                      // ⚡ THEME UPDATE: Star stroke can optionally use primary, but kept gold for standard rating feel
                      <Star key={i} className="w-3.5 h-3.5 text-[#f5b041]" strokeWidth={1.5} fill="transparent" />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[13px]">
                    <span className="text-gray-400 line-through font-medium">
                      {formatPrice(product.price)}
                    </span>
                    {/* ⚡ THEME UPDATE: Price color */}
                    <span className="text-theme-text-main font-black transition-colors duration-500">
                      {formatPrice(finalPrice)}
                    </span>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}