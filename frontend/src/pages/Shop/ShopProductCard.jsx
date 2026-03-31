import React from 'react';
import { Heart, Eye, Zap } from 'lucide-react';

export default function ShopProductCard({ product, onQuickView }) {
  if (!product) return null;

  const isDealActive = product?.flashDeal?.isActive && new Date(product.flashDeal.endTime).getTime() > Date.now();
  const displayPrice = isDealActive ? product?.flashDeal?.dealPrice : (product?.price - (product?.discountPrice || 0));
  
  const discountPercentage = product?.price && product.price > 0 && product?.discountPrice 
    ? Math.round((product.discountPrice / product.price) * 100) 
    : 0;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 w-full cursor-pointer border border-transparent h-[380px] xl:h-[460px]"
      style={{ borderColor: isDealActive ? 'var(--theme-primary)' : 'transparent' }}
      onClick={() => onQuickView(product)}
    >
      {/* ── Image Section ── */}
      <div 
        className="relative h-[300px] xl:h-[340px] w-full overflow-hidden transition-colors duration-700 shrink-0 flex items-center justify-center p-6"
        style={{ backgroundColor: 'var(--theme-bg-light)' }}
      >
        {/* Brand Pill */}
        <div className="absolute top-5 right-5 z-20">
           <p 
            className="text-[10px] uppercase tracking-widest font-bold bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm"
            style={{ color: 'var(--theme-text-main)' }}
           >
             {product?.brand || product?.category || 'Exclusive'}
           </p>
        </div>

        {/* Flash Deal Badge */}
        {isDealActive && (
          <div 
            className="absolute top-5 left-5 z-20 text-white text-[10px] font-bold px-3 py-1.5 flex items-center gap-1 uppercase rounded-full shadow-lg"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            <Zap className="w-3 h-3 fill-current" /> Deal
          </div>
        )}

        {/* Product Image */}
        <img 
          src={product?.variants?.[0]?.images?.[0]?.url || product?.images?.[0]?.url || 'https://placehold.co/400x400/f9f9f9/C8A253?text=No+Image'} 
          alt={product?.name} 
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
        />

        {/* Hover Actions (Heart & Eye) */}
        <div className="absolute right-5 bottom-5 flex flex-col gap-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-x-4 group-hover:translate-x-0">
          <button 
            onClick={(e) => { e.stopPropagation(); /* Wishlist Logic */ }} 
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" 
            style={{ color: 'var(--theme-primary)' }}
          >
            <Heart size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }} 
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" 
            style={{ color: 'var(--theme-primary)' }}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* ── Text Info Section ── */}
      <div className="p-6 text-center flex flex-col items-center flex-grow bg-white z-20">
        
        <h4 
          className="text-[15px] font-bold mb-3 transition-colors duration-300 line-clamp-2 w-full px-2"
          style={{ color: 'var(--theme-text-main)', minHeight: '44px' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--theme-primary)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--theme-text-main)'}
        >
          {product?.name}
        </h4>

        <div className="flex flex-col items-center gap-1.5 mt-auto w-full">
          <div className="flex items-center justify-center gap-3">
            {discountPercentage > 0 && !isDealActive && (
              <span className="text-xl font-black" style={{ color: 'var(--theme-primary)' }}>
                -{discountPercentage}%
              </span>
            )}
            <span 
              className={`text-2xl font-black ${isDealActive ? 'text-red-600' : ''}`} 
              style={{ color: isDealActive ? '' : 'var(--theme-text-main)' }}
            >
              ₹{displayPrice?.toLocaleString('en-IN')}
            </span>
          </div>
          
          {(product?.discountPrice > 0 || isDealActive) && (
              <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mt-1">
                M.R.P.: <span className="line-through">₹{product?.price?.toLocaleString('en-IN')}</span>
              </div>
          )}
        </div>
      </div>
      
    </div>
  );
}