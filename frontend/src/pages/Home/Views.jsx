import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const MarshallDesign = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestProduct = async () => {
      try {
        const response = await axiosInstance.get('/api/products');
        if (response.data && response.data.length > 0) {
          // Taking a visually appealing product like Speaker or the last one added
          const products = response.data;
          // You could filter by a specific category, e.g. 'SPEAKERS' if you want.
          const demoProduct = products.find(p => p?.category?.toLowerCase() === 'speakers') || products[products.length - 1];
          setProduct(demoProduct);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching views product:', error);
        setLoading(false);
      }
    };
    fetchBestProduct();
  }, []);

  if (loading) return null;

  // Fallbacks if data exists
  const imageUrl = product?.images?.[0]?.url || product?.variants?.[0]?.images?.[0]?.url || "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2000";
  const name = product?.name || "MARSHALL ACTIVE 3";
  const description = product?.description || "Experience the iconic sound in a compact build. Premium materials for a timeless look and superior audio performance.";
  const price = product?.basePrice ? `$${product.basePrice.toFixed(2)}` : "$100.00";

  return (
    <div className="w-full flex flex-col items-center justify-center bg-[#bdbebe]">
      {/* 2. Main Container */}
      {/* Humne bg-[#bdbebe] poore container par laga diya hai taaki koi white gap na bache */}
      <div className="relative w-full flex flex-col lg:flex-row overflow-hidden h-auto lg:h-[540px] bg-[#bdbebe]">
        
        {/* Left Section: Image with Slant */}
        <div 
          className="relative w-full lg:w-[60%] h-[300px] sm:h-[400px] lg:h-full bg-white z-10"
        >
          {/* Apply Slant clip-path only on large screens using Tailwind */}
          <div className="w-full h-full lg:[clip-path:polygon(0_0,100%_0,85%_100%,0%_100%)]">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right Section: Content */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 lg:-ml-12 py-12 lg:py-0 z-0">
          
          <h1 className="text-xl md:text-3xl lg:text-4xl font-serif text-[#1a1a1a] mb-4 uppercase tracking-tighter leading-none line-clamp-2">
            {name}
          </h1>
          
          <div className="mb-4">
            <h3 className="text-[9px] md:text-[10px] font-bold text-gray-800 uppercase tracking-[0.2em] border-b border-gray-600 inline-block mb-2">
              Description
            </h3>
            <p className="text-[10px] sm:text-[11px] md:text-xs text-gray-700 leading-relaxed max-w-lg line-clamp-3">
              {description}
            </p>
          </div>

          <div className="mb-5 text-lg md:text-xl font-bold text-gray-900 tracking-tight">
            {price}
          </div>

          <button 
            onClick={() => navigate(`/product/${product?._id}`)}
            className="w-fit bg-black text-white px-7 py-2.5 rounded-lg text-[9px] md:text-[10px] font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarshallDesign; // Used as Views component
