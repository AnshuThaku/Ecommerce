
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, X, ShieldCheck, Star, Award, ChevronDown, ChevronUp } from 'lucide-react';

// Formatting Helpers
const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// 👇 SEO URL GENERATOR 👇
const createProductUrl = (p) => {
  const cat = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'luxury';
  const brand = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'exclusive';
  const name = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product';
  return `/${cat}/${brand}/${name}/p/${p._id}`;
};

const getSafeImage = (product) => {
  if (product.variants?.[0]?.images?.[0]?.url) return product.variants[0].images[0].url;
  if (product.images?.[0]?.url) return product.images[0].url;
  return product.image || DEFAULT_IMG;
};

// Helper function to get all available images for the carousel
const getAllImages = (product) => {
  let images = [];
  if (product.variants?.[0]?.images?.length > 0) {
    images = product.variants[0].images.map(img => img.url);
  } else if (product.images?.length > 0) {
    images = product.images.map(img => img.url);
  } else if (product.image) {
    images = [product.image];
    if (product.hoverImage) images.push(product.hoverImage);
    if (product.colors) images.push(...product.colors.map(c => c.img));
  }
  // Remove duplicates
  images = [...new Set(images.filter(Boolean))];
  return images.length > 0 ? images : [DEFAULT_IMG];
};

