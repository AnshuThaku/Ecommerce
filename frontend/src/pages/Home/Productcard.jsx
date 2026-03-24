


// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star, 
//   ChevronDown, ChevronUp, Package, CheckCircle, Truck, 
//   Zap, Clock, Info, Cpu 
// } from 'lucide-react';

// // --- LOCAL TEST MOCKS ---
// const useAuth = () => ({ user: null });
// const axiosInstance = {
//   post: async (url, data) => {
//     return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 800));
//   },
//   get: async (url) => {
//     return new Promise((resolve) => setTimeout(() => resolve({ 
//       data: { success: true, product: null, products: [] } 
//     }), 500));
//   }
// };

// const Toast = ({ toast, onClose }) => {
//   if (!toast) return null;
//   return (
//     <div className="fixed top-5 right-5 z-[999] bg-black text-[#d3b574] border border-[#d3b574] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-top-4">
//       <span className="font-medium text-sm tracking-wide">{toast.message}</span>
//       <button onClick={onClose} className="hover:text-white transition-colors"><X className="w-4 h-4" /></button>
//     </div>
//   );
// };

// // --- HELPERS ---
// const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

// const formatPrice = (amount) => {
//   if (!amount) return '₹0';
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0
//   }).format(amount);
// };

// const getSafeImage = (product) => {
//   if (!product) return DEFAULT_IMG;
//   if (product.variants?.[0]?.images?.[0]?.url) return product.variants[0].images[0].url;
//   if (product.images?.[0]?.url) return product.images[0].url;
//   return product.image || DEFAULT_IMG;
// };

// const getAllImages = (product) => {
//   if (!product) return [DEFAULT_IMG];
//   let images = [];
//   if (product.variants?.[0]?.images?.length > 0) {
//     images = product.variants[0].images.map(img => img.url);
//   } else if (product.images?.length > 0) {
//     images = product.images.map(img => img.url);
//   } else if (product.image) {
//     images = [product.image];
//     if (product.hoverImage) images.push(product.hoverImage);
//   }
//   images = [...new Set(images.filter(Boolean))];
//   return images.length > 0 ? images : [DEFAULT_IMG];
// };

// /* =========================================
//  * QUICK VIEW MODAL
//  * ========================================= */
// const QuickViewModal = ({ product, onClose }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [fullProduct, setFullProduct] = useState(product); 
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [activeImgIdx, setActiveImgIdx] = useState(0); 
//   const [expand, setExpand] = useState(false);
//   const [showFullTitle, setShowFullTitle] = useState(false);
//   const [activeDetailTab, setActiveDetailTab] = useState('overview');
//   const [quantity, setQuantity] = useState(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [toastMessage, setToastMessage] = useState(null);
  
//   // ⚡ VARIANT SELECTION STATE ⚡
//   const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  
//   const modalRef = useRef(null);
//   const thumbScrollRef = useRef(null); 
//   const touchStartY = useRef(0);

//   const showToast = (type, message) => {
//     setToastMessage({ type, message });
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   const isDealActive = fullProduct?.flashDeal?.isActive && new Date(fullProduct.flashDeal.endTime).getTime() > Date.now();
//   const displayPrice = isDealActive ? fullProduct.flashDeal.dealPrice : (fullProduct?.price - (fullProduct?.discountPrice || 0));

//   useEffect(() => {
//     if (product && product._id) {
//       const fetchDetails = async () => {
//         setLoadingDetails(true);
//         try {
//           const { data } = await axiosInstance.get(`/products/${product._id}`);
//           if (data?.success && data?.product) {
//             setFullProduct(data.product);
//           }
//         } catch (e) { console.error(e); }
//         setLoadingDetails(false);
//       };
//       fetchDetails();
//     }
//   }, [product]);

//   const handleScrollAndSwipe = (deltaY) => {
//     const scrollTop = modalRef.current?.scrollTop || 0;
//     if (!expand && deltaY > 15) setExpand(true);
//     else if (expand && scrollTop <= 10 && deltaY < -15) setExpand(false);
//   };

//   // ⚡ CART LOGIC FOR MODAL ⚡
//   const handleModalAddToCart = async () => {
//     setIsAddingToCart(true);
//     try {
//       await axiosInstance.post('/cart/add', { productId: fullProduct._id, quantity });
      
//       // DISPATCH EVENT FOR HEADER
//       window.dispatchEvent(new CustomEvent('cartUpdated', { 
//         detail: { increase: quantity } 
//       }));

//       showToast('success', `${quantity} items added to your luxury cart!`);
//     } catch (error) {
//       showToast('error', 'Failed to add items to cart.');
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   // ⚡ FILTER IMAGES BASED ON SELECTED VARIANT ⚡
//   const hasVariants = fullProduct?.variants?.length > 0;
//   let galleryImages = [];
//   if (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0) {
//     galleryImages = fullProduct.variants[selectedVariantIdx].images.map(img => img.url);
//   } else {
//     galleryImages = getAllImages(fullProduct);
//   }
//   galleryImages = [...new Set(galleryImages.filter(Boolean))];
//   if (galleryImages.length === 0) galleryImages = [DEFAULT_IMG];

//   // ⚡ DYNAMIC DETAILS ⚡
//   const descriptionList = fullProduct.details?.descriptionList || [
//     "Active noise cancellation",
//     "Upto 6 hours battery with quick charge feature",
//     "IPX4 sweat and water resistant",
//     "Magnetic buds",
//     "Integrated Tile Technology to find your lost earbuds"
//   ];
  
//   const featuresText = fullProduct.details?.features || "The new Skullcandy Method Active Noise Cancellation will completely isolate you and your music. Listen to your music for straight 6 hours on a full charge and 1.5 hours of playback time with a 10 minutes charge. With its magnetic earbuds when you are not listening to it without dealing with tangling wires. Its has adjustable wire with the cable management clip.\n\nThe secure FitFin noise isolating fit makes sure that the earbuds fit in your ear and does not fall off. Made with premium technology with IPX4 rated water-resistant which gives protection against any type of sweat, moisture and unwanted weather changes. In-built microphone to take calls and access your smartphone assistant. You can control your music and volume with the control buttons given on the Skull candy Method ANC. It comes with an in-built tile tracker which can help you to find your earbuds if you lost them. Connect your earbuds with the app and locate them any time you want.";

//   const specs = fullProduct.details?.specs || [
//     { label: "Brand", value: fullProduct.brand || "Exclusive" },
//     { label: "Category", value: fullProduct.category || "Luxury" },
//     { label: "Material", value: "Premium Grade" }
//   ];
//   const boxItems = fullProduct.details?.boxItems || ["Main Unit", "Authenticity Card", "Premium Packaging"];

//   return (
//     <div 
//       className={`fixed inset-0 z-[100] flex transition-all duration-500 ease-in-out ${expand ? 'items-start bg-white p-0' : 'items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-6'}`}
//       onClick={onClose}
//     >
//       <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
//       <div 
//         ref={modalRef}
//         onWheel={(e) => handleScrollAndSwipe(e.deltaY)}
//         onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
//         onTouchEnd={(e) => handleScrollAndSwipe(touchStartY.current - e.changedTouches[0].clientY)}
//         onClick={(e) => e.stopPropagation()}
//         className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out hide-scroll ${
//           expand ? 'w-full h-[100vh] rounded-none shadow-none px-4 md:px-10' : 'w-full max-w-[95%] md:max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-4'
//         }`}
//         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', margin: '0 auto' }}
//       >
//         <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm transition-all z-50 cursor-pointer">
//           <X className="w-5 h-5 text-gray-800" />
//         </button>

//         <div className={`w-full max-w-[1400px] mx-auto transition-all duration-500 ease-in-out ${expand ? 'pt-10 md:pt-16 pb-20' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
//           <div className="flex flex-col md:flex-row w-full">
//             {/* Left Image Side */}
//             <div className="w-full md:w-[50%] bg-white flex flex-row justify-start items-center relative p-4" style={{ minHeight: '300px' }}>
//               {isDealActive && (
//                 <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl">
//                   <Zap className="w-3 h-3 fill-current" /> Limited Deal
//                 </div>
//               )}

//               <div className="flex flex-col items-center justify-between mr-2 md:mr-4 w-[50px] md:w-[70px] h-[260px] md:h-[320px]" style={{ flexShrink: 0 }}>
//                 {galleryImages.length > 1 && (
//                   <button onClick={() => thumbScrollRef.current?.scrollBy({ top: -100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mb-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-full transition-all">
//                     <ChevronUp className="w-5 h-5" />
//                   </button>
//                 )}

