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

  const imageUrl = product?.images?.[0]?.url || product?.variants?.[0]?.images?.[0]?.url || "https://images.unsplash.com/photo-1692651763027-72aeb12130d7?w=800&auto=format&fit=crop&q=60";
  const name = product?.name || "MARSHALL ACTIVE 3";
  const description = product?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin.";
  const price = product?.basePrice ? `₹${product.basePrice.toFixed(2)}` : "₹100.00";

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white py-12 px-4 lg:px-12">
      
      {/* Container: md (768px+) par h-[450px] fix kar diya hai taaki dono side ekdum barabar rahein */}
      <div className="w-full flex flex-col md:flex-row justify-between items-stretch h-auto md:h-[450px]">

        {/* LEFT SECTION (Image) */}
        {/* md:h-full ensures image height matches the 450px container height */}
        <div className="w-full md:w-[46%] h-[300px] md:h-full bg-white shadow-sm overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* RIGHT SECTION (Grey Box) */}
        {/* md:h-full matches the parent's 450px height */}
        <div className="w-full md:w-[50%] h-auto md:h-full relative mt-8 md:mt-0">
          
          <div className="hidden md:block absolute inset-0 bg-[#1a1a1a] [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)] z-10"></div>
          
          <div className="relative h-full w-full bg-[#ebebeb] md:[clip-path:polygon(calc(10%+2.5px)_0,100%_0,100%_100%,2.5px_100%)] flex flex-col justify-center px-8 sm:px-12 md:pl-[18%] md:pr-12 py-12 md:py-0 z-20">
            
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-serif text-[#333] mb-5 uppercase tracking-wide leading-tight">
              {name}
            </h1>
            
            <div className="mb-6">
              <h3 className="text-[10px] md:text-[11px] font-bold text-black uppercase tracking-widest border-b-[1.5px] border-black pb-0.5 inline-block mb-3">
                Description
              </h3>
              <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed max-w-sm">
                {description}
              </p>
            </div>

            <div className="mb-6 text-xl md:text-2xl font-bold text-black tracking-tight">
              {price}
            </div>

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