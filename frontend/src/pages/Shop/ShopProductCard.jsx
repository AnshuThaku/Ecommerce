import React from 'react';

export default function ShopProductCard({ product, onQuickView }) {
  if (!product) return null;

  const isDealActive = product?.flashDeal?.isActive && new Date(product.flashDeal.endTime).getTime() > Date.now();
  const finalPrice = isDealActive ? product.flashDeal.dealPrice : product.price - (product.discountPrice || 0);

  const getProductImg = (p) => {
    if (p?.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
    if (p?.images?.[0]?.url) return p.images[0].url;
    return 'https://placehold.co/400x400/222222/FFFFFF?text=No+Image';
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const imgSrc = getProductImg(product);

  return (
    <div
      className="w-full flex flex-col group cursor-pointer text-left mb-6"
      onClick={() => onQuickView(product)}
    >
      <div className="w-full aspect-square bg-[#242424] flex items-center justify-center mb-4 relative overflow-hidden">
        <img
          src={imgSrc}
          alt={product?.name}
          className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <h3 className="text-[11px] font-bold text-[#111] tracking-[0.05em] uppercase mb-1 truncate font-serif">
        {product?.name || 'PRODUCT'}
      </h3>

      <span className="text-[11px] font-medium text-[#555] tracking-wide">
        {formatPrice(finalPrice)}
      </span>
    </div>
  );
}
