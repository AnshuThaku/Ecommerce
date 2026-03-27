// src/components/ProductGrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard'; 
import QuickViewModal from './QuickModel'; 
import { ChevronLeft, ChevronRight } from 'lucide-react';

// AOS Styles
const injectAOSStyles = () => {
  if (!document.getElementById('custom-aos-styles')) {
    const style = document.createElement('style');
    style.id = 'custom-aos-styles';
    style.innerHTML = `
      [data-aos="fade-up"] {
        opacity: 0;
        transform: translateY(120px) scale(0.95);
        transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
      }
      [data-aos="fade-up"].aos-animate {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes cardImageFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-card-fade-in {
        animation: cardImageFadeIn 0.8s ease-in forwards;
      }
    `;
    document.head.appendChild(style);
  }
};

export default function ProductGrid({ title, subtitle, products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const sliderRef = useRef(null);

  useEffect(() => {
    injectAOSStyles();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.1 }); 

    setTimeout(() => {
      document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, [products]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedProduct]);

  // Button click par scroll karne ka function
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350; 
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  const isLightning = title?.toLowerCase().includes('lightning');

  return (
    <section className="bg-white py-12 sm:py-20 font-sans selection:bg-[#d3b574] selection:text-black relative">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-3 sm:mb-4 text-center">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <div className={`w-8 sm:w-12 h-[2px] ${isLightning ? 'bg-red-600' : 'bg-[#d3b574]'}`}></div>
            <span className={`text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-black ${isLightning ? 'text-red-600 animate-pulse' : 'text-[#d3b574]'}`}>
              {isLightning ? 'Limited Time Offer' : 'Exclusively Curated'}
            </span>
            <div className={`w-8 sm:w-12 h-[2px] ${isLightning ? 'bg-red-600' : 'bg-[#d3b574]'}`}></div>
          </div>
          
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {title} <span className="text-gray-400 font-medium ml-2">{subtitle}</span>
          </h2>
        </div>

        {/* ⚡ Slider Wrapper with Small Navigation Buttons ⚡ */}
        <div className="relative group">
          
          {/* ⚡ Chhota Left Arrow Button ⚡ */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-50 bg-white border border-gray-100 shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgb(211,181,116,0.4)] hover:scale-110 text-black hover:text-[#d3b574] rounded-full w-10 h-10 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft size={20} strokeWidth={3} className="-ml-0.5" />
          </button>

          {/* Slider Container */}
          <div 
            ref={sliderRef}
            className="flex flex-nowrap overflow-x-auto overflow-y-hidden justify-start items-stretch gap-4 sm:gap-6 pt-6 pb-10 hide-scrollbar snap-x px-2 scroll-smooth"
            style={{ touchAction: 'pan-x' }} 
          >
            {products.map((p) => (
              <div key={p._id || Math.random()} className="w-[280px] sm:w-[300px] shrink-0 snap-start">
                <ProductCard product={p} onQuickView={setSelectedProduct} />
              </div>
            ))}
          </div>

          {/* ⚡ Chhota Right Arrow Button ⚡ */}
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-50 bg-white border border-gray-100 shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgb(211,181,116,0.4)] hover:scale-110 text-black hover:text-[#d3b574] rounded-full w-10 h-10 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center cursor-pointer"
          >
            <ChevronRight size={20} strokeWidth={3} className="-mr-0.5" />
          </button>

        </div>

      </div>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}