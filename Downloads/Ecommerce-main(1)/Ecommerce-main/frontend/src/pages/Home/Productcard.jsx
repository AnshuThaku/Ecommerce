


// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Heart, Eye, ShoppingCart, X, ShieldCheck, Star, Award, 
//   ChevronDown, ChevronUp, Package, CheckCircle, Truck, RotateCcw 
// } from 'lucide-react';

// // Formatting Helpers
// const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

// const formatPrice = (amount) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0
//   }).format(amount);
// };

// // 👇 SEO URL GENERATOR 👇
// const createProductUrl = (p) => {
//   const cat = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'luxury';
//   const brand = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'exclusive';
//   const name = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product';
//   return `/${cat}/${brand}/${name}/p/${p._id}`;
// };

// const getSafeImage = (product) => {
//   if (product.variants?.[0]?.images?.[0]?.url) return product.variants[0].images[0].url;
//   if (product.images?.[0]?.url) return product.images[0].url;
//   return product.image || DEFAULT_IMG;
// };

// // Helper function to get all available images for the carousel/thumbnails
// const getAllImages = (product) => {
//   let images = [];
//   if (product.variants?.[0]?.images?.length > 0) {
//     images = product.variants[0].images.map(img => img.url);
//   } else if (product.images?.length > 0) {
//     images = product.images.map(img => img.url);
//   } else if (product.image) {
//     images = [product.image];
//     if (product.hoverImage) images.push(product.hoverImage);
//     if (product.colors) images.push(...product.colors.map(c => c.img));
//   }
//   // Remove duplicates
//   images = [...new Set(images.filter(Boolean))];
//   // Ensure we have at least one image
//   return images.length > 0 ? images : [DEFAULT_IMG];
// };


// /* =========================================
//  * QUICK VIEW MODAL (FROM YOUR SECOND CODE)
//  * ========================================= */
// const QuickViewModal = ({ product, onClose }) => {
//   const navigate = useNavigate();
//   const [activeImgIdx, setActiveImgIdx] = useState(0); 
//   const [expand, setExpand] = useState(false);
//   const [showFullTitle, setShowFullTitle] = useState(false);
  
//   const modalRef = useRef(null);
//   const thumbScrollRef = useRef(null); 
//   const touchStartY = useRef(0);

//   if (!product) return null;

//   const galleryImages = getAllImages(product);

//   const handleScrollAndSwipe = (deltaY) => {
//     const scrollTop = modalRef.current?.scrollTop || 0;
    
//     // Scroll down to expand
//     if (!expand && deltaY > 15) {
//       setExpand(true);
//     } 
//     // Scroll up (at top) to collapse
//     else if (expand && scrollTop <= 10 && deltaY < -15) {
//       setExpand(false);
//     }
//   };

//   const handleWheel = (e) => {
//     handleScrollAndSwipe(e.deltaY);
//   };

//   const handleTouchStart = (e) => {
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchEnd = (e) => {
//     let endY = e.changedTouches[0].clientY;
//     let diffY = touchStartY.current - endY;
//     handleScrollAndSwipe(diffY);
//   };

//   // Safe fallback data for the expanded section
//   const story = product.description || product.details?.story || "This exclusive piece embodies the perfect blend of modern innovation and timeless craftsmanship. Discover the exceptional details, premium materials, and unparalleled design that make this product truly unique and essential for your collection.";
//   const highlights = product.details?.highlights || [
//     { icon: <Star className="w-5 h-5" />, title: "Premium Quality", desc: "Crafted with the finest materials." },
//     { icon: <ShieldCheck className="w-5 h-5" />, title: "Durable", desc: "Built to last a lifetime." }
//   ];
//   const specs = product.details?.specs || [
//     { label: "Brand", value: product.brand || "Exclusive" },
//     { label: "Category", value: product.category || "Luxury" }
//   ];
//   const boxItems = product.details?.boxItems || [product.name, "Authenticity Card", "Premium Packaging"];

//   return (
//     <div 
//       className={`fixed inset-0 z-[100] flex transition-all duration-500 ease-in-out ${expand ? 'items-start bg-white p-0' : 'items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-6'}`}
//       onClick={onClose}
//     >
//       <div 
//         id="modalContent"
//         ref={modalRef}
//         onWheel={handleWheel}
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}
//         onClick={(e) => e.stopPropagation()}
//         className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out ${expand ? 'w-full max-w-full h-[100vh] rounded-none shadow-none' : 'w-full max-w-[850px] max-h-[90vh] rounded-[24px] shadow-2xl'}`}
//         style={{ 
//           scrollbarWidth: 'none', 
//           msOverflowStyle: 'none',
//           scrollBehavior: 'smooth',
//           margin: '0 auto'
//         }}
//       >
//         <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        
//         {/* Fixed Close Button */}
//         <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm transition-all z-50 cursor-pointer">
//           <X className="w-5 h-5 text-gray-800" />
//         </button>

