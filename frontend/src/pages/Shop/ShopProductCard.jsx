import React from 'react';
import { Heart, Eye, ShoppingCart, Zap } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

export default function ShopProductCard({ product, onQuickView, showToast }) {
  if (!product) return null;

  const isDealActive = product?.flashDeal?.isActive && new Date(product.flashDeal.endTime).getTime() > Date.now();
  const displayPrice = isDealActive ? product?.flashDeal?.dealPrice : (product?.price - (product?.discountPrice || 0));

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await axiosInstance.post('/cart/add', { productId: product?._id, quantity: 1 });
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { increase: 1 } }));
      showToast('success', 'Added to Luxury Cart');
    } catch (err) {
      showToast('error', 'Please login first');
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-200 cursor-pointer w-full"
      style={{ height: '360px' }}
      onClick={() => onQuickView(product)}
    >
      <div className="relative bg-[#f5f5f5] overflow-hidden flex items-center justify-center" style={{ height: '220px', minHeight: '220px' }}>
        
        {isDealActive && (
          <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[8px] font-black px-2 py-[3px] uppercase tracking-widest rounded-sm flex items-center gap-1">
            <Zap size={9} fill="currentColor" /> Flash Deal
          </div>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--theme-primary)] transition-colors"
          >
            <Eye size={14} />
          </button>
        </div>

        <img
          src={product?.variants?.[0]?.images?.[0]?.url || product?.images?.[0]?.url}
          alt={product?.name}
          className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          style={{ maxHeight: '180px', maxWidth: '80%' }}
        />

        {/* ⚡ Added Dynamic Color Vars For Hover Add To Cart */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 w-full h-10 bg-[var(--theme-primary)] backdrop-blur-sm text-[var(--theme-bg-dark)] text-[10px] font-black uppercase tracking-[0.18em] translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 z-30 hover:bg-[var(--theme-bg-dark)] hover:text-[var(--theme-primary)]"
        >
          <ShoppingCart size={13} /> Add To Cart
        </button>
      </div>

      <div className="flex flex-col flex-1 px-3 py-3 bg-white">
        <p className="text-[9px] font-bold text-[var(--theme-primary)] uppercase tracking-[0.25em] mb-1 truncate">
          {product?.brand || 'Exclusive'}
        </p>

        <h4 className="text-[12.5px] font-medium text-[var(--theme-bg-dark)] leading-snug mb-2 line-clamp-2" style={{ minHeight: '36px' }}>
          {product?.name}
        </h4>

        <div className="mt-auto flex items-baseline gap-2">
          <span className={`text-[17px] font-extrabold leading-none ${isDealActive ? 'text-red-600' : 'text-[var(--theme-bg-dark)]'}`}>
            ₹{displayPrice?.toLocaleString('en-IN')}
          </span>
          {(product?.discountPrice > 0 || isDealActive) && (
            <span className="text-[11px] text-gray-400 line-through">
              ₹{product?.price?.toLocaleString('en-IN')}
            </span>
          )}
          {product?.discountPrice > 0 && !isDealActive && (
            <span className="text-[11px] font-semibold text-green-600">
              {Math.round((product.discountPrice / product.price) * 100)}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}