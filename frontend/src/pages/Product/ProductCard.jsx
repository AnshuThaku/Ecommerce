// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Star, Zap, Clock } from 'lucide-react';
// import { axiosInstance } from '../utils/axiosInstance'; 

const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

const formatPrice = (amount) => {
  if (!amount) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const getAllImages = (product) => {
  if (!product) return [DEFAULT_IMG];
  let images = [];
  if (product.images?.length > 0) images.push(...product.images.map(img => img.url));
  else if (product.image) {
    images.push(product.image);
    if (product.hoverImage) images.push(product.hoverImage);
  }
  if (product.variants?.length > 0) {
    product.variants.forEach(variant => {
      if (variant.images?.length > 0) images.push(...variant.images.map(img => img.url));
    });
  }
  images = [...new Set(images.filter(Boolean))];
  return images.length > 0 ? images : [DEFAULT_IMG];
};

export default function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDealActive, setIsDealActive] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const cardImages = getAllImages(product);

  // Yeh useEffect images ko har 3 second mein change karta hai.
  // Animation (ease-in) ispar ProductGrid.jsx ki CSS se apply ho raha hai (.animate-card-fade-in)
  useEffect(() => {
    let interval;
    if (cardImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % cardImages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [cardImages.length]);

  useEffect(() => {
    if (product.flashDeal?.isActive && product.flashDeal?.endTime) {
      const updateTimer = () => {
        const distance = new Date(product.flashDeal.endTime).getTime() - Date.now();
        if (distance > 0) {
          setIsDealActive(true);
          setTimeLeft({
            hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((distance / 1000 / 60) % 60),
            seconds: Math.floor((distance / 1000) % 60)
          });
        } else {
          setIsDealActive(false);
        }
      };
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [product]);

  const displayPrice = isDealActive ? product.flashDeal.dealPrice : product.price - (product.discountPrice || 0);

  return (
    <div
      data-aos="fade-up"
      onClick={() => onQuickView(product)}
      /* ⚡ UPDATED SHADOW:
         - shadow-[0_8px_30px_rgba(0,0,0,0.12)] pehle se dark aur tight.
         - hover par shadow slightly change hota hai depth ke liye. ⚡ */
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 w-full h-full cursor-pointer 
        ${isDealActive ? 'border border-red-500/20' : ''}`}
    >
      <div className="relative h-[350px] sm:h-[320px] bg-gray-100 overflow-hidden rounded-2xl cursor-pointer w-full">
        {isDealActive && (
          <div className="absolute top-4 left-4 z-50 bg-red-600 text-white text-[9px] font-black px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl">
            <Zap className="w-3 h-3 fill-current" /> Lightning Deal
          </div>
        )}

        <div className="absolute inset-0 w-full h-full p-4 sm:p-6 transition-transform duration-1000 group-hover:scale-105">
          {/* ⚡ IMAGE ANIMATION: 
            Ye className="animate-card-fade-in" us ease-in animation ko trigger karta hai.
            Iski definition ProductGrid.jsx ke 'injectAOSStyles' function ke andar hai.
          */}
          <img 
            key={currentImgIndex} 
            src={cardImages[currentImgIndex]} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply animate-card-fade-in" 
          />
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all">
            <Heart className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all">
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={async (e) => {
            e.stopPropagation();
            // cart logic
          }}
          className={`absolute bottom-0 left-0 w-full h-11 flex items-center justify-center space-x-3 text-white lg:translate-y-full group-hover:translate-y-0 transition-all duration-500 z-50 ${isDealActive ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-[#d3b574] hover:text-black'}`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            {isDealActive ? 'Claim Deal' : 'Add To Cart'}
          </span>
        </button>
      </div>

      <div className="p-4 sm:p-5 bg-white text-center flex flex-col items-center">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#cbb17b] mb-1">{product.brand || product.category}</p>
        <h4 className="text-[13px] sm:text-[14px] font-medium text-black mb-2 group-hover:text-[#d3b574] transition-colors truncate px-2 w-full">{product.name}</h4>

        <div className="flex flex-col items-center justify-center gap-1 w-full mt-1">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className={`text-[13px] sm:text-[14px] font-black ${isDealActive ? 'text-red-600' : 'text-black'}`}>{formatPrice(displayPrice)}</span>
            {(product.discountPrice > 0 || isDealActive) && <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">{formatPrice(product.price)}</span>}
          </div>
          {isDealActive && timeLeft && (
            <div className="text-red-500 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              <Clock className="w-3 h-3" /> Ends in {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}