//         {/* Max Width Wrapper */}
//         <div 
//           className={`w-full max-w-[850px] mx-auto transition-all duration-500 ease-in-out ${expand ? 'pt-10 md:pt-16 pb-20' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}
//           style={{ margin: '0 auto' }}
//         >
//           <div className="flex flex-col md:flex-row w-full">
//             {/* Left: Image Side (Vertical Layout) */}
//             <div 
//               className="w-full md:w-[50%] bg-white flex flex-row justify-start items-center relative"
//               style={{ padding: '16px', minHeight: '300px' }}
//             >
//               {/* Vertical Thumbnails Sidebar */}
//               <div className="flex flex-col items-center justify-between mr-2 md:mr-4 w-[50px] md:w-[70px] h-[260px] md:h-[320px]" style={{ flexShrink: 0 }}>
//                 {galleryImages.length > 1 && (
//                   <button 
//                     onClick={() => thumbScrollRef.current?.scrollBy({ top: -100, behavior: 'smooth' })}
//                     className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mb-2 bg-white-100 hover:bg-gray-200 text-gray-600 hover:text-black transition-all duration-300 mx-auto"
//                   >
//                     <ChevronUp className="w-5 h-5" />
//                   </button>
//                 )}

//                 <div 
//                   ref={thumbScrollRef}
//                   className="hide-scroll flex flex-col gap-2 md:gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1"
//                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//                 >
//                   {galleryImages.map((imgSrc, idx) => (
//                     <div 
//                       key={idx} 
//                       onMouseEnter={() => setActiveImgIdx(idx)} 
//                       onClick={() => setActiveImgIdx(idx)}      
//                       className={`w-full aspect-square bg-[#f9f9f9] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${activeImgIdx === idx ? 'border-black' : 'border-transparent'}`}
//                       style={{ padding: '4px md:6px', flexShrink: 0 }}
//                     >
//                       <img
//                         src={imgSrc}
//                         alt={`${product.name} Thumbnail ${idx + 1}`}
//                         style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
//                         onError={(e) => { e.currentTarget.src = DEFAULT_IMG }}
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {galleryImages.length > 1 && (
//                   <button 
//                     onClick={() => thumbScrollRef.current?.scrollBy({ top: 100, behavior: 'smooth' })}
//                     className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mt-2 bg-white-100 hover:bg-gray-200 text-gray-600 hover:text-black transition-all duration-300 mx-auto"
//                   >
//                     <ChevronDown className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>

//               {/* Main Large Image */}
//               <div className="flex-1 bg-[#f9f9f9] rounded-xl flex items-center justify-center p-4 md:p-6 relative overflow-hidden hover:shadow-sm h-[260px] md:h-[320px]">
//                  <img
//                     key={activeImgIdx} 
//                     src={galleryImages[activeImgIdx]}
//                     alt={product.name}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'contain',
//                       mixBlendMode: 'multiply',
//                       transition: 'transform 0.5s ease',
//                       maxHeight: '280px', 
//                     }}
//                     className="hover:scale-105"
//                     onError={(e) => { e.currentTarget.src = DEFAULT_IMG }}
//                  />
//               </div>
//             </div>

//             {/* Right: Product Info Side */}
//             <div 
//               className="w-full md:w-[50%] flex flex-col justify-start items-start text-left"
//               style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column' }}
//             >
//               <div className="w-full flex flex-col items-start" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
//                 <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-[#d3b574] mb-2">{product.brand}</p>
                
//                 <h1 className="text-left text-[#212121] font-medium text-[15px] md:text-[20px] mb-2 md:mb-4 leading-snug">
//                   {showFullTitle ? (
//                     <>
//                       {product.name} {product.description ? ` - ${product.description}` : ''}
//                       <button onClick={() => setShowFullTitle(false)} className="text-blue-600 text-[12px] ml-1 font-bold bg-transparent border-none p-0 cursor-pointer">less</button>
//                     </>
//                   ) : (
//                     <>
//                       {product.name}
//                       <button onClick={() => setShowFullTitle(true)} className="text-blue-600 text-[12px] ml-1 font-bold bg-transparent border-none p-0 cursor-pointer">more</button>
//                     </>
//                   )}
//                 </h1>

//                 <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', marginBottom: '12px' }}>
//                   <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '6px', padding: '4px 8px', border: '1px solid #f3f4f6' }}>
//                     <span style={{ color: 'black', fontWeight: 'bold', fontSize: '12px', marginRight: '4px' }}>{product.rating || "4.8"}</span>
//                     <Star style={{ width: '12px', height: '12px', fill: '#10b981', color: '#10b981', marginRight: '8px' }} />
//                     <span style={{ color: '#d1d5db', margin: '0 4px' }}>|</span>
//                     <span style={{ color: '#6b7280', fontSize: '12px', marginLeft: '4px' }}>{product.ratingCount || "1,245"}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-start flex-wrap w-full gap-2 md:gap-3 mb-4 md:mb-6">
//                   <span className="font-black text-black tracking-tight transition-all duration-300" style={{ fontSize: '24px' }}>
//                     {formatPrice(product.price - (product.discountPrice || 0))}
//                   </span>
//                   {product.discountPrice > 0 && (
//                     <span className="text-gray-400 line-through font-medium text-[15px]">
//                       {formatPrice(product.price)}
//                     </span>
//                   )}
//                   {product.discountPrice > 0 && (
//                     <span className="font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md uppercase tracking-widest text-[9px]">
//                       Special Offer
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex justify-start w-full gap-4 mb-2 md:mb-3">
//                   <button 
//                     onClick={() => navigate(createProductUrl(product))}
//                     className="hover:bg-[#d3b574] hover:text-black shadow-lg active:scale-95 transition-all w-full rounded-full bg-black flex items-center justify-center gap-2 font-black uppercase tracking-widest text-white"
//                     style={{ maxWidth: '260px', height: '44px', fontSize: '10px' }}
//                   >
//                     <ShoppingCart style={{ width: '14px', height: '14px' }} />
//                     <span>VIEW DETAILS</span>
//                   </button>
//                 </div>

//                 {!expand && (
//                   <div 
//                     className="group flex items-center justify-start w-full cursor-pointer pt-2 pb-2 md:pt-3 md:pb-3 gap-2 md:gap-3 mt-1 border-t border-transparent"
//                     onClick={() => {
//                       setExpand(true);
//                     }}
//                   >
//                      <Package className="text-[#d3b574] group-hover:scale-110 transition-transform w-[18px] h-[18px]" />
//                      <span className="font-serif italic text-black group-hover:text-[#d3b574] transition-colors text-[16px]">Product Overview</span>
//                      <ChevronDown className="text-gray-300 animate-bounce w-[16px] h-[16px]" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* EXPANDED DETAILS AREA */}
//           <div style={{ 
//             maxHeight: expand ? '5000px' : '0px', 
//             opacity: expand ? 1 : 0, 
//             overflow: 'hidden',
//             pointerEvents: expand ? 'auto' : 'none',
//             transition: 'all 0.5s ease-in-out'
//           }}>
//             <div 
//               className="border-t border-gray-100 bg-white"
//               style={{ padding: "30px 16px md:40px 16px", marginTop: "20px" }}
//             >
//               <div style={{ marginBottom: "40px" }}>
//                  <h3 className="font-serif italic text-black flex items-center justify-center" style={{ gap: "12px", marginBottom: "16px", fontSize: "20px" }}>
//                    <Package className="w-5 h-5 text-[#d3b574]" /> Product Overview
//                  </h3>
//                  <p className="text-gray-600 leading-loose whitespace-pre-line font-medium text-center px-2 md:px-8" style={{ fontSize: "13px" }}>
//                    {story}
//                  </p>
//               </div>

//               <div style={{ marginBottom: "40px" }}>
//                 <h3 className="font-serif italic text-black text-center" style={{ marginBottom: "24px", fontSize: "18px" }}>Key Highlights</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-2 md:px-6" style={{ gap: "20px" }}>
//                   {highlights.map((h, i) => (
//                     <div key={i} className="bg-gray-50 rounded-[20px] border border-gray-100 hover:shadow-md transition-shadow text-center flex flex-col items-center" style={{ padding: "20px" }}>
//                       <div className="bg-white rounded-full inline-block shadow-sm text-[#d3b574]" style={{ padding: "10px", marginBottom: "16px" }}>{h.icon || <Star className="w-5 h-5"/>}</div>
//                       <h4 className="font-black text-black uppercase tracking-wider" style={{ marginBottom: "10px", fontSize: "11px" }}>{h.title}</h4>
//                       <p className="text-gray-500 font-medium" style={{ fontSize: "12px" }}>{h.desc}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 px-2 md:px-6" style={{ gap: "32px", marginBottom: "40px" }}>
//                 <div>
//                   <h3 className="font-serif italic text-black text-center" style={{ marginBottom: "20px", fontSize: "18px" }}>Technical Specs</h3>
//                   <div className="border border-gray-100 rounded-[20px] overflow-hidden">
//                     {specs.map((s, i) => (
//                       <div key={i} className={`flex flex-row ${i !== specs.length - 1 ? 'border-b border-gray-50' : ''}`} style={{ padding: "12px 16px" }}>
//                         <div className="w-[40%] font-black text-gray-500 uppercase tracking-widest text-left" style={{ fontSize: "9px" }}>{s.label}</div>
//                         <div className="w-[60%] text-black font-bold text-left" style={{ fontSize: "11px" }}>{s.value}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-serif italic text-black text-center" style={{ marginBottom: "20px", fontSize: "18px" }}>In The Box</h3>
//                   <div className="bg-indigo-50/50 rounded-[20px] border border-indigo-100/50" style={{ padding: "24px" }}>
//                     <ul className="space-y-4" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//                       {boxItems.map((item, i) => (
//                         <li key={i} className="flex items-center justify-center text-indigo-900 font-bold" style={{ gap: "12px", fontSize: "12px" }}>
//                           <CheckCircle className="w-4 h-4 text-indigo-400" /> {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row bg-[#f9f9f9] rounded-[24px] items-center text-center justify-center px-2 md:px-6" style={{ padding: "24px", gap: "24px" }}>
//                 <div className="flex items-center" style={{ gap: "12px" }}>
//                    <Truck className="w-6 h-6 text-black" />
//                    <div>
//                      <p className="font-black text-black uppercase tracking-widest" style={{ marginBottom: "2px", fontSize: "10px" }}>Free Shipping</p>
//                      <p className="text-gray-500" style={{ fontSize: "11px" }}>Across all orders</p>
//                    </div>
//                 </div>
//                 <div className="flex items-center" style={{ gap: "12px" }}>
//                    <RotateCcw className="w-6 h-6 text-black" />
//                    <div>
//                      <p className="font-black text-black uppercase tracking-widest" style={{ marginBottom: "2px", fontSize: "10px" }}>7 Days Return</p>
//                      <p className="text-gray-500" style={{ fontSize: "11px" }}>No questions asked</p>
//                    </div>
//                 </div>
//               </div>

//               <div 
//                 className="w-full flex flex-col items-center justify-center text-gray-400 hover:text-black cursor-pointer transition-all px-2 md:px-6" 
//                 style={{ paddingTop: "40px", paddingBottom: "16px" }}
//                 onClick={() => { 
//                   if(modalRef.current) {
//                     modalRef.current.scrollTop = 0;
//                   }
//                   setTimeout(() => setExpand(false), 300); 
//                 }}
//               >
//                 <ChevronUp className="w-5 h-5 animate-bounce" style={{ marginBottom: "8px" }} />
//                 <p className="uppercase tracking-[0.3em] font-black" style={{ fontSize: "9px" }}>Close Overview</p>
//               </div>

//             </div>
//           </div>
          
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================
//  * PRODUCT CARD (FROM YOUR FIRST CODE)
//  * ========================================= */
// const ProductCard = ({ product, onQuickView }) => {
//   const navigate = useNavigate();
//   const productUrl = createProductUrl(product);

//   return (
//     <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg w-full h-full">
//       <div className="relative h-[420px] bg-gray-100 overflow-hidden rounded-2xl cursor-pointer" onClick={() => navigate(productUrl)}>
//         <div className="absolute inset-0 w-full h-full p-6 transition-transform duration-1000 group-hover:scale-105">
//           <img src={getSafeImage(product)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
//         </div>

//         <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-50">
//           <button className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all">
//             <Heart className="w-3.5 h-3.5" />
//           </button>
//           <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all">
//             <Eye className="w-3.5 h-3.5" />
//           </button>
//         </div>

//         <button className="absolute bottom-0 left-0 w-full h-11 bg-black flex items-center justify-center space-x-3 text-white lg:translate-y-full group-hover:translate-y-0 transition-all duration-500 z-50 hover:bg-[#d3b574] hover:text-black">
//           <ShoppingCart className="w-4 h-4" />
//           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add To Cart</span>
//         </button>
//       </div>

//       <div className="p-5 bg-white text-center flex flex-col items-center">
//         <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#cbb17b] mb-1">{product.brand || product.category}</p>
//         <h4 className="text-[14px] font-medium text-black mb-2 group-hover:text-[#d3b574] transition-colors truncate px-2 w-full">{product.name}</h4>
//         <div className="flex items-center justify-center gap-3">
//           <span className="text-[14px] font-black text-black">{formatPrice(product.price - (product.discountPrice || 0))}</span>
//           {product.discountPrice > 0 && <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.price)}</span>}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================
//  * EXPORTED GRID COMPONENT (FROM YOUR FIRST CODE)
//  * ========================================= */
// export default function ProductGrid({ title, subtitle, products }) {
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Stop body scrolling when modal is open
//   useEffect(() => {
//     if (selectedProduct) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => { document.body.style.overflow = 'unset'; }
//   }, [selectedProduct]);

//   if (!products || products.length === 0) return null;

//   return (
//     <section className="bg-white font-sans selection:bg-[#d3b574] selection:text-black overflow-hidden py-20">
//       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-12">
//           <div className="text-left">
//             <div className="flex items-center space-x-4 mb-4">
//               <div className="w-10 h-[1px] bg-[#d3b574]"></div>
//               <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#d3b574]">Exclusively Curated</span>
//             </div>
//             <h2 className="text-4xl md:text-5xl font-serif italic text-black leading-tight">
//               {title} <span className="text-gray-300">{subtitle}</span>
//             </h2>
//           </div>
//         </div>

//         <div className="flex flex-wrap justify-center gap-6">
//           {products.map((product) => (
//             <div key={product._id || Math.random()} className="w-[340px]">
//               <ProductCard product={product} onQuickView={setSelectedProduct} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {selectedProduct && (
//         <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
//       )}
//     </section>
//   );
// }



import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star, Award, 
  ChevronDown, ChevronUp, Package, CheckCircle, Truck, RotateCcw, ArrowLeft 
} from 'lucide-react';

// --- LOCAL TEST MOCKS ---
// Jab aap ise apne project me copy karein, toh in 3 lines ko UNCOMMENT kar lein:
// import { useAuth } from '../../context/AuthContext';
// import axiosInstance from '../../utils/axiosInstance';
// import Toast from '../../components/Toast';

// Aur yahan se lekar "MOCKS END" tak ka code HATA dein (ye sirf yahan preview ke liye hai):
const useAuth = () => ({ user: null });
const axiosInstance = {
  post: async (url, data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 1000));
  },
  get: async (url) => {
    return new Promise((resolve) => setTimeout(() => resolve({ 
      data: { success: true, product: null, products: [] } 
    }), 500));
  }
};
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div className="fixed top-5 right-5 z-[999] bg-black text-[#d3b574] border border-[#d3b574] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 transition-all">
      <span className="font-medium text-sm tracking-wide">{toast.message}</span>
      <button onClick={onClose} className="hover:text-white transition-colors"><X className="w-4 h-4" /></button>
    </div>
  );
};
// --- MOCKS END ---

