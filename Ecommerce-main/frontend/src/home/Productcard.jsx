
import React, { useState, useEffect } from 'react';
import {
  Heart, Eye, ShoppingCart, X, ShieldCheck, Star, Award
} from 'lucide-react';
// AOS import removed for strictly React code preview environment compatibility
// If using locally, you can uncomment AOS initialization

/**
 * MOCK DATA
 */
const trendingProducts = [
  {
    id: 1,
    brand: "Marshall",
    name: "Stanmore III Bluetooth",
    price: 41999,
    originalPrice: 49999,
    discount: "16% off",
    rating: 4.8,
    ratingCount: "2,450",
    description: "Experience the legend with Stanmore III. Re-engineered for a wider soundstage, delivering home-filling Marshall signature sound with a more immersive experience.",
    image: "https://images.unsplash.com/photo-1621255556209-6617342fbdb1?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=600",
    tag: "Bestseller",
    colors: [
      { code: "#1a1a1a", img: "https://images.unsplash.com/photo-1621255556209-6617342fbdb1?auto=format&fit=crop&q=80&w=600" },
      { code: "#e5d1b1", img: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=600" },
      { code: "#4a3728", img: "https://images.unsplash.com/photo-1464375117522-1314d6c469e1?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    id: 2,
    brand: "Devialet",
    name: "Phantom I 108 dB",
    price: 288000,
    originalPrice: 320000,
    discount: "10% off",
    rating: 4.9,
    ratingCount: "842",
    description: "The ultimate connected speaker. Hear every detail brought to life with unthinkable clarity by a Grade I Titanium tweeter. Ultra-deep bass in its purest form.",
    image: "https://images.unsplash.com/photo-1529669649931-e404b9015c7a?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1611078716301-447a19557457?auto=format&fit=crop&q=80&w=600",
    tag: "Iconic",
    colors: [
      { code: "#ffffff", img: "https://images.unsplash.com/photo-1529669649931-e404b9015c7a?auto=format&fit=crop&q=80&w=600" },
      { code: "#222222", img: "https://images.unsplash.com/photo-1611078716301-447a19557457?auto=format&fit=crop&q=80&w=600" },
      { code: "#d4af37", img: "https://images.unsplash.com/photo-1589003071595-1514438d9562?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    id: 3,
    brand: "Dyson",
    name: "Airwrap™ Multi-styler",
    price: 45908,
    originalPrice: 49900,
    discount: "8% off",
    rating: 4.7,
    ratingCount: "5,120",
    description: "Dry. Curl. Shape. Smooth and hide flyaways. With no extreme heat. Re-engineered attachments harness Enhanced Coanda airflow to create your styles.",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=600",
    tag: "New",
    colors: [
      { code: "#ffffff", img: "https://images.unsplash.com/photo-1529669649931-e404b9015c7a?auto=format&fit=crop&q=80&w=600" },
      { code: "#222222", img: "https://images.unsplash.com/photo-1611078716301-447a19557457?auto=format&fit=crop&q=80&w=600" },
      { code: "#d4af37", img: "https://images.unsplash.com/photo-1589003071595-1514438d9562?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    id: 4,
    brand: "Withings",
    name: "ScanWatch Horizon",
    price: 50399,
    originalPrice: 59999,
    discount: "16% off",
    rating: 4.6,
    ratingCount: "324",
    description: "The world's most advanced health-tracking hybrid smartwatch. Features a rotating bezel, stainless steel case, and sapphire glass.",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    tag: "",
    colors: [
      { code: "#122836", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600" },
      { code: "#2d5a27", img: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600" },
      { code: "#e0e0e0", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    id: 5,
    brand: "Sony",
    name: "WH-1000XM5 Headphones",
    price: 29990,
    originalPrice: 34990,
    discount: "14% off",
    rating: 4.8,
    ratingCount: "3,120",
    description: "Industry leading noise cancelling wireless headphones with premium sound quality.",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=600",
    tag: "Popular",
    colors: [
      { code: "#000000", img: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&q=80&w=600" },
      { code: "#e5e5e5", img: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=600" }
    ]
  },
  {
    id: 6,
    brand: "Canon",
    name: "EOS Mirrorless Camera",
    price: 79999,
    originalPrice: 89999,
    discount: "11% off",
    rating: 4.8,
    ratingCount: "1,420",
    description: "Professional mirrorless camera with 4K video recording and fast autofocus.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=600",
    tag: "Pro",
    colors: [
      { code: "#000000", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600" }
    ]
  }
];

const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

const getSafeImage = (url) => {
  if (!url || typeof url !== 'string') return DEFAULT_IMG;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return DEFAULT_IMG;
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/* * QUICK VIEW MODAL
 * (From your first code block with the detailed UI)
 */
const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 ">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row gap-10 animate-[fadeIn_0.3s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 bg-[#f9f9f9] p-8 md:p-12 flex items-center justify-center">
          <img
            src={getSafeImage(product.image)}
            alt={product.name}
            className="w-full h-auto max-h-[300px] object-contain mix-blend-multiply transition-all duration-500 hover:scale-105"
            onError={(e) => { e.currentTarget.src = DEFAULT_IMG }}
          />
        </div>

        {/* Text Details Area - Mobile mein centered, md (laptop) mein left */}
        <div className="w-full md:w-1/2 p-8 md:p-14 md:pl-20 flex flex-col justify-center items-center text-center md:items-start md:text-left">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-[#d3b574] mb-3">
            {product.brand}
          </p>
          <h2 className="text-4xl font-serif italic text-black mb-4 leading-snug">
            {product.name}
          </h2>

          <div className="flex justify-center md:justify-start gap-1 mb-4 w-full">
            <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-[12px] font-bold">
              {product.rating}
              <Star className="w-3 h-3 ml-1 fill-white" />
            </div>
            <span className="text-[12px] text-gray-400 font-bold uppercase tracking-widest ml-2 flex items-center">
              ({product.ratingCount} Ratings)
            </span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 mb-6 flex-wrap w-full">
            <span className="text-2xl font-extrabold text-black">
              {formatPrice(product.price)}
            </span>
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-lg font-bold text-green-600">
              {product.discount}
            </span>
          </div>

          <p className="text-[12px] text-gray-500 leading-relaxed mb-10 font-medium">
            {product.description}
          </p>

          <div className="w-full pb-6 mt-4 flex flex-col items-center md:items-start">
            <button className="group relative w-full max-w-[220px] h-12 rounded-full bg-black px-6 text-[10px] align-baseline font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#d3b574] hover:text-black shadow-lg active:scale-95 mb-10">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add To Bag</span>
              </span>
            </button>

            <div className="flex flex-row justify-center md:justify-start gap-5 md:gap-9 pt-8 border-t border-gray-200 w-full">
              <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-700 ">
                <ShieldCheck className="w-4 h-4 mr-2 text-green-700" />
                100% Genuine
              </div>
              <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-700 ">
                <Award className="w-4 h-4 mr-2 text-blue-800" />
                2 Year Warranty
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* * PRODUCT CARD
 * (From your second code block with the specific layout and sizes)
 */
const ProductCard = ({ product, onQuickView }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].code);

  const handleColorInteraction = (colorObj) => {
    setSelectedColor(colorObj.code);
  };

  const currentColorImg = getSafeImage(
    product.colors.find(c => c.code === selectedColor)?.img || product.image
  );
  const hoverImg = getSafeImage(product.hoverImage);

  return (
    <div 
      data-aos="fade-up"
      data-aos-delay={(product.id % 4) * 100}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg w-full h-full"
    >
      <div
        className="relative h-[420px] bg-gray-100 overflow-hidden rounded-2xl cursor-pointer"
        onClick={() => onQuickView({ ...product, image: currentColorImg })}
      >
        {product.tag && (
          <div className="absolute top-4 left-4 z-30 bg-black text-white px-2.5 py-1 rounded-sm shadow-xl">
            <p className="text-[7px] font-black uppercase tracking-[0.2em]">{product.tag}</p>
          </div>
        )}

        <div className="absolute inset-0 w-full h-full p-6 transition-transform duration-1000 group-hover:scale-105">
          <div className="relative w-full h-full">
            <img
              src={currentColorImg}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain max-h-[300px] mix-blend-multiply transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
              onError={(e) => { e.currentTarget.src = DEFAULT_IMG }}
            />
            <img
              src={hoverImg}
              alt={`${product.name} hover`}
              className="absolute inset-0 w-full h-full object-contain max-h-[300px] mix-blend-multiply transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
              onError={(e) => { e.currentTarget.src = DEFAULT_IMG }}
            />
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-50">
          <button
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl translate-x-0 opacity-100 lg:translate-x-16 lg:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 hover:bg-black hover:text-white"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView({ ...product, image: currentColorImg }); }}
            className="pointer-events-auto w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl translate-x-0 opacity-100 lg:translate-x-16 lg:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 hover:bg-black hover:text-white"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 w-full h-11 bg-black flex items-center justify-center space-x-3 text-white translate-y-0 lg:translate-y-full group-hover:translate-y-0 transition-all duration-500 z-50 hover:bg-[#d3b574] hover:text-black"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add To Cart</span>
        </button>
      </div>

      <div className="p-5 bg-white text-center flex flex-col items-center">
        <div className="flex justify-center gap-1 mb-4">
          {product.colors.map((c, i) => (
            <button
              key={i}
              onClick={() => handleColorInteraction(c)}
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${selectedColor === c.code ? 'scale-125 border-black shadow-md' : 'border-transparent scale-100'}`}
              style={{ backgroundColor: c.code }}
            ></button>
          ))}
        </div>

        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#cbb17b] mb-1">
          {product.brand}
        </p>
        <h4 className="text-[14px] font-medium text-black mb-2 group-hover:text-[#d3b574] transition-colors truncate px-2">
          {product.name}
        </h4>

        <div className="flex items-center justify-center gap-3">
          <span className="text-[14px] font-black tracking-tight text-black">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="text-[11px] font-bold text-green-600">
            {product.discount}
          </span>
        </div>
      </div>
    </div>
  );
};


/*
 * MAIN APP COMPONENT
 */
export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Initialize AOS aur load CDN dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/aos@next/dist/aos.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/aos@next/dist/aos.js';
    script.onload = () => {
      // Changed window.AOS to window['AOS'] to bypass TypeScript strict checking
      if (window['AOS']) {
        window['AOS'].init({
          duration: 1200,
          easing: "ease-out-cubic",
          once: false,
          offset: 120,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // Background scroll disable jab modal open ho
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedProduct]);

  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Playfair+Display:ital,wght@1,500&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />

    <section className="bg-white font-sans selection:bg-[#d3b574] selection:text-black overflow-hidden">
  <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-20"> {/* <-- pt-24 ko pt-[120px] kar diya */}
    <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-6 md:space-y-0">
            <div className="text-left">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-[1px] bg-[#d3b574]"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#d3b574]">Exclusively Curated</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-black leading-tight">
                Trending <span className="text-gray-300">Now</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-stretch mt-[100px] gap-6">
            {trendingProducts.map((product) => (
              <div key={product.id} className="w-[340px]">
                <ProductCard product={product} onQuickView={setSelectedProduct} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL RENDER */}
      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
