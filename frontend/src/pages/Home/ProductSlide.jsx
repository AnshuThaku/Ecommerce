import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🔥 BHAII YAHAN DHYAN DO 🔥
// Apne VS Code mein is niche wali line se "//" HATA DENA (Uncomment kar dena) tabhi API chalegi!
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
        let responseData;

        // 👉 Agar aapne upar axiosInstance ko uncomment kiya hai, toh yeh if block chalega
        if (typeof axiosInstance !== 'undefined') {
          const { data } = await axiosInstance.get('/products');
          responseData = data;
        } else {
          // Yeh sirf Canvas preview ko crash hone se bachane ke liye fallback hai
          const response = await fetch('/products');
          responseData = await response.json().catch(() => ({}));
        }
        
        if (responseData?.success && responseData.products) {
          const uniqueCategories = new Map(); 
          
          responseData.products.forEach(product => {
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
        } else {
          // ❌ Agar uncomment nahi kiya hai, toh ek dummy card dikhayega yaad dilane ke liye
          setCategories([
            { 
              id: 'dummy-1', 
              name: '⚠️ Uncomment axiosInstance line!', 
              image: 'https://placehold.co/200x200/ffffff/d3b574?text=Uncomment+Axios' 
            }
          ]);
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
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryName) => {
    if(categoryName.includes('Uncomment')) return; // Dummy card pe click disable kiya hai
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="bg-white py-12 w-full border-y border-gray-100">
      
      {/* HEADING */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-2xl md:text-3xl font-serif italic text-black flex items-center gap-3">
          Shop By <span className="text-[#d3b574]">Category</span>
        </h2>
      </div>

      {/* SLIDER */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative group">

        {/* LEFT ARROW */}
        <button 
          onClick={slideLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-[-20%] z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-[#d3b574] hover:text-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5 rotate-[-15deg]" />
        </button>

        {/* CARDS */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 py-10 px-4 snap-x hide-scrollbar"
        >
          {loading ? (
            [1,2,3,4,5].map(i => (
              <div key={i} className="flex-shrink-0 w-[160px] md:w-[180px] h-[160px] bg-white shadow-[0_0px_20px_rgba(0,0,0,0.08)] rounded-2xl animate-pulse"></div>
            ))
          ) : (
            categories.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleCategoryClick(item.name)}
                className="flex-shrink-0 snap-start w-[160px] md:w-[180px] bg-white rounded-2xl shadow-[0_0px_20px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center p-5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0px_30px_rgba(0,0,0,0.12)] cursor-pointer"
              >
                
                {/* IMAGE (NO BACKGROUND) */}
                <div className="w-[85px] h-[85px] flex items-center justify-center mb-4">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-110"
                  />
                </div>

                {/* TEXT */}
                <h3 className={`text-sm font-semibold text-center leading-tight transition ${item.name.includes('Uncomment') ? 'text-red-500' : 'text-gray-800 hover:text-[#d3b574]'}`}>
                  {item.name}
                </h3>

              </div>
            ))
          )}
        </div>

        {/* RIGHT ARROW */}
        <button 
          onClick={slideRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20%] z-30 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-[#d3b574] hover:text-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] hidden md:flex"
        >
          <ChevronRight className="w-5 h-5 rotate-[15deg]" />
        </button>

      </div>

      {/* HIDE SCROLLBAR */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

    </div>
  );
}