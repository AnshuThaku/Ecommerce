// src/components/ProductGrid.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; // Import naya component
import QuickViewModal from './QuickModel'; // Import modal

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

  if (!products || products.length === 0) return null;

  const isLightning = title?.toLowerCase().includes('lightning');

  return (
    <section className="bg-white py-12 sm:py-20 font-sans selection:bg-[#d3b574] selection:text-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12">
          <div className="text-left">
            <div className="flex items-center space-x-4 mb-3 sm:mb-4">
              <div className={`w-8 sm:w-10 h-[1px] ${isLightning ? 'bg-red-600' : 'bg-[#d3b574]'}`}></div>
              <span className={`text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-black ${isLightning ? 'text-red-600 animate-pulse' : 'text-[#d3b574]'}`}>
                {isLightning ? 'Limited Time Offer' : 'Exclusively Curated'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-black leading-tight">
              {title} <span className="text-gray-300">{subtitle}</span>
            </h2>
          </div>
        </div>

        {/* Slider Container */}
        <div 
          className="flex flex-nowrap overflow-x-auto overflow-y-hidden justify-start items-stretch gap-4 sm:gap-6 pt-6 pb-10 hide-scrollbar snap-x px-2"
          style={{ touchAction: 'pan-x' }} 
        >
          {products.map((p) => (
            <div key={p._id || Math.random()} className="w-[280px] sm:w-[300px] shrink-0 snap-start">
              {/* Using the separated component */}
              <ProductCard product={p} onQuickView={setSelectedProduct} />
            </div>
          ))}
        </div>

      </div>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}