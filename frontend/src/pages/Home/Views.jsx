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
        const response = await axiosInstance.get('/products');
        if (response.data && response.data.length > 0) {
          const products = response.data;
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

  // Fallbacks
  const imageUrl = product?.images?.[0]?.url || product?.variants?.[0]?.images?.[0]?.url || "https://images.unsplash.com/photo-1692651763027-72aeb12130d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFyc2hhbGwlMjBzcGVha2VyfGVufDB8fDB8fHww";
  const name = product?.name || "MARSHALL ACTIVE 3";
  const description = product?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const price = product?.basePrice ? `$${product.basePrice.toFixed(2)}` : "$100.00";

  return (
    // Parent Container with White Background
    <div className="w-full flex flex-col items-center justify-center bg-white py-12 px-4 lg:px-12">
      
      {/* ⚡ 'justify-between' use kiya hai taaki dono ke beech khali WHITE SPACE (gap) aaye */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-stretch h-auto lg:h-[450px]">

        {/* 📱💻 LEFT SECTION (Image) - Ekdum Seedhi (Straight Rectangle) */}
        {/* Width 46% rakhi hai taaki baaki space white gap ban jaye */}
        <div className="w-full lg:w-[46%] h-[300px] lg:h-full bg-white shadow-sm">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 📱💻 RIGHT SECTION (Grey Box) - Tircha (Slanted) Edge */}
        {/* Width 50% rakhi hai. Left (46%) + Right (50%) = 96%. Jo 4% bacha wo WHITE GAP hai! */}
        <div className="w-full lg:w-[50%] h-full relative mt-8 lg:mt-0">
          
          {/* ⚡ THIN BLACK LINE HACK */}
          {/* Ye black box hai jo piche rahega aur sirf edge par border ki tarah dikhega */}
          <div className="hidden lg:block absolute inset-0 bg-[#1a1a1a] [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)] z-10"></div>
          
          {/* ⚡ MAIN GREY BOX */}
          {/* Ye box black box se 2px right mein shifted hai taaki wo patli black line left mein dikhe */}
          <div className="relative h-full w-full bg-[#ebebeb] lg:[clip-path:polygon(calc(10%+2.5px)_0,100%_0,100%_100%,2.5px_100%)] flex flex-col justify-center px-8 sm:px-12 lg:pl-[18%] lg:pr-12 py-12 lg:py-0 z-20">
            
            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-serif text-[#333] mb-5 uppercase tracking-wide leading-tight">
              {name}
            </h1>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-[10px] md:text-[11px] font-bold text-black uppercase tracking-widest border-b-[1.5px] border-black pb-0.5 inline-block mb-3">
                Description
              </h3>
              <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed max-w-sm">
                {description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-6 text-xl md:text-2xl font-bold text-black tracking-tight">
              {price}
            </div>

            {/* Button */}
            <button 
              onClick={() => navigate(`/product/${product?._id}`)}
              className="bg-black text-white px-10 py-3 rounded-full text-[10px] font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95 uppercase tracking-[0.2em] w-max"
            >
              Shop Now
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarshallDesign;