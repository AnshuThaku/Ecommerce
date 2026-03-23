import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; 

export default function ProductSlide() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicCategories = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/products');
        
        if (data?.success) {
          const uniqueCategories = new Map(); 
          
          data.products.forEach(product => {
            if (product.isActive && product.category && !uniqueCategories.has(product.category)) {
              let imgUrl = "https://placehold.co/200x200/ffffff/d3b574?text=" + encodeURIComponent(product.category);
              if (product.variants?.[0]?.images?.[0]?.url) {
                imgUrl = product.variants[0].images[0].url;
              } else if (product.images?.[0]?.url) {
                imgUrl = product.images[0].url;
              }

              uniqueCategories.set(product.category, {
                id: product.category, 
                name: product.category,
                image: imgUrl
              });
            }
          });
          setCategories(Array.from(uniqueCategories.values()));
        }
      } catch (error) {
        console.error("Categories fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicCategories();
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -352, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 352, behavior: 'smooth' });
    }
  };

  if (!loading && categories.length === 0) return null;

  return (
    // ⚡ Changed: bg-[#121212] se bg-white kar diya
    <div className="bg-white py-12 w-full border-y border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* ⚡ Changed: text-white se text-black kar diya */}
        <h2 className="text-2xl md:text-3xl font-serif italic text-black flex items-center gap-3">
          Shop By <span className="text-[#d3b574]">Category</span>
        </h2>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative group">
        
        {/* Left Arrow Button */}
        <button 
          onClick={slideLeft} 
          // ⚡ Changed: Light theme arrows
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-black flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#d3b574] hover:text-white hover:border-[#d3b574] shadow-lg hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div 
          ref={sliderRef} 
          className="flex scroll-smooth overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar"
        >
          {loading ? (
             // ⚡ Changed: Skeleton loader for Light Theme
             [1, 2, 3, 4, 5, 6].map((skeleton) => (
               <div key={skeleton} className="flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-4 w-[160px] md:w-[176px] h-[160px] animate-pulse flex flex-col items-center justify-center">
                 <div className="w-[100px] h-[100px] bg-gray-200 rounded-full mb-4"></div>
                 <div className="w-20 h-3 bg-gray-200 rounded"></div>
               </div>
             ))
          ) : (
            categories.map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigate('/shop')} 
                // ⚡ Changed: Card background (gray-50) and borders for Light Theme
                className="flex-shrink-0 snap-start bg-gray-50 rounded-xl border border-gray-100 hover:border-[#d3b574]/50 flex flex-col items-center justify-center p-4 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer w-[160px] md:w-[176px]"
              >
                {/* ⚡ Changed: Image background to white with shadow */}
                <div className="w-[100px] h-[100px] flex items-center justify-center mb-4 bg-white rounded-full p-3 overflow-hidden shadow-sm">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    // ⚡ Important: White background pe 'mix-blend-multiply' use karte hain taaki images perfectly blend hon
                    className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/200x200/ffffff/d3b574?text=" + encodeURIComponent(item.name) }}
                  />
                </div>
                
                {/* ⚡ Changed: Text color to gray-800 */}
                <h3 className="text-[13px] font-bold text-gray-800 text-center leading-tight group-hover:text-[#d3b574] transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </div>
            ))
          )}
        </div>

        {/* Right Arrow Button */}
        <button 
          onClick={slideRight} 
          // ⚡ Changed: Light theme arrows
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-black flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#d3b574] hover:text-white hover:border-[#d3b574] shadow-lg hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}