//                 <div ref={thumbScrollRef} className="hide-scroll flex flex-col gap-2 md:gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1">
//                   {galleryImages.map((imgSrc, idx) => (
//                     <div 
//                       key={idx} onMouseEnter={() => setActiveImgIdx(idx)} onClick={() => setActiveImgIdx(idx)}      
//                       className={`w-full aspect-square bg-[#f9f9f9] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${activeImgIdx === idx ? 'border-[#d3b574]' : 'border-transparent'}`}
//                       style={{ padding: '4px', flexShrink: 0 }}
//                     >
//                       <img src={imgSrc} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
//                     </div>
//                   ))}
//                 </div>

//                 {galleryImages.length > 1 && (
//                   <button onClick={() => thumbScrollRef.current?.scrollBy({ top: 100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mt-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-full transition-all">
//                     <ChevronDown className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>

//               <div className="flex-1 bg-[#f9f9f9] rounded-xl flex items-center justify-center p-4 md:p-6 relative overflow-hidden h-[260px] md:h-[320px]">
//                  <img
//                     key={activeImgIdx} src={galleryImages[activeImgIdx] || galleryImages[0]} alt={fullProduct.name}
//                     style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: 'transform 0.5s ease', maxHeight: '280px' }}
//                     className="hover:scale-105"
//                  />
//               </div>
//             </div>

//             {/* Right Info Side */}
//             <div className="w-full md:w-[50%] flex flex-col justify-start items-start text-left p-4 md:px-8">
//               <p className={`text-[11px] uppercase tracking-[0.5em] font-bold ${isDealActive ? 'text-red-500' : 'text-[#d3b574]'} mb-2`}>{fullProduct.brand || fullProduct.category}</p>

//               <h1 className="text-[#212121] font-medium text-[15px] md:text-[20px] mb-2 leading-snug">
//                 {showFullTitle ? fullProduct.name : (fullProduct.name.length > 60 ? fullProduct.name.substring(0,60) + "..." : fullProduct.name)}
//                 <button onClick={() => setShowFullTitle(!showFullTitle)} className="text-[#d3b574] text-[12px] ml-2 font-bold bg-transparent border-none p-0 cursor-pointer">
//                   {showFullTitle ? 'less' : 'more'}
//                 </button>
//               </h1>

//               <div className="flex items-center gap-3 mb-4 flex-wrap mt-1">
//                 <div className="flex items-center gap-1 text-[#d3b574]">
//                   {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < 4 ? 'fill-current' : 'text-gray-200'} />)}
//                 </div>
//                 <span className="text-gray-500 text-xs font-medium">{fullProduct.reviews?.length || "0"} Reviews</span>
//               </div>

//               <div className="flex items-center justify-start flex-wrap w-full gap-2 md:gap-3 mb-4">
//                 <span className={`font-black tracking-tight transition-all duration-300 ${isDealActive ? 'text-red-600' : 'text-black'}`} style={{ fontSize: '24px' }}>
//                   {formatPrice(displayPrice)}
//                 </span>
//                 {(fullProduct.discountPrice > 0 || isDealActive) && (
//                   <span className="text-gray-400 line-through font-medium text-[15px]"> {formatPrice(fullProduct.price)} </span>
//                 )}
//               </div>

//               {/* ⚡ VARIANT SELECTOR (NEW) ⚡ */}
//               {hasVariants && (
//                 <div className="mb-3 flex items-center gap-3">
//                    <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Variant:</span>
//                    <div className="flex gap-2 items-center flex-wrap">
//                       {fullProduct.variants.map((v, idx) => (
//                          <button
//                            key={idx}
//                            onClick={() => { 
//                              setSelectedVariantIdx(idx); 
//                              setActiveImgIdx(0); 
//                            }}
//                            className={`w-10 h-10 rounded-md border transition-all flex items-center justify-center bg-[#f9f9f9] ${selectedVariantIdx === idx ? 'border-[#d3b574] shadow-md scale-110' : 'border-gray-200 hover:border-gray-400'}`}
//                            title={v.color || `Variant ${idx + 1}`}
//                            style={{ padding: '2px' }}
//                          >
//                            <img 
//                              src={v.images?.[0]?.url || DEFAULT_IMG} 
//                              alt={v.color || `Variant ${idx + 1}`} 
//                              className="w-full h-full object-contain mix-blend-multiply rounded-sm" 
//                            />
//                          </button>
//                       ))}
//                    </div>
//                 </div>
//               )}

//               <p className="text-gray-500 text-[13px] leading-relaxed mb-6 border-y border-gray-100 py-4 w-full">
//                 {fullProduct.description || "Premium quality piece designed for exceptional style and luxury."}
//               </p>

//               <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
//                 <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 w-full sm:w-28 h-[44px]">
//                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">−</button>
//                   <span className="font-bold text-black text-[13px]">{quantity}</span>
//                   <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">+</button>
//                 </div>
                
//                 <button 
//                   onClick={handleModalAddToCart}
//                   disabled={isAddingToCart}
//                   className={`w-[300px] shadow-lg active:scale-95 transition-all rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest ${
//                     isDealActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#d3b574] text-black hover:bg-[#c4a66a]'
//                   }`}
//                   style={{ height: '44px', fontSize: '12px' }}
//                 >
//                   {isAddingToCart ? <span>Adding...</span> : (
//                     <>
//                       <ShoppingBag size={16} />
//                       <span>{isDealActive ? 'CLAIM DEAL' : 'ADD TO CART'}</span>
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Badges */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
//                 <div className="flex gap-4 p-2 justify-center rounded-xl bg-[#0f0f0f] border border-[#222]">
//                   <Truck className="w-6 h-6 text-[#d3b574]" strokeWidth={1} />
//                   <div className="flex flex-col text-left">
//                     <h4 className="text-[14px] font-semibold text-white leading-none mb-1">Free Shipping</h4>
//                     <p className="text-[12px] text-gray-500 leading-none">Premium orders</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-4 p-2 justify-center rounded-xl bg-[#0f0f0f] border border-[#222]">
//                   <ShieldCheck className="w-6 h-6 text-[#d3b574]" strokeWidth={1.5} />
//                   <div className="flex flex-col text-left">
//                     <h4 className="text-[14px] font-semibold text-white leading-none mb-1">Authentic</h4>
//                     <p className="text-[12px] text-gray-500 leading-none">Certified product</p>
//                   </div>
//                 </div>
//               </div>

//               {!expand && (
//                 <div className="group flex items-center justify-start w-full cursor-pointer py-3 gap-3" onClick={() => setExpand(true)}>
//                     <Package className="text-[#d3b574] group-hover:scale-110 transition-transform w-[18px] h-[18px]" />
//                     <span className="font-serif italic text-black group-hover:text-[#d3b574] text-[16px]">Product Overview</span>
//                     <ChevronDown className="text-gray-300 animate-bounce w-[16px] h-[16px]" />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Expanded Tabs */}
//           <div style={{ maxHeight: expand ? '5000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.5s ease-in-out' }}>
//             <div className="border-t border-gray-100 bg-white pt-10 px-4">
//               <div className="flex gap-4 mb-10 max-w-2xl mx-auto overflow-x-auto pb-2 justify-center">
//                 <button 
//                   onClick={() => setActiveDetailTab('overview')}
//                   className={`flex-1 min-w-[150px] flex items-center justify-center gap-3 p-3 rounded-xl border transition-all ${
//                     activeDetailTab === 'overview' ? 'bg-[#0f0f0f] border-[#d3b574] text-white' : 'bg-[#f9f9f9] border-gray-100'
//                   }`}
//                 >
//                   <Package className={activeDetailTab === 'overview' ? 'text-[#d3b574]' : 'text-gray-400'} />
//                   <div><h4 className="text-sm font-bold">Product Detail</h4></div>
//                 </button>
//                 <button 
//                   onClick={() => setActiveDetailTab('specs')}
//                   className={`flex-1 min-w-[150px] flex items-center justify-center gap-3 p-3 rounded-xl border transition-all ${
//                     activeDetailTab === 'specs' ? 'bg-[#0f0f0f] border-[#d3b574] text-white' : 'bg-[#f9f9f9] border-gray-100'
//                   }`}
//                 >
//                   <Cpu className={activeDetailTab === 'specs' ? 'text-[#d3b574]' : 'text-gray-400'} />
//                   <div><h4 className="text-sm font-bold">Specs</h4></div>
//                 </button>
//               </div>

