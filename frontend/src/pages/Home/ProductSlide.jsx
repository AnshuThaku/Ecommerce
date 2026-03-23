import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductSlide() {
  // Slider ko scroll karne ke liye ref
  const sliderRef = useRef(null);

  // Left scroll karne ka function
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -352, behavior: 'smooth' });
    }
  };

  // Right scroll karne ka function
  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 352, behavior: 'smooth' });
    }
  };

  // Aapka data (Images ko baad mein apne hisaab se update kar lena)
  const categories = [
    { id: 1, name: 'Mouse', image: 'toad-13-portronics-original-imag8zbqqkgmb9d6-removebg-preview.png' },
    { id: 2, name: 'Keyboards', image: '/zeb-k20-zeb-k65-zebronics-original-imahkhtycdhysymp-removebg-preview.png' },
    { id: 3, name: 'EXTERNAL Hard Disks', image: 'groove-2-infire-original-imahh2m3ufzh7qdh-removebg-preview.png' },
    { id: 4, name: 'Headphones', image: '/-original-imahafrzuterwrbk-removebg-preview.png' },
    { id: 5, name: 'Memory Cards', image: '/a02-avoc-flash-original-imahhb7x88epdgbc-removebg-preview.png' },
    { id: 6, name: 'Mobile Accessories', image: '/-original-imahew8ezfbev4gm-removebg-preview.png' },
    { id: 7, name: 'Pendrives', image: '/-original-imahjfhbz9rdazwy-removebg-preview.png' },
    { id: 8, name: 'Laptop Accessories', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&h=200&fit=crop' },
    { id: 9, name: 'Speaker', image: '/groove-2-infire-original-imahh2m3ufzh7qdh-removebg-preview.png' },
    { id: 10, name: 'Smartwatches', image: '-original-imagp8r8wzkzqwvv-removebg-preview.png' },
    { id: 11, name: 'Camera', image: '1-spy011-indoor-outdoor-security-camera-prizor-original-imahg8yd5d9vsang-removebg-preview.png' },
  ];

  return (
    <div className="bg-[#121212] py-12 w-full">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-2xl md:text-3xl font-serif italic text-white flex items-center gap-3">
          Shop By <span className="text-[#d3b574]">Category</span>
        </h2>
      </div>

      {/* Main Slider Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative group">
        
        {/* Left Arrow Button */}
        <button 
          onClick={slideLeft} 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#111]/80 backdrop-blur-md border border-zinc-800 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#d3b574] hover:text-black hover:border-[#d3b574] shadow-xl hidden md:flex"
          aria-label="Pichla dekhein"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Area */}
        <div 
          ref={sliderRef} 
          className="flex scroll-smooth overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar"
        >
          {categories.map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 snap-start bg-[#111] rounded-xl border border-zinc-800 hover:border-[#d3b574]/50 flex flex-col items-center justify-center p-4 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer w-[160px] md:w-[176px]"
            >
              {/* Image Container */}
              <div className="w-[100px] h-[100px] flex items-center justify-center mb-4 bg-[#1A1A1A] rounded-full p-3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="max-w-full max-h-full object-contain mix-blend-screen" 
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/200x200/1A1A1A/d3b574?text=Item" }}
                />
              </div>
              
              {/* Category Title */}
              <h3 className="text-[13px] font-medium text-gray-300 text-center leading-tight group-hover:text-[#d3b574] transition-colors line-clamp-2">
                {item.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button 
          onClick={slideRight} 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#111]/80 backdrop-blur-md border border-zinc-800 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#d3b574] hover:text-black hover:border-[#d3b574] shadow-xl hidden md:flex"
          aria-label="Agla dekhein"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* Hide Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}