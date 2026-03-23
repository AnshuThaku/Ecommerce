import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  // Slider ko scroll karne ke liye ref
  const sliderRef = useRef(null);

  // Left scroll karne ka function (Ek baar mein 2 items scroll honge: 176px * 2 = 352px)
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -352, behavior: 'smooth' });
    }
  };

  // Right scroll karne ka function (Ek baar mein 2 items scroll honge)
  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 352, behavior: 'smooth' });
    }
  };

  // Yeh aapka data hai. Yahan aap apni images aur naam change kar sakti hain.
  const products = [
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
    // Upar aur niche ki padding ko barabar (50px) kar diya gaya hai
    <div style={{ paddingTop: '50px', paddingBottom: '50px', backgroundColor: '#ffffff', width: '100%' }}>
      
      {/* Main Slider Container - Width thodi badha di hai (maxWidth: 1350px, width: 98%) aur center mein rakha hai */}
      <div 
        style={{ 
          maxWidth: '1350px', 
          width: '98%', 
          margin: '0 auto', 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
      >
        
        {/* Left Arrow Button */}
        <button 
          onClick={slideLeft} 
          style={{ position: 'absolute', left: 0, zIndex: 10, height: '100%', width: '40px', backgroundColor: 'rgba(229, 231, 235, 0.6)', borderRight: '1px solid #d1d5db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Pichla dekhein"
        >
          <ChevronLeft style={{ width: '24px', height: '24px', color: '#374151' }} />
        </button>

        {/* Scrollable Area - overflowX: 'hidden' lagaya hai taaki bina arrow ke scroll na ho */}
        <div 
          ref={sliderRef} 
          className="flex scroll-smooth w-full"
          style={{ overflowX: 'hidden', paddingLeft: '40px', paddingRight: '40px' }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 bg-white flex flex-col items-center justify-start transition-transform hover:shadow-md cursor-pointer"
              style={{ width: '176px', padding: '16px', borderRight: '1px solid #e5e7eb' }}
            >
              {/* Product Title */}
              <h3 
                style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', textAlign: 'center', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {product.name}
              </h3>
              
              {/* Image Container */}
              <div style={{ width: '112px', height: '112px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button 
          onClick={slideRight} 
          style={{ position: 'absolute', right: 0, zIndex: 10, height: '100%', width: '40px', backgroundColor: 'rgba(229, 231, 235, 0.6)', borderLeft: '1px solid #d1d5db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Agla dekhein"
        >
          <ChevronRight style={{ width: '24px', height: '24px', color: '#374151' }} />
        </button>

      </div>
    </div>
  );
}