//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
//                 {activeDetailTab === 'overview' ? (
//                   <div className="text-left mb-10 px-4 md:px-10">
//                     <h3 className="text-lg font-bold text-black mb-3">Product Description</h3>
//                     <ul className="list-disc pl-5 mb-8 text-gray-700 text-[14px] space-y-1">
//                       {descriptionList.map((item, idx) => (
//                         <li key={idx}>{item}</li>
//                       ))}
//                     </ul>
//                     <h3 className="text-lg font-bold text-black mb-3">Product features</h3>
//                     <p className="text-gray-700 leading-loose text-[14px] whitespace-pre-line">
//                       {featuresText}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="max-w-2xl mx-auto mb-10">
//                     <div className="border border-gray-100 rounded-[20px] overflow-hidden">
//                       {specs.map((s, i) => (
//                         <div key={i} className={`flex p-4 ${i !== specs.length - 1 ? 'border-b border-gray-50' : ''}`}>
//                           <div className="w-[40%] font-black text-gray-700 uppercase tracking-widest text-[10px]">{s.label}</div>
//                           <div className="w-[60%] text-black font-bold text-[13px]">{s.value}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 <div className="max-w-2xl mx-auto pt-10 border-t border-gray-50">
//                    <div className="bg-gray-50 rounded-[20px] p-6 border border-gray-100">
//                     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       {boxItems.map((item, i) => (
//                         <li key={i} className="flex items-center gap-3 text-black font-bold text-[12px]">
//                           <CheckCircle className="w-4 h-4 text-[#d3b574]" /> {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               <div className="w-full flex flex-col items-center justify-center text-gray-400 hover:text-black cursor-pointer transition-all mt-16 pb-10" 
//                 onClick={() => { setExpand(false); if(modalRef.current) modalRef.current.scrollTop = 0; }}>
//                 <ChevronUp className="w-5 h-5 animate-bounce mb-2" />
//                 <p className="uppercase tracking-[0.3em] font-black text-[9px]">Close Overview</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================
//  * PRODUCT CARD (340px Width)
//  * ========================================= */
// const ProductCard = ({ product, onQuickView }) => {
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [isDealActive, setIsDealActive] = useState(false);

//   useEffect(() => {
//     if (product.flashDeal?.isActive && product.flashDeal?.endTime) {
//       const timer = setInterval(() => {
//         const distance = new Date(product.flashDeal.endTime).getTime() - Date.now();
//         if (distance > 0) {
//           setIsDealActive(true);
//           setTimeLeft({
//             h: Math.floor((distance / (1000 * 60 * 60)) % 24),
//             m: Math.floor((distance / 1000 / 60) % 60),
//             s: Math.floor((distance / 1000) % 60)
//           });
//         } else {
//           setIsDealActive(false);
//           clearInterval(timer);
//         }
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [product]);

//   // ⚡ CART LOGIC FOR CARD ⚡
//   const handleCardAddToCart = async (e) => {
//     e.stopPropagation(); // Prevents QuickView opening
//     try {
//       await axiosInstance.post('/cart/add', { productId: product._id, quantity: 1 });
      
//       // DISPATCH EVENT FOR HEADER COUNT UPDATE
//       window.dispatchEvent(new CustomEvent('cartUpdated', { 
//         detail: { increase: 1 } 
//       }));
      
//       console.log("Cart updated globally");
//     } catch (err) {
//       console.error("Error adding to cart");
//     }
//   };

//   const displayPrice = isDealActive ? product.flashDeal.dealPrice : (product.price - (product.discountPrice || 0));

//   return (
//     <div 
//       onClick={() => onQuickView(product)}
//       className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg w-full h-full cursor-pointer"
//     >    
//       <div className="relative h-[420px] bg-gray-100 overflow-hidden rounded-2xl">        
//         {isDealActive && (
//           <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[9px] font-black px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl">
//             <Zap className="w-3 h-3 fill-current" /> Lightning Deal
//           </div>
//         )}

//         <div className="absolute inset-0 p-6 transition-transform duration-1000 group-hover:scale-105">
//           <img src={getSafeImage(product)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
//         </div>

//         <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-30 opacity-0 lg:opacity-100 translate-x-4 lg:translate-x-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
//           <button className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all"><Heart size={14} /></button>
//           <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all"><Eye size={14} /></button>
//         </div>

//         <button 
//           onClick={handleCardAddToCart}
//           className={`absolute bottom-0 left-0 w-full h-11 flex items-center justify-center gap-3 text-white transition-all duration-500 z-30 lg:translate-y-full group-hover:translate-y-0 ${
//             isDealActive ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-[#d3b574] hover:text-black'
//           }`}
//         >
//           <ShoppingCart size={16} />
//           <span className="text-[10px] font-black uppercase tracking-widest">{isDealActive ? 'Claim Deal' : 'Add To Cart'}</span>
//         </button>
//       </div>

//       <div className="p-5 text-center flex flex-col items-center">
//         <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#cbb17b] mb-1">{product.brand || product.category}</p>
//         <h4 className="text-[14px] font-medium text-black mb-2 group-hover:text-[#d3b574] transition-colors truncate w-full px-2">{product.name}</h4>
        
//         <div className="flex flex-col items-center gap-1 w-full mt-1">
//           <div className="flex items-center gap-3">
//             <span className={`text-[14px] font-black ${isDealActive ? 'text-red-600' : 'text-black'}`}>{formatPrice(displayPrice)}</span>
//             {(product.discountPrice > 0 || isDealActive) && <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.price)}</span>}
//           </div>
          
//           {isDealActive && timeLeft && (
//             <div className="text-red-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
//               <Clock size={12} /> {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================
//  * MAIN EXPORT
//  * ========================================= */
// export default function App({ title = "Luxury Collection", subtitle = "2024", products = [] }) {
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     document.body.style.overflow = selectedProduct ? 'hidden' : 'unset';
//     return () => { document.body.style.overflow = 'unset'; }
//   }, [selectedProduct]);

//   if (!products || products.length === 0) return null;

//   return (
//     <section className="bg-white py-20 font-sans selection:bg-[#d3b574] selection:text-black">
//       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-12">
//           <div className="flex items-center space-x-4 mb-4">
//             <div className="w-10 h-[1px] bg-[#d3b574]"></div>
//             <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#d3b574]">Exclusively Curated</span>
//           </div>
//           <h2 className="text-4xl md:text-5xl font-serif italic text-black leading-tight">
//             {title} <span className="text-gray-300">{subtitle}</span>
//           </h2>
//         </div>

//         {/* ⚡ Flex Wrap Container with 340px Cards ⚡ */}
//         <div className="flex flex-wrap justify-center gap-6">
//           {products.map((p) => (
//             <div key={p._id || Math.random()} className="w-[340px]">
//               <ProductCard product={p} onQuickView={setSelectedProduct} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
//     </section>
//   );
// }


// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star, 
//   ChevronDown, ChevronUp, Package, CheckCircle, Truck, 
//   Zap, Clock, Info, Cpu 
// } from 'lucide-react';

// // --- LOCAL TEST MOCKS ---
// const useAuth = () => ({ user: null });
// const axiosInstance = {
//   post: async (url, data) => {
//     return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 800));
//   },
//   get: async (url) => {
//     return new Promise((resolve) => setTimeout(() => resolve({ 
//       data: { success: true, product: null, products: [] } 
//     }), 500));
//   }
// };

// const Toast = ({ toast, onClose }) => {
//   if (!toast) return null;
//   return (
//     <div className="fixed top-5 right-5 z-[999] bg-black text-[#d3b574] border border-[#d3b574] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-top-4">
//       <span className="font-medium text-sm tracking-wide">{toast.message}</span>
//       <button onClick={onClose} className="hover:text-white transition-colors"><X className="w-4 h-4" /></button>
//     </div>
//   );
// };

// // --- HELPERS ---
// const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

// const formatPrice = (amount) => {
//   if (!amount) return '₹0';
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0
//   }).format(amount);
// };

// const getSafeImage = (product) => {
//   if (!product) return DEFAULT_IMG;
//   if (product.variants?.[0]?.images?.[0]?.url) return product.variants[0].images[0].url;
//   if (product.images?.[0]?.url) return product.images[0].url;
//   return product.image || DEFAULT_IMG;
// };

// const getAllImages = (product) => {
//   if (!product) return [DEFAULT_IMG];
//   let images = [];
//   if (product.variants?.[0]?.images?.length > 0) {
//     images = product.variants[0].images.map(img => img.url);
//   } else if (product.images?.length > 0) {
//     images = product.images.map(img => img.url);
//   } else if (product.image) {
//     images = [product.image];
//     if (product.hoverImage) images.push(product.hoverImage);
//   }
//   images = [...new Set(images.filter(Boolean))];
//   return images.length > 0 ? images : [DEFAULT_IMG];
// };

// /* =========================================
//  * QUICK VIEW MODAL
//  * ========================================= */
// const QuickViewModal = ({ product, onClose }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [fullProduct, setFullProduct] = useState(product); 
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [activeImgIdx, setActiveImgIdx] = useState(0); 
//   const [expand, setExpand] = useState(false);
//   const [showFullTitle, setShowFullTitle] = useState(false);
//   const [activeDetailTab, setActiveDetailTab] = useState('overview');
//   const [quantity, setQuantity] = useState(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [toastMessage, setToastMessage] = useState(null);
  
//   // ⚡ VARIANT SELECTION STATE ⚡
//   const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  
//   const modalRef = useRef(null);
//   const thumbScrollRef = useRef(null); 
//   const touchStartY = useRef(0);

//   const showToast = (type, message) => {
//     setToastMessage({ type, message });
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   const isDealActive = fullProduct?.flashDeal?.isActive && new Date(fullProduct.flashDeal.endTime).getTime() > Date.now();
//   const displayPrice = isDealActive ? fullProduct.flashDeal.dealPrice : (fullProduct?.price - (fullProduct?.discountPrice || 0));

//   useEffect(() => {
//     if (product && product._id) {
//       const fetchDetails = async () => {
//         setLoadingDetails(true);
//         try {
//           const { data } = await axiosInstance.get(`/products/${product._id}`);
//           if (data?.success && data?.product) {
//             setFullProduct(data.product);
//           }
//         } catch (e) { console.error(e); }
//         setLoadingDetails(false);
//       };
//       fetchDetails();
//     }
//   }, [product]);

//   const handleScrollAndSwipe = (deltaY) => {
//     const scrollTop = modalRef.current?.scrollTop || 0;
//     if (!expand && deltaY > 15) setExpand(true);
//     else if (expand && scrollTop <= 10 && deltaY < -15) setExpand(false);
//   };

//   // ⚡ CART LOGIC FOR MODAL ⚡
//   const handleModalAddToCart = async () => {
//     setIsAddingToCart(true);
//     try {
//       await axiosInstance.post('/cart/add', { productId: fullProduct._id, quantity });
      
//       // DISPATCH EVENT FOR HEADER
//       window.dispatchEvent(new CustomEvent('cartUpdated', { 
//         detail: { increase: quantity } 
//       }));

//       showToast('success', `${quantity} items added to your luxury cart!`);
//     } catch (error) {
//       showToast('error', 'Failed to add items to cart.');
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   // ⚡ FILTER IMAGES BASED ON SELECTED VARIANT ⚡
//   const hasVariants = fullProduct?.variants?.length > 0;
//   let galleryImages = [];
//   if (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0) {
//     galleryImages = fullProduct.variants[selectedVariantIdx].images.map(img => img.url);
//   } else {
//     galleryImages = getAllImages(fullProduct);
//   }
//   galleryImages = [...new Set(galleryImages.filter(Boolean))];
//   if (galleryImages.length === 0) galleryImages = [DEFAULT_IMG];

//   // ⚡ DYNAMIC DETAILS ⚡
//   const descriptionList = fullProduct.details?.descriptionList || [
//     "Active noise cancellation",
//     "Upto 6 hours battery with quick charge feature",
//     "IPX4 sweat and water resistant",
//     "Magnetic buds",
//     "Integrated Tile Technology to find your lost earbuds"
//   ];
  
//   const featuresText = fullProduct.details?.features || "The new Skullcandy Method Active Noise Cancellation will completely isolate you and your music. Listen to your music for straight 6 hours on a full charge and 1.5 hours of playback time with a 10 minutes charge. With its magnetic earbuds when you are not listening to it without dealing with tangling wires. Its has adjustable wire with the cable management clip.\n\nThe secure FitFin noise isolating fit makes sure that the earbuds fit in your ear and does not fall off. Made with premium technology with IPX4 rated water-resistant which gives protection against any type of sweat, moisture and unwanted weather changes. In-built microphone to take calls and access your smartphone assistant. You can control your music and volume with the control buttons given on the Skull candy Method ANC. It comes with an in-built tile tracker which can help you to find your earbuds if you lost them. Connect your earbuds with the app and locate them any time you want.";

//   const specs = fullProduct.details?.specs || [
//     { label: "Brand", value: fullProduct.brand || "Exclusive" },
//     { label: "Category", value: fullProduct.category || "Luxury" },
//     { label: "Material", value: "Premium Grade" }
//   ];
//   const boxItems = fullProduct.details?.boxItems || ["Main Unit", "Authenticity Card", "Premium Packaging"];

//   return (
//     <div 
//       className={`fixed inset-0 z-[100] flex transition-all duration-500 ease-in-out ${expand ? 'items-start bg-white p-0' : 'items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-6'}`}
//       onClick={onClose}
//     >
//       <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
//       <div 
//         ref={modalRef}
//         onWheel={(e) => handleScrollAndSwipe(e.deltaY)}
//         onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
//         onTouchEnd={(e) => handleScrollAndSwipe(touchStartY.current - e.changedTouches[0].clientY)}
//         onClick={(e) => e.stopPropagation()}
//         className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out hide-scroll ${
//           expand ? 'w-full h-[100vh] rounded-none shadow-none px-4 md:px-10' : 'w-full max-w-[95%] md:max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-4'
//         }`}
//         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', margin: '0 auto' }}
//       >
//         <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm transition-all z-50 cursor-pointer">
//           <X className="w-5 h-5 text-gray-800" />
//         </button>

//         <div className={`w-full max-w-[1400px] mx-auto transition-all duration-500 ease-in-out ${expand ? 'pt-10 md:pt-16 pb-20' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
//           <div className="flex flex-col md:flex-row w-full">
//             {/* Left Image Side */}
//             <div className="w-full md:w-[50%] bg-white flex flex-row justify-start items-center relative p-4" style={{ minHeight: '300px' }}>
//               {isDealActive && (
//                 <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl">
//                   <Zap className="w-3 h-3 fill-current" /> Limited Deal
//                 </div>
//               )}

//               <div className="flex flex-col items-center justify-between mr-2 md:mr-4 w-[50px] md:w-[70px] h-[260px] md:h-[320px]" style={{ flexShrink: 0 }}>
//                 {galleryImages.length > 1 && (
//                   <button onClick={() => thumbScrollRef.current?.scrollBy({ top: -100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mb-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-full transition-all">
//                     <ChevronUp className="w-5 h-5" />
//                   </button>
//                 )}

//                 <div ref={thumbScrollRef} className="hide-scroll flex flex-col gap-2 md:gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1">
//                   {galleryImages.map((imgSrc, idx) => (
//                     <div 
//                       key={idx} onMouseEnter={() => setActiveImgIdx(idx)} onClick={() => setActiveImgIdx(idx)}      
//                       className={`w-full aspect-square bg-[#f9f9f9] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${activeImgIdx === idx ? 'border-[#d3b574]' : 'border-transparent'}`}
//                       style={{ padding: '4px', flexShrink: 0 }}
//                     >
//                       <img src={imgSrc} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
//                     </div>
//                   ))}
//                 </div>

//                 {galleryImages.length > 1 && (
//                   <button onClick={() => thumbScrollRef.current?.scrollBy({ top: 100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mt-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-full transition-all">
//                     <ChevronDown className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>

//               <div className="flex-1 bg-[#f9f9f9] rounded-xl flex items-center justify-center p-4 md:p-6 relative overflow-hidden h-[260px] md:h-[320px]">
//                  <img
//                     key={activeImgIdx} src={galleryImages[activeImgIdx] || galleryImages[0]} alt={fullProduct.name}
//                     style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: 'transform 0.5s ease', maxHeight: '280px' }}
//                     className="hover:scale-105"
//                  />
//               </div>
//             </div>

//             {/* Right Info Side */}
//             <div className="w-full md:w-[50%] flex flex-col justify-start items-start text-left p-4 md:px-8">
//               <p className={`text-[11px] uppercase tracking-[0.5em] font-bold ${isDealActive ? 'text-red-500' : 'text-[#d3b574]'} mb-2`}>{fullProduct.brand || fullProduct.category}</p>

