import React from 'react';

export default function ShopProductCard({ product, onQuickView }) {
  if (!product) return null;

  // ── Pricing & Discount Logic ──
  const isDealActive = product?.flashDeal?.isActive && new Date(product.flashDeal.endTime).getTime() > Date.now();
  const originalPrice = product.price || 0;
  const finalPrice = isDealActive ? product.flashDeal.dealPrice : originalPrice - (product.discountPrice || 0);
  
  const hasDiscount = originalPrice > finalPrice && originalPrice > 0;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

  // ── Stock Logic ──
  const isOutOfStock = product.stock <= 0 && (!product.variants || !product.variants.some(v => v.stock > 0));

  // ── Image Getter ──
  const getProductImg = (p) => {
    if (p?.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
    if (p?.images?.[0]?.url) return p.images[0].url;
    return 'https://placehold.co/400x400/f5f5f5/cccccc?text=No+Image'; 
  };

  // ── Price Formatter (No Decimals) ──
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(price);
  };

  const imgSrc = getProductImg(product);

  return (
    <div
      // ⚡ FIX: Changed text-left to text-center, added items-center for flex alignment
      className="w-full flex flex-col items-center group cursor-pointer text-center mb-6"
      onClick={() => onQuickView(product)}
    >
      {/* 1. Image Container (Centering logic within remains same) */}
      <div className="w-full aspect-square bg-[#f8f8f8] flex items-center justify-center mb-3.5 relative overflow-hidden rounded-sm">
        
        {/* Badges (Absolute positioning stays relative to image box) */}
        {isOutOfStock ? (
          <span className="absolute top-2.5 left-2.5 bg-[#e42222] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10 tracking-wide">
            Sold out
          </span>
        ) : hasDiscount ? (
          <span className="absolute top-2.5 left-2.5 bg-[#3a8b76] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10 tracking-wide">
            Save {discountPercent}%
          </span>
        ) : null}

        <img
          src={imgSrc}
          alt={product?.name}
          // Image centering inherited from parent flex
          className={`max-w-[85%] max-h-[85%] object-contain transition-transform duration-700 mix-blend-multiply ${!isOutOfStock ? 'group-hover:scale-105' : 'opacity-70'}`}
        />
      </div>

      {/* 2. Price Section */}
      <div className="flex items-center justify-center gap-2 mb-1.5 w-full">
        <span className={`text-[13px] font-bold ${hasDiscount ? 'text-[#3a8b76]' : 'text-[#333]'}`}>
          {formatPrice(finalPrice)}
        </span>
        
        {hasDiscount && (
          <span className="text-[12px] font-medium text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {/* 3. Title Section */}
      {/* ⚡ Inherits text-center from outermost div */}
      <h3 className="text-[13px] font-medium text-[#111] leading-snug line-clamp-2 px-1">
        {product?.name || 'PRODUCT'}
      </h3>
      
    </div>
  );
}