/* --- QUICK VIEW MODAL (WITH SCROLL/EXPAND LOGIC) --- */
const QuickViewModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const modalRef = useRef(null);
  const touchStartY = useRef(0);

  const images = getAllImages(product);

  // Auto-slide images logic
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // changes every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  if (!product) return null;

  // Scroll logic for expanding the modal
  const handleScrollAndSwipe = (deltaY) => {
    const scrollTop = modalRef.current?.scrollTop || 0;
    if (!expand && deltaY > 15) {
      setExpand(true);
      setTimeout(() => modalRef.current?.scrollBy({ top: 300, behavior: 'smooth' }), 100);
    } else if (expand && scrollTop <= 10 && deltaY < -15) {
      setExpand(false);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    let endY = e.changedTouches[0].clientY;
    let diffY = touchStartY.current - endY;
    handleScrollAndSwipe(diffY);
  };

  const handleWheel = (e) => {
    handleScrollAndSwipe(e.deltaY);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${expand ? 'p-0' : 'px-4'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      {/* Dynamic Modal Container based on `expand` state */}
      <div 
        ref={modalRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative bg-white overflow-y-auto shadow-2xl flex flex-col transition-all duration-700 ease-in-out scroll-smooth ${
          expand ? 'w-full h-full rounded-none' : 'w-full max-w-4xl max-h-[90vh] rounded-3xl'
        }`}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all z-10">
          <X className="w-5 h-5" />
        </button>

        {/* --- TOP SECTION (Your Original Design) --- */}
        <div className="flex flex-col md:flex-row w-full shrink-0 gap-10">
          
          <div className="relative md:w-1/2 bg-[#f9f9f9] p-8 flex flex-col items-center justify-center">
            <img src={images[imageIndex]} alt={product.name} className="w-full h-auto max-h-[300px] object-contain mix-blend-multiply transition-all duration-700 hover:scale-105" />
            
            {/* Image Dots for Carousel */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-8 absolute bottom-6 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setImageIndex(idx); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${imageIndex === idx ? 'w-5 bg-black' : 'w-1.5 bg-gray-300'}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center items-center text-center md:items-start md:text-left">
            <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-[#d3b574] mb-3">{product.brand}</p>
            <h2 className="text-4xl font-serif italic text-black mb-4">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-extrabold text-black">{formatPrice(product.price - (product.discountPrice || 0))}</span>
              {product.discountPrice > 0 && <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>}
            </div>

            <button 
              onClick={() => navigate(createProductUrl(product))}
              className="w-full max-w-[220px] h-12 rounded-full bg-black text-white font-black uppercase tracking-[0.2em] hover:bg-[#d3b574] hover:text-black transition-all shadow-lg mb-10"
            >
              View Details
            </button>

            <div className="flex gap-5 pt-8 border-t border-gray-200 w-full">
              <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-700">
                <ShieldCheck className="w-4 h-4 mr-2 text-green-700" /> 100% Genuine
              </div>
              <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-700">
                <Award className="w-4 h-4 mr-2 text-blue-800" /> Warranty
              </div>
            </div>

            {/* Scroll/Expand Hint */}
            {!expand && (
              <div 
                className="w-full pt-8 flex items-center justify-center md:justify-start gap-2 cursor-pointer group"
                onClick={() => {
                  setExpand(true);
                  setTimeout(() => modalRef.current?.scrollBy({ top: 300, behavior: 'smooth' }), 50);
                }}
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 group-hover:text-[#d3b574] transition-colors">Scroll for details</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#d3b574] animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* --- EXPANDED DETAILS AREA (Visible only on Scroll/Click) --- */}
        <div className={`w-full transition-all duration-700 ease-in-out ${expand ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="p-8 md:p-14 md:pt-10 border-t border-gray-100 bg-white">
            <h3 className="text-2xl md:text-3xl font-serif italic text-black mb-6">Product Overview</h3>
            <div className="text-[15px] text-gray-600 leading-loose font-medium text-center md:text-left space-y-4">
              <p>
                {product.description || product.details?.story || "This exclusive piece embodies the perfect blend of modern innovation and timeless craftsmanship. Discover the exceptional details, premium materials, and unparalleled design that make this product truly unique and essential for your collection."}
              </p>
              <p>
                Designed with precision and engineered for excellence, this piece seamlessly integrates into your daily life. Every contour and material choice has been meticulously curated to ensure both aesthetic brilliance and long-lasting durability. 
              </p>
              <p>
                Whether you are looking for unmatched performance or a statement of elegance, this product delivers on all fronts. Experience the perfect harmony of form, function, and cutting-edge technology.
              </p>
            </div>

            {/* Close Overview Button */}
            <div 
              className="w-full flex flex-col items-center justify-center pt-16 pb-4 text-gray-400 hover:text-black cursor-pointer transition-all" 
              onClick={() => { 
                modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); 
                setTimeout(() => setExpand(false), 400); 
              }}
            >
              <ChevronUp className="w-6 h-6 mb-2 animate-bounce" />
              <p className="text-[10px] uppercase tracking-[0.3em] font-black">Close Overview</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* --- PRODUCT CARD (Original) --- */
const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const productUrl = createProductUrl(product);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg w-full h-full">
      <div className="relative h-[420px] bg-gray-100 overflow-hidden rounded-2xl cursor-pointer" onClick={() => navigate(productUrl)}>
        <div className="absolute inset-0 w-full h-full p-6 transition-transform duration-1000 group-hover:scale-105">
          <img src={getSafeImage(product)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-50">
          <button className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all">
            <Heart className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all">
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        <button className="absolute bottom-0 left-0 w-full h-11 bg-black flex items-center justify-center space-x-3 text-white lg:translate-y-full group-hover:translate-y-0 transition-all duration-500 z-50 hover:bg-[#d3b574] hover:text-black">
          <ShoppingCart className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add To Cart</span>
        </button>
      </div>

      <div className="p-5 bg-white text-center flex flex-col items-center">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#cbb17b] mb-1">{product.brand || product.category}</p>
        <h4 className="text-[14px] font-medium text-black mb-2 group-hover:text-[#d3b574] transition-colors truncate px-2 w-full">{product.name}</h4>
        <div className="flex items-center justify-center gap-3">
          <span className="text-[14px] font-black text-black">{formatPrice(product.price - (product.discountPrice || 0))}</span>
          {product.discountPrice > 0 && <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.price)}</span>}
        </div>
      </div>
    </div>
  );
};

/* --- EXPORTED GRID COMPONENT (Original) --- */
export default function ProductGrid({ title, subtitle, products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white font-sans selection:bg-[#d3b574] selection:text-black overflow-hidden py-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="text-left">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-[1px] bg-[#d3b574]"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#d3b574]">Exclusively Curated</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif italic text-black leading-tight">
              {title} <span className="text-gray-300">{subtitle}</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product) => (
            <div key={product._id} className="w-[340px]">
              <ProductCard product={product} onQuickView={setSelectedProduct} />
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}