import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, X, ShieldCheck, Star, Award } from 'lucide-react';

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
  return DEFAULT_IMG;
};

/* --- QUICK VIEW MODAL --- */
const QuickViewModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row gap-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 bg-[#f9f9f9] p-8 flex items-center justify-center">
          <img src={getSafeImage(product)} alt={product.name} className="w-full h-auto max-h-[300px] object-contain mix-blend-multiply" />
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
        </div>
      </div>
    </div>
  );
};

/* --- PRODUCT CARD --- */
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

/* --- EXPORTED GRID COMPONENT --- */
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