// Formatting Helpers
const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

const formatPrice = (amount) => {
  if (!amount) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// 👇 SEO URL GENERATOR 👇
const createProductUrl = (p) => {
  if (!p) return '#';
  const cat = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'luxury';
  const brand = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'exclusive';
  const name = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product';
  return `/${cat}/${brand}/${name}/p/${p._id}`;
};

const getSafeImage = (product) => {
  if (!product) return DEFAULT_IMG;
  if (product.variants?.[0]?.images?.[0]?.url) return product.variants[0].images[0].url;
  if (product.images?.[0]?.url) return product.images[0].url;
  return product.image || DEFAULT_IMG;
};

// Helper function to get all available images for the carousel/thumbnails
const getAllImages = (product) => {
  if (!product) return [DEFAULT_IMG];
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
  images = [...new Set(images.filter(Boolean))];
  return images.length > 0 ? images : [DEFAULT_IMG];
};


/* =========================================
 * QUICK VIEW MODAL (WITH ALL APIS FROM PRODUCT DETAILS)
 * ========================================= */
const QuickViewModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Naye States for Fetching Full Data
  const [fullProduct, setFullProduct] = useState(product); // Initially use passed product
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [activeImgIdx, setActiveImgIdx] = useState(0); 
  const [expand, setExpand] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  const modalRef = useRef(null);
  const thumbScrollRef = useRef(null); 
  const touchStartY = useRef(0);

  const showToast = (type, message) => setToastMessage({ type, message });

  // --- 1. FULL PRODUCT & SIMILAR PRODUCTS API ---
  useEffect(() => {
    if (product && product._id) {
      const fetchProductAndSimilar = async () => {
        try {
          setLoadingDetails(true);
          // Fetch Current Product
          const { data } = await axiosInstance.get(`/products/${product._id}`);
          if (data?.success && data?.product) {
            setFullProduct(data.product);
          }

          // Fetch Similar Products
          const allProductsRes = await axiosInstance.get('/products');
          if (allProductsRes.data?.success) {
            const related = allProductsRes.data.products
              .filter(p => p.category === product.category && p._id !== product._id)
              .slice(0, 4);
            setSimilarProducts(related);
          }
        } catch (error) {
          console.error("Failed to load full details", error);
        } finally {
          setLoadingDetails(false);
        }
      };
      
      fetchProductAndSimilar();
    }
  }, [product]);

  // --- 2. THE HISTORY TRACKING MAGIC ---
  useEffect(() => {
    if (fullProduct && fullProduct._id) {
      const trackProductView = async () => {
        try {
          let currentGuestId = localStorage.getItem('guestId');
          if (!user && !currentGuestId) {
            currentGuestId = 'guest_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('guestId', currentGuestId);
          }

          await axiosInstance.post('/history/add', {
            type: 'view',
            productId: fullProduct._id,
            guestId: currentGuestId
          }, {
            headers: { 'x-guest-id': currentGuestId }
          });
        } catch (error) {
          console.error("Failed to track history in background", error);
        }
      };
      trackProductView();
    }
  }, [fullProduct, user]);

  if (!fullProduct) return null;

  const galleryImages = getAllImages(fullProduct);

  const handleScrollAndSwipe = (deltaY) => {
    const scrollTop = modalRef.current?.scrollTop || 0;
    if (!expand && deltaY > 15) {
      setExpand(true);
    } else if (expand && scrollTop <= 10 && deltaY < -15) {
      setExpand(false);
    }
  };

  const handleWheel = (e) => handleScrollAndSwipe(e.deltaY);
  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    let endY = e.changedTouches[0].clientY;
    let diffY = touchStartY.current - endY;
    handleScrollAndSwipe(diffY);
  };

  // --- 3. ADD TO CART LOGIC ---