//               <h1 className="text-[#212121] font-medium text-[15px] md:text-[20px] mb-2 leading-snug">
//                 {showFullTitle ? fullProduct.name : (fullProduct.name.length > 60 ? fullProduct.name.substring(0,60) + "..." : fullProduct.name)}
//                 <button onClick={() => setShowFullTitle(!showFullTitle)} className="text-[#d3b574] text-[12px] ml-2 font-bold bg-transparent border-none p-0 cursor-pointer">
//                   {showFullTitle ? 'less' : 'more'}
//                 </button>
//               </h1>

//               <div className="flex items-center gap-3 mb-4 flex-wrap mt-1">
//                 <div className="flex items-center gap-1 text-[#d3b574]">
//                   {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < 4 ? 'fill-current' : 'text-gray-200'} />)}
//                 </div>
//                 <span className="text-gray-500 text-xs font-medium">{fullProduct.reviews?.length || "0"} Reviews</span>
//               </div>

//               <div className="flex items-center justify-start flex-wrap w-full gap-2 md:gap-3 mb-6">
//                 <span className={`font-black tracking-tight transition-all duration-300 ${isDealActive ? 'text-red-600' : 'text-black'}`} style={{ fontSize: '24px' }}>
//                   {formatPrice(displayPrice)}
//                 </span>
//                 {(fullProduct.discountPrice > 0 || isDealActive) && (
//                   <span className="text-gray-400 line-through font-medium text-[15px]"> {formatPrice(fullProduct.price)} </span>
//                 )}
//               </div>

//               {/* ⚡ VARIANT SELECTOR ⚡ */}
//               {hasVariants && (
//                 <div className="mb-6 flex items-center gap-3">
//                    <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Variant:</span>
//                    <div className="flex gap-2 items-center flex-wrap">
//                       {fullProduct.variants.map((v, idx) => (
//                          <button
//                            key={idx}
//                            onClick={() => { 
//                              setSelectedVariantIdx(idx); 
//                              setActiveImgIdx(0); 
//                            }}
//                            className={`w-10 h-10 rounded-md border transition-all flex items-center justify-center bg-[#f9f9f9] ${selectedVariantIdx === idx ? 'border-[#d3b574] shadow-md scale-110' : 'border-gray-200 hover:border-gray-400'}`}
//                            title={v.color || `Variant ${idx + 1}`}
//                            style={{ padding: '2px' }}
//                          >
//                            <img 
//                              src={v.images?.[0]?.url || DEFAULT_IMG} 
//                              alt={v.color || `Variant ${idx + 1}`} 
//                              className="w-full h-full object-contain mix-blend-multiply rounded-sm" 
//                            />
//                          </button>
//                       ))}
//                    </div>
//                 </div>
//               )}

//               <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
//                 <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 w-full sm:w-28 h-[44px]">
//                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">−</button>
//                   <span className="font-bold text-black text-[13px]">{quantity}</span>
//                   <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">+</button>
//                 </div>
                
//                 <button 
//                   onClick={handleModalAddToCart}
//                   disabled={isAddingToCart}
//                   className={`w-[300px] shadow-lg active:scale-95 transition-all rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest ${
//                     isDealActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#d3b574] text-black hover:bg-[#c4a66a]'
//                   }`}
//                   style={{ height: '44px', fontSize: '12px' }}
//                 >
//                   {isAddingToCart ? <span>Adding...</span> : (
//                     <>
//                       <ShoppingBag size={16} />
//                       <span>{isDealActive ? 'CLAIM DEAL' : 'ADD TO CART'}</span>
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Badges */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
//                 <div className="flex gap-4 p-2 justify-center rounded-xl bg-[#0f0f0f] border border-[#222]">
//                   <Truck className="w-6 h-6 text-[#d3b574]" strokeWidth={1} />
//                   <div className="flex flex-col text-left">
//                     <h4 className="text-[14px] font-semibold text-white leading-none mb-1">Free Shipping</h4>
//                     <p className="text-[12px] text-gray-500 leading-none">Premium orders</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-4 p-2 justify-center rounded-xl bg-[#0f0f0f] border border-[#222]">
//                   <ShieldCheck className="w-6 h-6 text-[#d3b574]" strokeWidth={1.5} />
//                   <div className="flex flex-col text-left">
//                     <h4 className="text-[14px] font-semibold text-white leading-none mb-1">Authentic</h4>
//                     <p className="text-[12px] text-gray-500 leading-none">Certified product</p>
//                   </div>
//                 </div>
//               </div>

//               {!expand && (
//                 <div className="group flex items-center justify-start w-full cursor-pointer py-3 gap-3" onClick={() => setExpand(true)}>
//                     <Package className="text-[#d3b574] group-hover:scale-110 transition-transform w-[18px] h-[18px]" />
//                     <span className="font-serif italic text-black group-hover:text-[#d3b574] text-[16px]">Product Overview</span>
//                     <ChevronDown className="text-gray-300 animate-bounce w-[16px] h-[16px]" />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Expanded Tabs */}
//           <div style={{ maxHeight: expand ? '5000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.5s ease-in-out' }}>
//             <div className="border-t border-gray-100 bg-white pt-10 px-4">
//               <div className="flex gap-2 md:gap-4 mb-8 max-w-2xl mx-auto overflow-x-auto pb-2 justify-center px-2">
//                 <button 
//                   onClick={() => setActiveDetailTab('overview')}
//                   className={`flex-1 min-w-[130px] md:min-w-[150px] flex items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-all ${
//                     activeDetailTab === 'overview' ? 'bg-[#0f0f0f] border-[#d3b574] text-white' : 'bg-[#f9f9f9] border-gray-100'
//                   }`}
//                 >
//                   <Package className={`w-4 h-4 md:w-5 md:h-5 ${activeDetailTab === 'overview' ? 'text-[#d3b574]' : 'text-gray-400'}`} />
//                   <div><h4 className="text-[12px] md:text-sm font-bold">Product Detail</h4></div>
//                 </button>
//                 <button 
//                   onClick={() => setActiveDetailTab('specs')}
//                   className={`flex-1 min-w-[130px] md:min-w-[150px] flex items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-all ${
//                     activeDetailTab === 'specs' ? 'bg-[#0f0f0f] border-[#d3b574] text-white' : 'bg-[#f9f9f9] border-gray-100'
//                   }`}
//                 >
//                   <Cpu className={`w-4 h-4 md:w-5 md:h-5 ${activeDetailTab === 'specs' ? 'text-[#d3b574]' : 'text-gray-400'}`} />
//                   <div><h4 className="text-[12px] md:text-sm font-bold">Specs</h4></div>
//                 </button>
//               </div>

//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
//                 {activeDetailTab === 'overview' ? (
//                   <div className="text-left mb-10 px-4 md:px-10">
//                     <h3 className="text-lg font-bold text-black mb-3">Overview</h3>
//                     <p className="text-gray-700 leading-relaxed text-[14px] mb-8 whitespace-pre-line">
//                       {fullProduct.description || "Premium quality piece designed for exceptional style and luxury."}
//                     </p>
//                     <h3 className="text-lg font-bold text-black mb-3">Product Description</h3>
//                     <ul className="list-disc pl-5 mb-8 text-gray-700 text-[14px] space-y-1">
//                       {descriptionList.map((item, idx) => (
//                         <li key={idx}>{item}</li>
//                       ))}
//                     </ul>
//                     <h3 className="text-lg font-bold text-black mb-3">Product features</h3>
//                     <p className="text-gray-700 leading-loose text-[14px] whitespace-pre-line">
//                       {featuresText}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="max-w-2xl mx-auto mb-10">
//                     <div className="border border-gray-100 rounded-[20px] overflow-hidden">
//                       {specs.map((s, i) => (
//                         <div key={i} className={`flex p-4 ${i !== specs.length - 1 ? 'border-b border-gray-50' : ''}`}>
//                           <div className="w-[40%] font-black text-gray-700 uppercase tracking-widest text-[10px]">{s.label}</div>
//                           <div className="w-[60%] text-black font-bold text-[13px]">{s.value}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 <div className="max-w-2xl mx-auto pt-10 border-t border-gray-50">
//                    <div className="bg-gray-50 rounded-[20px] p-6 border border-gray-100">
//                     <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       {boxItems.map((item, i) => (
//                         <li key={i} className="flex items-center gap-3 text-black font-bold text-[12px]">
//                           <CheckCircle className="w-4 h-4 text-[#d3b574]" /> {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               <div className="w-full flex flex-col items-center justify-center text-gray-400 hover:text-black cursor-pointer transition-all mt-16 pb-10" 
//                 onClick={() => { setExpand(false); if(modalRef.current) modalRef.current.scrollTop = 0; }}>
//                 <ChevronUp className="w-5 h-5 animate-bounce mb-2" />
//                 <p className="uppercase tracking-[0.3em] font-black text-[9px]">Close Overview</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================
//  * PRODUCT CARD (340px Width)
//  * ========================================= */
// const ProductCard = ({ product, onQuickView }) => {
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [isDealActive, setIsDealActive] = useState(false);

