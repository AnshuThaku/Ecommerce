import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance'; 
import { Link } from 'react-router-dom';

export default function SaleCategories() {
  const [saleProducts, setSaleProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState('ALL');
  const [loading, setLoading] = useState(true);
  
  const sliderRef = useRef(null);

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

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300; 
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="w-full py-20 flex justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div></div>;
  }

  if (saleProducts.length === 0) return null;

  return (
    <section className="py-4 md:py-10 bg-gray-50 transition-colors duration-500" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* Wrapper */}
      <div className="w-full max-w-[89%] mx-auto px-4 sm:px-6 lg:px-8 relative">

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-[900] text-center text-black mb-6 md:mb-8 tracking-wider uppercase">
          CATEGORIES
        </h2>

        {/* ⚡ THE FIX: Removed max-w-4xl and mx-auto, made it w-full to stretch edge-to-edge ⚡ */}
        <div className="relative group w-full mb-8 md:mb-16">
          
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl hover:shadow-2xl text-gray-600 hover:text-black rounded-full w-12 h-12 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center cursor-pointer border border-gray-100 -ml-4"
          >
            <ChevronLeft size={24} strokeWidth={2.5} className="-ml-1" />
          </button>

          {/* Slider Container */}
          <div ref={sliderRef} className="flex flex-nowrap overflow-x-auto items-center gap-4 md:gap-6 py-4 px-2 hide-scrollbar snap-x scroll-smooth w-full">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className={`shrink-0 px-8 py-3 text-[11px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_-4px_rgba(0,0,0,0.30)] hover:-translate-y-1 ${
                  activeBrand === brand
                    ? 'text-black scale-105 border-b-[3px] border-black' 
                    : 'text-gray-500' 
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl hover:shadow-2xl text-gray-600 hover:text-black rounded-full w-12 h-12 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center cursor-pointer border border-gray-100 -mr-4"
          >
            <ChevronRight size={24} strokeWidth={2.5} className="-mr-1" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {displayedProducts.map((product) => {
            const isDealActive = product.flashDeal?.isActive && new Date(product.flashDeal.endTime).getTime() > Date.now();
            const finalPrice = isDealActive ? product.flashDeal.dealPrice : product.price - (product.discountPrice || 0);

            return (
              <Link 
                to={`/product/${product._id}`} 
                key={product._id} 
                className="group relative bg-white overflow-hidden rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:-translate-y-2 shadow-[0_4px_20px_rgba(0,0,0,0.15)] w-full max-w-[280px] h-[400px]"
              >
                
                {/* Sale Tag */}
                <div 
                  className="absolute top-0 left-0 bg-black text-white text-[10px] md:text-xs font-black px-4 py-1.5 uppercase tracking-widest z-10 shadow-sm"
                  style={{
                    borderBottomRightRadius: "1rem"
                  }}
                >
                  SALE
                </div>

                {/* Product Image */}
                <div className="flex-1 w-full relative flex items-center justify-center mt-6 mb-4">
                  <img 
                    src={getMainImage(product)} 
                    alt={product.name} 
                    className="max-w-full max-h-[180px] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Details Section */}
                <div className="w-full mt-auto pb-2 text-center">
                  <h3 className="text-[14px] font-bold text-black mb-3 px-2 mx-auto break-words whitespace-normal leading-snug transition-colors duration-500" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#f5b041]" strokeWidth={1.5} fill="transparent" />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[14px]">
                    <span className="text-gray-400 line-through font-medium">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-black font-black transition-colors duration-500 text-[16px]">
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