const handleAddToCart = async () => {
  setIsAddingToCart(true);
  try {
   const res = await axiosInstance.post('/cart/add', { 
  productId: product._id, 
  quantity: 1 
});

// 👉 Direct count bhejo header ko
window.dispatchEvent(new CustomEvent('cartUpdated', {
  detail: { increase: 1 }
}));
    showToast('success', 'Added to your luxury cart!');
  } catch (error) {
    if(error.response?.status === 401) {
      showToast('info', 'Please login to add items to cart.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      showToast('error', 'Failed to add to cart.');
    }
  } finally {
    setIsAddingToCart(false);
  }
};

  // Safe fallback data for the expanded section
  const story = fullProduct.description || fullProduct.details?.story || "This exclusive piece embodies the perfect blend of modern innovation and timeless craftsmanship. Discover the exceptional details, premium materials, and unparalleled design that make this product truly unique and essential for your collection.";
  const highlights = fullProduct.details?.highlights || [
    { icon: <Star className="w-5 h-5" />, title: "Premium Quality", desc: "Crafted with the finest materials." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Durable", desc: "Built to last a lifetime." }
  ];
  const specs = fullProduct.details?.specs || [
    { label: "Brand", value: fullProduct.brand || "Exclusive" },
    { label: "Category", value: fullProduct.category || "Luxury" }
  ];
  const boxItems = fullProduct.details?.boxItems || [fullProduct.name, "Authenticity Card", "Premium Packaging"];

  return (
    <div 
      className={`fixed inset-0 z-[100] flex transition-all duration-500 ease-in-out ${expand ? 'items-start bg-white p-0' : 'items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-6'}`}
      onClick={onClose}
    >
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      <div 
        id="modalContent"
        ref={modalRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out ${
  expand 
    ? 'w-full h-[100vh] rounded-none shadow-none px-4 md:px-10' 
    : 'w-full max-w-[95%] md:max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-4'
}`}        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', margin: '0 auto' }}
      >
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        
        <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm transition-all z-50 cursor-pointer">
          <X className="w-5 h-5 text-gray-800" />
        </button>

        <div className={`w-full max-w-[1400px] mx-auto transition-all duration-500 ease-in-out ${expand ? 'pt-10 md:pt-16 pb-20' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
          
          {loadingDetails && !expand && (
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
              <div className="w-3 h-3 border-2 border-[#d3b574] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Loading Details...</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row w-full">
            {/* Left: Image Side */}
            <div className="w-full md:w-[50%] bg-white flex flex-row justify-start items-center relative" style={{ padding: '16px', minHeight: '300px' }}>
              <div className="flex flex-col items-center justify-between mr-2 md:mr-4 w-[50px] md:w-[70px] h-[260px] md:h-[320px]" style={{ flexShrink: 0 }}>
                {galleryImages.length > 1 && (
                  <button onClick={() => thumbScrollRef.current?.scrollBy({ top: -100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mb-2 bg-white-100 hover:bg-gray-200 text-gray-600 hover:text-black transition-all duration-300 mx-auto">
                    <ChevronUp className="w-5 h-5" />
                  </button>
                )}

                <div ref={thumbScrollRef} className="hide-scroll flex flex-col gap-2 md:gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {galleryImages.map((imgSrc, idx) => (
                    <div 
                      key={idx} onMouseEnter={() => setActiveImgIdx(idx)} onClick={() => setActiveImgIdx(idx)}      
                      className={`w-full aspect-square bg-[#f9f9f9] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${activeImgIdx === idx ? 'border-[#d3b574]' : 'border-transparent'}`}
                      style={{ padding: '4px md:6px', flexShrink: 0 }}
                    >
                      <img src={imgSrc} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} onError={(e) => { e.currentTarget.src = DEFAULT_IMG }} />
                    </div>
                  ))}
                </div>

                {galleryImages.length > 1 && (
                  <button onClick={() => thumbScrollRef.current?.scrollBy({ top: 100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mt-2 bg-white-100 hover:bg-gray-200 text-gray-600 hover:text-black transition-all duration-300 mx-auto">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex-1 bg-[#f9f9f9] rounded-xl flex items-center justify-center p-4 md:p-6 relative overflow-hidden hover:shadow-sm h-[260px] md:h-[320px]">
                 <img
                    key={activeImgIdx} src={galleryImages[activeImgIdx]} alt={fullProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: 'transform 0.5s ease', maxHeight: '280px' }}
                    className="hover:scale-105" onError={(e) => { e.currentTarget.src = DEFAULT_IMG }}
                 />
              </div>
            </div>

            {/* Right: Product Info Side */}
            <div className="w-full md:w-[50%] flex flex-col justify-start items-start text-left" style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column' }}>
              <div className="w-full flex flex-col items-start" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-[#d3b574] mb-2">{fullProduct.brand || fullProduct.category}</p>
                
                <h1 className="text-left text-[#212121] font-medium text-[15px] md:text-[20px] mb-2 leading-snug">
                  {showFullTitle ? (
                    <>
                      {fullProduct.name}
                      <button onClick={() => setShowFullTitle(false)} className="text-[#d3b574] text-[12px] ml-1 font-bold bg-transparent border-none p-0 cursor-pointer">less</button>
                    </>
                  ) : (
                    <>
                      {fullProduct.name}
                      <button onClick={() => setShowFullTitle(true)} className="text-[#d3b574] text-[12px] ml-1 font-bold bg-transparent border-none p-0 cursor-pointer">more</button>
                    </>
                  )}
                </h1>

                <div className="flex items-center gap-3 mb-4 flex-wrap mt-1">
                  <div className="flex items-center gap-1 text-[#d3b574]">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 text-gray-200" />
                  </div>
                  <span className="text-gray-500 text-xs font-medium">{fullProduct.reviews?.length || "0"} Reviews</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500 text-xs font-medium">{fullProduct.soldCount || "0"} Sold</span>
                </div>

                <div className="flex items-center justify-start flex-wrap w-full gap-2 md:gap-3 mb-4">
                  <span className="font-black text-black tracking-tight transition-all duration-300" style={{ fontSize: '24px' }}>
                    {formatPrice(fullProduct.price - (fullProduct.discountPrice || 0))}
                  </span>
                  {fullProduct.discountPrice > 0 && (
                    <span className="text-gray-400 line-through font-medium text-[15px]">
                      {formatPrice(fullProduct.price)}
                    </span>
                  )}
                  {fullProduct.discountPrice > 0 && (
                    <span className="font-bold text-[#d3b574] bg-[#d3b574]/10 px-2 py-1 rounded-md uppercase tracking-widest text-[9px]">
                      Special Offer
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-gray-500 text-[13px] leading-relaxed mb-6 border-y border-gray-100 py-4 w-full">
                  {fullProduct.description || "This is a very High-quality exclusive piece designed for luxury. It provides exceptional comfort and style, making it perfect for your collection."}
                </p>

                {/* ADD TO CART & QUANTITY */}
                <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 w-full sm:w-28 h-[44px]">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">−</button>
                    <span className="font-bold text-black text-[13px]">{quantity}</span>
                    <button onClick={() => setQuantity(Math.max(1, quantity + 1))} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">+</button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || fullProduct.stock < 1}
                    className="w-full sm:w-auto px-8 hover:bg-[#c4a66a] shadow-lg active:scale-95 transition-all rounded-xl bg-[#d3b574] flex items-center justify-center gap-2 font-black uppercase tracking-widest text-black disabled:opacity-50 disabled:cursor-not-allowed"                    style={{ height: '44px', fontSize: '12px' }}
                  >
                    {isAddingToCart ? (
                       <span>Processing...</span>
                    ) : fullProduct.stock < 1 ? (
                       'Sold Out'
                    ) : (
                      <>
                        <ShoppingBag style={{ width: '16px', height: '16px' }} />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </button>
                </div>

                {/* TRUST BADGES (Exactly matching your screenshot) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
                  <div className="flex items-center gap-4 p-2 rounded-xl bg-[#0f0f0f] border border-[#222]">
                    <Truck className="w-6 h-6 text-[#d3b574]" strokeWidth={1.5} />
                    <div className="flex flex-col text-left">
                      <h4 className="text-[14px] font-semibold text-white tracking-wide mb-0.5 leading-none">Complimentary Shipping</h4>
                      <p className="text-[12px] text-gray-500 leading-none">On all premium orders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-2 rounded-xl bg-[#0f0f0f] border border-[#222]">
                    <ShieldCheck className="w-6 h-6 text-[#d3b574]" strokeWidth={1.5} />
                    <div className="flex flex-col text-left">
                      <h4 className="text-[14px] font-semibold text-white tracking-wide mb-0.5 leading-none">Authenticity Guaranteed</h4>
                      <p className="text-[12px] text-gray-500 leading-none">Certificate included</p>
                    </div>
                  </div>
                </div>

                {!expand && (
                  <div 
                    className="group flex items-center justify-start w-full cursor-pointer pt-2 pb-2 md:pt-3 md:pb-3 gap-2 md:gap-3 mt-1 border-t border-transparent"
                    onClick={() => setExpand(true)}
                  >
                     <Package className="text-[#d3b574] group-hover:scale-110 transition-transform w-[18px] h-[18px]" />
                     <span className="font-serif italic text-black group-hover:text-[#d3b574] transition-colors text-[16px]">Product Overview</span>
                     <ChevronDown className="text-gray-300 animate-bounce w-[16px] h-[16px]" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* EXPANDED DETAILS AREA */}
          <div style={{ maxHeight: expand ? '5000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', pointerEvents: expand ? 'auto' : 'none', transition: 'all 0.5s ease-in-out' }}>
            <div className="border-t border-gray-100 bg-white" style={{ padding: "30px 16px md:40px 16px", marginTop: "20px" }}>
              
              <div style={{ marginBottom: "40px" }}>
                 <h3 className="font-serif italic text-black flex items-center justify-center" style={{ gap: "12px", marginBottom: "16px", fontSize: "20px" }}>
                   <Package className="w-5 h-5 text-[#d3b574]" /> Product Overview
                 </h3>
                 <p className="text-gray-600 leading-loose whitespace-pre-line font-medium text-center px-2 md:px-8" style={{ fontSize: "13px" }}>
                   {story}
                 </p>
              </div>

              <div style={{ marginBottom: "40px" }}>
                <h3 className="font-serif italic text-black text-center" style={{ marginBottom: "24px", fontSize: "18px" }}>Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-2 md:px-6" style={{ gap: "20px" }}>
                  {highlights.map((h, i) => (
                    <div key={i} className="bg-gray-50 rounded-[20px] border border-gray-100 hover:shadow-md transition-shadow text-center flex flex-col items-center" style={{ padding: "20px" }}>
                      <div className="bg-white rounded-full inline-block shadow-sm text-[#d3b574]" style={{ padding: "10px", marginBottom: "16px" }}>{h.icon || <Star className="w-5 h-5"/>}</div>
                      <h4 className="font-black text-black uppercase tracking-wider" style={{ marginBottom: "10px", fontSize: "11px" }}>{h.title}</h4>
                      <p className="text-gray-500 font-medium" style={{ fontSize: "12px" }}>{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 px-2 md:px-6" style={{ gap: "32px", marginBottom: "40px" }}>
                <div>
                  <h3 className="font-serif italic text-black text-center" style={{ marginBottom: "20px", fontSize: "18px" }}>Technical Specs</h3>
                  <div className="border border-gray-100 rounded-[20px] overflow-hidden">
                    {specs.map((s, i) => (
                      <div key={i} className={`flex flex-row ${i !== specs.length - 1 ? 'border-b border-gray-50' : ''}`} style={{ padding: "12px 16px" }}>
                        <div className="w-[40%] font-black text-gray-500 uppercase tracking-widest text-left" style={{ fontSize: "9px" }}>{s.label}</div>
                        <div className="w-[60%] text-black font-bold text-left" style={{ fontSize: "11px" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif italic text-black text-center" style={{ marginBottom: "20px", fontSize: "18px" }}>In The Box</h3>
                  <div className="bg-gray-50 rounded-[20px] border border-gray-100" style={{ padding: "24px" }}>
                    <ul className="space-y-4" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {boxItems.map((item, i) => (
                        <li key={i} className="flex items-center justify-center text-black font-bold" style={{ gap: "12px", fontSize: "12px" }}>
                          <CheckCircle className="w-4 h-4 text-[#d3b574]" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* --- YOU MAY ALSO LIKE SECTION (SIMILAR PRODUCTS) --- */}
              {similarProducts && similarProducts.length > 0 && (
                <div className="mt-16 border-t border-gray-100 pt-12 px-2 md:px-6">
                  <h3 className="font-serif italic text-black text-center flex items-center justify-center gap-3" style={{ marginBottom: "32px", fontSize: "22px" }}>
                    <span className="w-2 h-2 rounded-full bg-[#d3b574]"></span> You May Also Like
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {similarProducts.map((simProduct) => (
                      <div 
                        key={simProduct._id} 
                        onClick={() => {
                           // Swap product in modal without reloading
                           setFullProduct(simProduct);
                           setActiveImgIdx(0);
                           if(modalRef.current) modalRef.current.scrollTop = 0;
                        }} 
                        className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-[#d3b574]/50 transition-all duration-300 flex flex-col shadow-sm cursor-pointer"
                      >
                        <div className="h-48 overflow-hidden bg-[#f9f9f9] relative flex items-center justify-center p-4">
                          <img 
                            src={getSafeImage(simProduct)} 
                            alt={simProduct.name} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                            onError={(e) => { e.currentTarget.src = DEFAULT_IMG }}
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col text-center">
                          <span className="text-[9px] text-gray-400 mb-1 tracking-wider uppercase font-bold">{simProduct.category}</span>
                          <h3 className="text-[13px] font-medium mb-1 text-black group-hover:text-[#d3b574] transition-colors line-clamp-1">{simProduct.name}</h3>
                          <div className="mt-auto pt-2">
                            <span className="text-[14px] font-black text-black">
                              {formatPrice(simProduct.price - (simProduct.discountPrice || 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div 
                className="w-full flex flex-col items-center justify-center text-gray-400 hover:text-black cursor-pointer transition-all px-2 md:px-6" 
                style={{ paddingTop: "40px", paddingBottom: "16px" }}
                onClick={() => { 
                  if(modalRef.current) { modalRef.current.scrollTop = 0; }
                  setTimeout(() => setExpand(false), 300); 
                }}
              >
                <ChevronUp className="w-5 h-5 animate-bounce" style={{ marginBottom: "8px" }} />
                <p className="uppercase tracking-[0.3em] font-black" style={{ fontSize: "9px" }}>Close Overview</p>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

/* =========================================
 * PRODUCT CARD
 * ========================================= */
const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const productUrl = createProductUrl(product);

  return (
<div 
  onClick={() => onQuickView(product)}   // ✅ यही change
  className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg w-full h-full cursor-pointer"
>    
<div className="relative h-[420px] bg-gray-100 overflow-hidden rounded-2xl cursor-pointer">        <div className="absolute inset-0 w-full h-full p-6 transition-transform duration-1000 group-hover:scale-105">
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

  <button 
  onClick={async (e) => {
    e.stopPropagation();

    try {
      await axiosInstance.post('/cart/add', { 
        productId: product._id, 
        quantity: 1 
      });

      // ✅ SAME as popup
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { increase: 1 }
      }));

      console.log("Added to cart");
    } catch (err) {
      console.log("Error adding to cart");
    }
  }}
  className="absolute bottom-0 left-0 w-full h-11 bg-black flex items-center justify-center space-x-3 text-white lg:translate-y-full group-hover:translate-y-0 transition-all duration-500 z-50 hover:bg-[#d3b574] hover:text-black"
>
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

/* =========================================
 * EXPORTED GRID COMPONENT
 * ========================================= */
export default function ProductGrid({ title, subtitle, products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedProduct]);

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
            <div key={product._id || Math.random()} className="w-[340px]">
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