//   useEffect(() => {
//     if (product.flashDeal?.isActive && product.flashDeal?.endTime) {
//       const timer = setInterval(() => {
//         const distance = new Date(product.flashDeal.endTime).getTime() - Date.now();
//         if (distance > 0) {
//           setIsDealActive(true);
//           setTimeLeft({
//             h: Math.floor((distance / (1000 * 60 * 60)) % 24),
//             m: Math.floor((distance / 1000 / 60) % 60),
//             s: Math.floor((distance / 1000) % 60)
//           });
//         } else {
//           setIsDealActive(false);
//           clearInterval(timer);
//         }
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [product]);

//   // ⚡ CART LOGIC FOR CARD ⚡
//   const handleCardAddToCart = async (e) => {
//     e.stopPropagation(); // Prevents QuickView opening
//     try {
//       await axiosInstance.post('/cart/add', { productId: product._id, quantity: 1 });
      
//       // DISPATCH EVENT FOR HEADER COUNT UPDATE
//       window.dispatchEvent(new CustomEvent('cartUpdated', { 
//         detail: { increase: 1 } 
//       }));
      
//       console.log("Cart updated globally");
//     } catch (err) {
//       console.error("Error adding to cart");
//     }
//   };

//   const displayPrice = isDealActive ? product.flashDeal.dealPrice : (product.price - (product.discountPrice || 0));

//   return (
//     <div 
//       onClick={() => onQuickView(product)}
//       className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg w-full h-full cursor-pointer"
//     >    
//       <div className="relative h-[420px] bg-gray-100 overflow-hidden rounded-2xl">        
//         {isDealActive && (
//           <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[9px] font-black px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl">
//             <Zap className="w-3 h-3 fill-current" /> Lightning Deal
//           </div>
//         )}

//         <div className="absolute inset-0 p-6 transition-transform duration-1000 group-hover:scale-105">
//           <img src={getSafeImage(product)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
//         </div>

//         <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-30 opacity-100 lg:opacity-0 translate-x-0 lg:translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
//           <button className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all"><Heart size={14} /></button>
//           <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all"><Eye size={14} /></button>
//         </div>

//         <button 
//           onClick={handleCardAddToCart}
//           className={`absolute bottom-0 left-0 w-full h-11 flex items-center justify-center gap-3 text-white transition-all duration-500 z-30 lg:translate-y-full group-hover:translate-y-0 ${
//             isDealActive ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-[#d3b574] hover:text-black'
//           }`}
//         >
//           <ShoppingCart size={16} />
//           <span className="text-[10px] font-black uppercase tracking-widest">{isDealActive ? 'Claim Deal' : 'Add To Cart'}</span>
//         </button>
//       </div>

//       <div className="p-5 text-center flex flex-col items-center">
//         <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#cbb17b] mb-1">{product.brand || product.category}</p>
//         <h4 className="text-[14px] font-medium text-black mb-2 group-hover:text-[#d3b574] transition-colors truncate w-full px-2">{product.name}</h4>
        
//         <div className="flex flex-col items-center gap-1 w-full mt-1">
//           <div className="flex items-center gap-3">
//             <span className={`text-[14px] font-black ${isDealActive ? 'text-red-600' : 'text-black'}`}>{formatPrice(displayPrice)}</span>
//             {(product.discountPrice > 0 || isDealActive) && <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.price)}</span>}
//           </div>
          
//           {isDealActive && timeLeft && (
//             <div className="text-red-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
//               <Clock size={12} /> {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================
//  * MAIN EXPORT
//  * ========================================= */
// export default function App({ title = "Luxury Collection", subtitle = "2024", products = [] }) {
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     document.body.style.overflow = selectedProduct ? 'hidden' : 'unset';
//     return () => { document.body.style.overflow = 'unset'; }
//   }, [selectedProduct]);

//   if (!products || products.length === 0) return null;

//   return (
//     <section className="bg-white py-20 font-sans selection:bg-[#d3b574] selection:text-black">
//       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-12">
//           <div className="flex items-center space-x-4 mb-4">
//             <div className="w-10 h-[1px] bg-[#d3b574]"></div>
//             <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#d3b574]">Exclusively Curated</span>
//           </div>
//           <h2 className="text-4xl md:text-5xl font-serif italic text-black leading-tight">
//             {title} <span className="text-gray-300">{subtitle}</span>
//           </h2>
//         </div>

//         {/* ⚡ Flex Wrap Container with 340px Cards ⚡ */}
//         <div className="flex flex-wrap justify-center gap-6">
//           {products.map((p) => (
//             <div key={p._id || Math.random()} className="w-[340px]">
//               <ProductCard product={p} onQuickView={setSelectedProduct} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
//     </section>
//   );
// }


import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star, 
  ChevronDown, ChevronUp, Package, CheckCircle, Truck, 
  Zap, Clock, Info, Cpu 
} from 'lucide-react';

// --- LOCAL TEST MOCKS ---
const useAuth = () => ({ user: null });
const axiosInstance = {
  post: async (url, data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 800));
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
    <div className="fixed top-5 right-5 z-[999] bg-black text-[#d3b574] border border-[#d3b574] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-top-4">
      <span className="font-medium text-sm tracking-wide">{toast.message}</span>
      <button onClick={onClose} className="hover:text-white transition-colors"><X className="w-4 h-4" /></button>
    </div>
  );
};

// --- HELPERS ---
const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

const formatPrice = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const getSafeImage = (product) => {
  if (!product) return DEFAULT_IMG;
  if (product.variants?.[0]?.images?.[0]?.url) return product.variants[0].images[0].url;
  if (product.images?.[0]?.url) return product.images[0].url;
  return product.image || DEFAULT_IMG;
};

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
  }
  images = [...new Set(images.filter(Boolean))];
  return images.length > 0 ? images : [DEFAULT_IMG];
};

/* =========================================
 * QUICK VIEW MODAL
 * ========================================= */
const QuickViewModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [fullProduct, setFullProduct] = useState(product); 
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0); 
  const [expand, setExpand] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // ⚡ VARIANT SELECTION STATE ⚡
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  
  const modalRef = useRef(null);
  const thumbScrollRef = useRef(null); 
  const touchStartY = useRef(0);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isDealActive = fullProduct?.flashDeal?.isActive && new Date(fullProduct.flashDeal.endTime).getTime() > Date.now();
  const displayPrice = isDealActive ? fullProduct.flashDeal.dealPrice : (fullProduct?.price - (fullProduct?.discountPrice || 0));

  useEffect(() => {
    if (product && product._id) {
      const fetchDetails = async () => {
        setLoadingDetails(true);
        try {
          const { data } = await axiosInstance.get(`/products/${product._id}`);
          if (data?.success && data?.product) {
            setFullProduct(data.product);
          }
        } catch (e) { console.error(e); }
        setLoadingDetails(false);
      };
      fetchDetails();
    }
  }, [product]);

  const handleScrollAndSwipe = (deltaY) => {
    const scrollTop = modalRef.current?.scrollTop || 0;
    if (!expand && deltaY > 15) setExpand(true);
    else if (expand && scrollTop <= 10 && deltaY < -15) setExpand(false);
  };

  // ⚡ CART LOGIC FOR MODAL ⚡
  const handleModalAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await axiosInstance.post('/cart/add', { productId: fullProduct._id, quantity });
      
      // DISPATCH EVENT FOR HEADER
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { increase: quantity } 
      }));

      showToast('success', `${quantity} items added to your luxury cart!`);
    } catch (error) {
      showToast('error', 'Failed to add items to cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ⚡ FILTER IMAGES BASED ON SELECTED VARIANT ⚡
  const hasVariants = fullProduct?.variants?.length > 0;
  let galleryImages = [];
  if (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0) {
    galleryImages = fullProduct.variants[selectedVariantIdx].images.map(img => img.url);
  } else {
    galleryImages = getAllImages(fullProduct);
  }
  galleryImages = [...new Set(galleryImages.filter(Boolean))];
  if (galleryImages.length === 0) galleryImages = [DEFAULT_IMG];

  // ⚡ DYNAMIC DETAILS ⚡
  const descriptionList = fullProduct.details?.descriptionList || [
    "Active noise cancellation",
    "Upto 6 hours battery with quick charge feature",
    "IPX4 sweat and water resistant",
    "Magnetic buds",
    "Integrated Tile Technology to find your lost earbuds"
  ];
  
  const featuresText = fullProduct.details?.features || "The new Skullcandy Method Active Noise Cancellation will completely isolate you and your music. Listen to your music for straight 6 hours on a full charge and 1.5 hours of playback time with a 10 minutes charge. With its magnetic earbuds when you are not listening to it without dealing with tangling wires. Its has adjustable wire with the cable management clip.\n\nThe secure FitFin noise isolating fit makes sure that the earbuds fit in your ear and does not fall off. Made with premium technology with IPX4 rated water-resistant which gives protection against any type of sweat, moisture and unwanted weather changes. In-built microphone to take calls and access your smartphone assistant. You can control your music and volume with the control buttons given on the Skull candy Method ANC. It comes with an in-built tile tracker which can help you to find your earbuds if you lost them. Connect your earbuds with the app and locate them any time you want.";

  const specs = fullProduct.details?.specs || [
    { label: "Brand", value: fullProduct.brand || "Exclusive" },
    { label: "Category", value: fullProduct.category || "Luxury" },
    { label: "Material", value: "Premium Grade" }
  ];
  const boxItems = fullProduct.details?.boxItems || ["Main Unit", "Authenticity Card", "Premium Packaging"];

  return (
    <div 
      className={`fixed inset-0 z-[100] flex transition-all duration-500 ease-in-out ${expand ? 'items-start bg-white p-0' : 'items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-6'}`}
      onClick={onClose}
    >
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      <div 
        ref={modalRef}
        onWheel={(e) => handleScrollAndSwipe(e.deltaY)}
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => handleScrollAndSwipe(touchStartY.current - e.changedTouches[0].clientY)}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out hide-scroll ${
          expand ? 'w-full h-[100vh] rounded-none shadow-none px-4 md:px-10' : 'w-full max-w-[95%] md:max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-4'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', margin: '0 auto' }}
      >
        <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm transition-all z-50 cursor-pointer">
          <X className="w-5 h-5 text-gray-800" />
        </button>

        <div className={`w-full max-w-[1400px] mx-auto transition-all duration-500 ease-in-out ${expand ? 'pt-10 md:pt-16 pb-20' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
          <div className="flex flex-col md:flex-row w-full">
            {/* Left Image Side */}
            <div className="w-full md:w-[50%] bg-white flex flex-row justify-start items-center relative p-4" style={{ minHeight: '300px' }}>
              {isDealActive && (
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl">
                  <Zap className="w-3 h-3 fill-current" /> Limited Deal
                </div>
              )}

              <div className="flex flex-col items-center justify-between mr-2 md:mr-4 w-[50px] md:w-[70px] h-[260px] md:h-[320px]" style={{ flexShrink: 0 }}>
                {galleryImages.length > 1 && (
                  <button onClick={() => thumbScrollRef.current?.scrollBy({ top: -100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mb-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-full transition-all">
                    <ChevronUp className="w-5 h-5" />
                  </button>
                )}

                <div ref={thumbScrollRef} className="hide-scroll flex flex-col gap-2 md:gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1">
                  {galleryImages.map((imgSrc, idx) => (
                    <div 
                      key={idx} onMouseEnter={() => setActiveImgIdx(idx)} onClick={() => setActiveImgIdx(idx)}      
                      className={`w-full aspect-square bg-[#f9f9f9] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${activeImgIdx === idx ? 'border-[#d3b574]' : 'border-transparent'}`}
                      style={{ padding: '4px', flexShrink: 0 }}
                    >
                      <img src={imgSrc} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    </div>
                  ))}
                </div>

                {galleryImages.length > 1 && (
                  <button onClick={() => thumbScrollRef.current?.scrollBy({ top: 100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mt-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-full transition-all">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex-1 bg-[#f9f9f9] rounded-xl flex items-center justify-center p-4 md:p-6 relative overflow-hidden h-[260px] md:h-[320px]">
                 <img
                    key={activeImgIdx} src={galleryImages[activeImgIdx] || galleryImages[0]} alt={fullProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: 'transform 0.5s ease', maxHeight: '280px' }}
                    className="hover:scale-105"
                 />
              </div>
            </div>

            {/* Right Info Side */}
            <div className="w-full md:w-[50%] flex flex-col justify-start items-start text-left p-4 md:px-8">
              <p className={`text-[11px] uppercase tracking-[0.5em] font-bold ${isDealActive ? 'text-red-500' : 'text-[#d3b574]'} mb-2`}>{fullProduct.brand || fullProduct.category}</p>

              <h1 className="text-[#212121] font-medium text-[15px] md:text-[20px] mb-2 leading-snug">
                {showFullTitle ? fullProduct.name : (fullProduct.name.length > 60 ? fullProduct.name.substring(0,60) + "..." : fullProduct.name)}
                <button onClick={() => setShowFullTitle(!showFullTitle)} className="text-[#d3b574] text-[12px] ml-2 font-bold bg-transparent border-none p-0 cursor-pointer">
                  {showFullTitle ? 'less' : 'more'}
                </button>
              </h1>

              <div className="flex items-center gap-3 mb-4 flex-wrap mt-1">
                <div className="flex items-center gap-1 text-[#d3b574]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < 4 ? 'fill-current' : 'text-gray-200'} />)}
                </div>
                <span className="text-gray-500 text-xs font-medium">{fullProduct.reviews?.length || "0"} Reviews</span>
              </div>

              <div className="flex items-center justify-start flex-wrap w-full gap-2 md:gap-3 mb-6">
                <span className={`font-black tracking-tight transition-all duration-300 ${isDealActive ? 'text-red-600' : 'text-black'}`} style={{ fontSize: '24px' }}>
                  {formatPrice(displayPrice)}
                </span>
                {(fullProduct.discountPrice > 0 || isDealActive) && (
                  <span className="text-gray-400 line-through font-medium text-[15px]"> {formatPrice(fullProduct.price)} </span>
                )}
              </div>

              {/* ⚡ VARIANT SELECTOR ⚡ */}
              {hasVariants && (
                <div className="mb-6 flex items-center gap-3">
                   <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Variant:</span>
                   <div className="flex gap-2 items-center flex-wrap">
                      {fullProduct.variants.map((v, idx) => (
                         <button
                           key={idx}
                           onClick={() => { 
                             setSelectedVariantIdx(idx); 
                             setActiveImgIdx(0); 
                           }}
                           className={`w-10 h-10 rounded-md border transition-all flex items-center justify-center bg-[#f9f9f9] ${selectedVariantIdx === idx ? 'border-[#d3b574] shadow-md scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                           title={v.color || `Variant ${idx + 1}`}
                           style={{ padding: '2px' }}
                         >
                           <img 
                             src={v.images?.[0]?.url || DEFAULT_IMG} 
                             alt={v.color || `Variant ${idx + 1}`} 
                             className="w-full h-full object-contain mix-blend-multiply rounded-sm" 
                           />
                         </button>
                      ))}
                   </div>
                </div>
              )}

              {/* ⚡ RESPONSIVE ADD TO CART SECTION ⚡ */}
              <div className="flex flex-row gap-2 md:gap-3 w-full mb-6">
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 w-[110px] sm:w-28 shrink-0 h-[44px]">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">−</button>
                  <span className="font-bold text-black text-[13px]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">+</button>
                </div>
                
                <button 
                  onClick={handleModalAddToCart}
                  disabled={isAddingToCart}
                  className={`flex-1 shadow-lg active:scale-95 transition-all rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest ${
                    isDealActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#d3b574] text-black hover:bg-[#c4a66a]'
                  }`}
                  style={{ height: '44px', fontSize: '12px' }}
                >
                  {isAddingToCart ? <span>Adding...</span> : (
                    <>
                      <ShoppingBag size={16} />
                      <span className="truncate">{isDealActive ? 'CLAIM DEAL' : 'ADD TO CART'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
                <div className="flex gap-4 p-2 justify-center rounded-xl bg-[#0f0f0f] border border-[#222]">
                  <Truck className="w-6 h-6 text-[#d3b574]" strokeWidth={1} />
                  <div className="flex flex-col text-left">
                    <h4 className="text-[14px] font-semibold text-white leading-none mb-1">Free Shipping</h4>
                    <p className="text-[12px] text-gray-500 leading-none">Premium orders</p>
                  </div>
                </div>
                <div className="flex gap-4 p-2 justify-center rounded-xl bg-[#0f0f0f] border border-[#222]">
                  <ShieldCheck className="w-6 h-6 text-[#d3b574]" strokeWidth={1.5} />
                  <div className="flex flex-col text-left">
                    <h4 className="text-[14px] font-semibold text-white leading-none mb-1">Authentic</h4>
                    <p className="text-[12px] text-gray-500 leading-none">Certified product</p>
                  </div>
                </div>
              </div>

              {!expand && (
                <div className="group flex items-center justify-start w-full cursor-pointer py-3 gap-3" onClick={() => setExpand(true)}>
                    <Package className="text-[#d3b574] group-hover:scale-110 transition-transform w-[18px] h-[18px]" />
                    <span className="font-serif italic text-black group-hover:text-[#d3b574] text-[16px]">Product Overview</span>
                    <ChevronDown className="text-gray-300 animate-bounce w-[16px] h-[16px]" />
                </div>
              )}
            </div>
          </div>

          {/* Expanded Tabs */}
          <div style={{ maxHeight: expand ? '5000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.5s ease-in-out' }}>
            <div className="border-t border-gray-100 bg-white pt-10 px-4">
              <div className="flex gap-2 md:gap-4 mb-8 max-w-2xl mx-auto overflow-x-auto pb-2 justify-center px-2">
                <button 
                  onClick={() => setActiveDetailTab('overview')}
                  className={`flex-1 min-w-[130px] md:min-w-[150px] flex items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-all ${
                    activeDetailTab === 'overview' ? 'bg-[#0f0f0f] border-[#d3b574] text-white' : 'bg-[#f9f9f9] border-gray-100'
                  }`}
                >
                  <Package className={`w-4 h-4 md:w-5 md:h-5 ${activeDetailTab === 'overview' ? 'text-[#d3b574]' : 'text-gray-400'}`} />
                  <div><h4 className="text-[12px] md:text-sm font-bold">Product Detail</h4></div>
                </button>
                <button 
                  onClick={() => setActiveDetailTab('specs')}
                  className={`flex-1 min-w-[130px] md:min-w-[150px] flex items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-all ${
                    activeDetailTab === 'specs' ? 'bg-[#0f0f0f] border-[#d3b574] text-white' : 'bg-[#f9f9f9] border-gray-100'
                  }`}
                >
                  <Cpu className={`w-4 h-4 md:w-5 md:h-5 ${activeDetailTab === 'specs' ? 'text-[#d3b574]' : 'text-gray-400'}`} />
                  <div><h4 className="text-[12px] md:text-sm font-bold">Specs</h4></div>
                </button>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                {activeDetailTab === 'overview' ? (
                  <div className="text-left mb-10 px-4 md:px-10">
                    <h3 className="text-lg font-bold text-black mb-3">Overview</h3>
                    <p className="text-gray-700 leading-relaxed text-[14px] mb-8 whitespace-pre-line">
                      {fullProduct.description || "Premium quality piece designed for exceptional style and luxury."}
                    </p>
                    <h3 className="text-lg font-bold text-black mb-3">Product Description</h3>
                    <ul className="list-disc pl-5 mb-8 text-gray-700 text-[14px] space-y-1">
                      {descriptionList.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <h3 className="text-lg font-bold text-black mb-3">Product features</h3>
                    <p className="text-gray-700 leading-loose text-[14px] whitespace-pre-line">
                      {featuresText}
                    </p>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto mb-10">
                    <div className="border border-gray-100 rounded-[20px] overflow-hidden">
                      {specs.map((s, i) => (
                        <div key={i} className={`flex p-4 ${i !== specs.length - 1 ? 'border-b border-gray-50' : ''}`}>
                          <div className="w-[40%] font-black text-gray-700 uppercase tracking-widest text-[10px]">{s.label}</div>
                          <div className="w-[60%] text-black font-bold text-[13px]">{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="max-w-2xl mx-auto pt-10 border-t border-gray-50">
                   <div className="bg-gray-50 rounded-[20px] p-6 border border-gray-100">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {boxItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-black font-bold text-[12px]">
                          <CheckCircle className="w-4 h-4 text-[#d3b574]" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center justify-center text-gray-400 hover:text-black cursor-pointer transition-all mt-16 pb-10" 
                onClick={() => { setExpand(false); if(modalRef.current) modalRef.current.scrollTop = 0; }}>
                <ChevronUp className="w-5 h-5 animate-bounce mb-2" />
                <p className="uppercase tracking-[0.3em] font-black text-[9px]">Close Overview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================
 * PRODUCT CARD (340px Width)
 * ========================================= */
const ProductCard = ({ product, onQuickView }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDealActive, setIsDealActive] = useState(false);

  useEffect(() => {
    if (product.flashDeal?.isActive && product.flashDeal?.endTime) {
      const timer = setInterval(() => {
        const distance = new Date(product.flashDeal.endTime).getTime() - Date.now();
        if (distance > 0) {
          setIsDealActive(true);
          setTimeLeft({
            h: Math.floor((distance / (1000 * 60 * 60)) % 24),
            m: Math.floor((distance / 1000 / 60) % 60),
            s: Math.floor((distance / 1000) % 60)
          });
        } else {
          setIsDealActive(false);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [product]);

  // ⚡ CART LOGIC FOR CARD ⚡
  const handleCardAddToCart = async (e) => {
    e.stopPropagation(); // Prevents QuickView opening
    try {
      await axiosInstance.post('/cart/add', { productId: product._id, quantity: 1 });
      
      // DISPATCH EVENT FOR HEADER COUNT UPDATE
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { increase: 1 } 
      }));
      
      console.log("Cart updated globally");
    } catch (err) {
      console.error("Error adding to cart");
    }
  };

  const displayPrice = isDealActive ? product.flashDeal.dealPrice : (product.price - (product.discountPrice || 0));

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg w-full h-full cursor-pointer"
    >    
      <div className="relative h-[420px] bg-gray-100 overflow-hidden rounded-2xl">        
        {isDealActive && (
          <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[9px] font-black px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl">
            <Zap className="w-3 h-3 fill-current" /> Lightning Deal
          </div>
        )}

        <div className="absolute inset-0 p-6 transition-transform duration-1000 group-hover:scale-105">
          <img src={getSafeImage(product)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-30 opacity-100 lg:opacity-0 translate-x-0 lg:translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
          <button className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all"><Heart size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-black hover:text-white transition-all"><Eye size={14} /></button>
        </div>

        <button 
          onClick={handleCardAddToCart}
          className={`absolute bottom-0 left-0 w-full h-11 flex items-center justify-center gap-3 text-white transition-all duration-500 z-30 lg:translate-y-full group-hover:translate-y-0 ${
            isDealActive ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-[#d3b574] hover:text-black'
          }`}
        >
          <ShoppingCart size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{isDealActive ? 'Claim Deal' : 'Add To Cart'}</span>
        </button>
      </div>

      <div className="p-5 text-center flex flex-col items-center">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-[#cbb17b] mb-1">{product.brand || product.category}</p>
        <h4 className="text-[14px] font-medium text-black mb-2 group-hover:text-[#d3b574] transition-colors truncate w-full px-2">{product.name}</h4>
        
        <div className="flex flex-col items-center gap-1 w-full mt-1">
          <div className="flex items-center gap-3">
            <span className={`text-[14px] font-black ${isDealActive ? 'text-red-600' : 'text-black'}`}>{formatPrice(displayPrice)}</span>
            {(product.discountPrice > 0 || isDealActive) && <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.price)}</span>}
          </div>
          
          {isDealActive && timeLeft && (
            <div className="text-red-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              <Clock size={12} /> {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================
 * MAIN EXPORT
 * ========================================= */
export default function App({ title = "Luxury Collection", subtitle = "2024", products = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedProduct]);

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-20 font-sans selection:bg-[#d3b574] selection:text-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-[1px] bg-[#d3b574]"></div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#d3b574]">Exclusively Curated</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-black leading-tight">
            {title} <span className="text-gray-300">{subtitle}</span>
          </h2>
        </div>

        {/* ⚡ Flex Wrap Container with 340px Cards ⚡ */}
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((p) => (
            <div key={p._id || Math.random()} className="w-[340px]">
              <ProductCard product={p} onQuickView={setSelectedProduct} />
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}