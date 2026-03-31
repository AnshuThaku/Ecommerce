// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star, ChevronDown, ChevronUp, Package, CheckCircle, Truck, Zap, Clock, Cpu } from 'lucide-react';

// // Basic mocks 
// const useAuth = () => ({ user: null });
// const axiosInstance = {
//   post: async (url, data) => new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 800)),
//   get: async (url) => new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, product: null, products: [] } }), 500))
// };

// const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

// const formatPrice = (amount) => {
//   if (!amount) return '';
//   return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
// };

// const getAllImages = (product) => {
//   if (!product) return [DEFAULT_IMG];
//   let images = [];
//   if (product.images?.length > 0) images.push(...product.images.map(img => img.url));
//   else if (product.image) {
//     images.push(product.image);
//     if (product.hoverImage) images.push(product.hoverImage);
//   }
//   if (product.variants?.length > 0) {
//     product.variants.forEach(variant => {
//       if (variant.images?.length > 0) images.push(...variant.images.map(img => img.url));
//     });
//   }
//   images = [...new Set(images.filter(Boolean))];
//   return images.length > 0 ? images : [DEFAULT_IMG];
// };

// const Toast = ({ toast, onClose }) => {
//   if (!toast) return null;
//   return (
//     <div className="fixed top-5 right-5 z-[999999] bg-black text-white border border-theme-primary px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-top-4">
//       <span className="font-medium text-sm tracking-wide">{toast.message}</span>
//       <button onClick={onClose} className="hover:text-white transition-colors"><X className="w-4 h-4" /></button>
//     </div>
//   );
// };

// export default function QuickViewModal({ product, onClose }) {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [fullProduct, setFullProduct] = useState(product);
//   const [activeImgIdx, setActiveImgIdx] = useState(0);
//   const [expand, setExpand] = useState(false);
//   const [showFullTitle, setShowFullTitle] = useState(false);
//   const [activeDetailTab, setActiveDetailTab] = useState('overview');
//   const [quantity, setQuantity] = useState(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

//   const modalRef = useRef(null);
//   const thumbScrollRef = useRef(null);

//   useEffect(() => {
//     document.body.style.overflow = 'hidden';
//     return () => { document.body.style.overflow = 'unset'; };
//   }, []);

//   const showToast = (type, message) => {
//     setToastMessage({ type, message });
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   const isDealActive = fullProduct?.flashDeal?.isActive && new Date(fullProduct.flashDeal.endTime).getTime() > Date.now();
//   const displayPrice = isDealActive ? fullProduct.flashDeal.dealPrice : (fullProduct?.price - (fullProduct?.discountPrice || 0));

//   useEffect(() => {
//     if (product && product._id) {
//       const fetchDetails = async () => {
//         try {
//           const { data } = await axiosInstance.get(`/products/${product._id}`);
//           if (data?.success && data?.product) setFullProduct(data.product);
//         } catch (e) { console.error(e); }
//       };
//       fetchDetails();
//     }
//   }, [product]);

//   const handleScrollAndSwipe = (deltaY) => {
//     const scrollTop = modalRef.current?.scrollTop || 0;
//     if (!expand && deltaY > 15) setExpand(true);
//     else if (expand && scrollTop <= 5 && deltaY < -15) setExpand(false);
//   };

//   const handleModalAddToCart = async () => {
//     setIsAddingToCart(true);
//     try {
//       await axiosInstance.post('/cart/add', { productId: fullProduct._id, quantity });
//       window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { increase: quantity } }));
//       showToast('success', `${quantity} items added to your luxury cart!`);
//     } catch (error) {
//       showToast('error', 'Failed to add items to cart.');
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   const hasVariants = fullProduct?.variants?.length > 0;
//   let galleryImages = (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0)
//     ? fullProduct.variants[selectedVariantIdx].images.map(img => img.url)
//     : getAllImages(fullProduct);
//   galleryImages = [...new Set(galleryImages.filter(Boolean))];
//   if (galleryImages.length === 0) galleryImages = [DEFAULT_IMG];

//   const descriptionList = fullProduct?.details?.descriptionList || ["Premium sound quality", "6 hours battery life", "Sweat and water resistant", "Ergonomic fit"];
//   const featuresText = fullProduct?.details?.features || "Experience premium audio quality with our latest collection.";
//   const specs = fullProduct?.details?.specs || [{ label: "Brand", value: fullProduct?.brand || "Exclusive" }, { label: "Category", value: fullProduct?.category || "Luxury" }];

//   return (
//     <div className={`fixed inset-0 z-[99999] flex transition-all duration-500 ease-in-out ${expand ? 'bg-white items-start p-0' : 'bg-black/70 backdrop-blur-sm items-center justify-center p-4'}`} onClick={onClose}>
//       <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
//       <div 
//         ref={modalRef} 
//         onWheel={(e) => handleScrollAndSwipe(e.deltaY)} 
//         onScroll={(e) => { if(e.target.scrollTop > 10 && !expand) setExpand(true); }}
//         onClick={(e) => e.stopPropagation()} 
//         className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out hide-scroll transform-gpu ${expand ? 'w-full h-full rounded-none px-6 md:px-12' : 'w-full max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-6 pb-6 pt-2 md:pt-4'}`}
//         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
//       >
//         <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-50 hover:bg-gray-100 shadow-sm z-[100] cursor-pointer transition-all"><X className="w-5 h-5 text-gray-800" /></button>
        
//         <div className={`w-full max-w-[1300px] mx-auto transition-all duration-500 ${expand ? 'pt-20 md:pt-28 pb-20' : 'pt-8 pb-4'}`}>
//           <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8">
            
//             {/* Image Gallery */}
//             <div className="w-full md:w-[48%] flex flex-row justify-start items-center relative" style={{ minHeight: '300px' }}>
//               <div className="flex flex-col items-center justify-between mr-3 w-[60px] md:w-[70px] h-[260px] md:h-[320px]">
//                 <button onClick={() => thumbScrollRef.current?.scrollBy({ top: -100, behavior: 'smooth' })} className="p-1 mb-1 bg-gray-50 rounded-full hover:bg-gray-100"><ChevronUp className="w-4 h-4 text-gray-400" /></button>
//                 <div ref={thumbScrollRef} className="hide-scroll flex flex-col gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1">
//                   {galleryImages.map((imgSrc, idx) => (
//                     <div key={idx} onMouseEnter={() => setActiveImgIdx(idx)} className={`w-full aspect-square bg-[#f9f9f9] rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 ${activeImgIdx === idx ? 'border-theme-primary' : 'border-transparent'}`} style={{ padding: '4px' }}>
//                       <img src={imgSrc} alt="thumb" className="w-full h-full object-contain mix-blend-multiply" />
//                     </div>
//                   ))}
//                 </div>
//                 <button onClick={() => thumbScrollRef.current?.scrollBy({ top: 100, behavior: 'smooth' })} className="p-1 mt-1 bg-gray-50 rounded-full hover:bg-gray-100"><ChevronDown className="w-4 h-4 text-gray-400" /></button>
//               </div>

//               <div className="flex-1 bg-white flex items-center justify-center p-4 relative h-[260px] md:h-[320px]">
//                 {isDealActive && <div className="absolute top-0 left-0 z-10 bg-red-600 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm"><Zap className="w-3 h-3 inline fill-current mr-1" /> Limited Deal</div>}
//                 <img src={galleryImages[activeImgIdx]} alt="main" className="max-h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105" />
//               </div>
//             </div>

//             {/* Product Info */}
//             <div className="w-full md:w-[52%] flex flex-col items-start text-left md:pl-4">
//               <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-theme-primary mb-1">{fullProduct?.brand || 'JBL'}</p>
//               <h1 className="text-gray-900 font-semibold text-[20px] md:text-[26px] leading-tight mb-2">
//                 {showFullTitle ? fullProduct?.name : (fullProduct?.name?.length > 60 ? fullProduct?.name?.substring(0, 60) + "..." : fullProduct?.name)}
//                 <button onClick={() => setShowFullTitle(!showFullTitle)} className="text-theme-primary text-[11px] ml-2 font-bold hover:underline underline-offset-4">{showFullTitle ? 'less' : 'more'}</button>
//               </h1>
              
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="flex text-theme-primary">{[...Array(5)].map((_, i) => <Star key={i} size={13} className={i < 4 ? 'fill-current' : 'text-gray-200'} />)}</div>
//                 <span className="text-gray-400 text-[11px] font-medium">{fullProduct?.reviews?.length || "0"} Reviews</span>
//               </div>

//               <div className="flex items-center gap-3 mb-6">
//                 <span className="font-black text-[28px] text-gray-900">{formatPrice(displayPrice)}</span>
//                 <span className="text-gray-300 line-through text-[16px]">{formatPrice(fullProduct?.price)}</span>
//               </div>
              
//               {hasVariants && (
//                 <div className="mb-6 space-y-2">
//                   <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Variant:</span>
//                   <div className="flex gap-2 flex-wrap">
//                     {fullProduct.variants.map((v, idx) => (
//                       <button key={idx} onClick={() => { setSelectedVariantIdx(idx); setActiveImgIdx(0); }} className={`w-10 h-10 rounded-lg border-2 transition-all p-1 ${selectedVariantIdx === idx ? 'border-theme-primary shadow-sm' : 'border-gray-100 bg-[#f9f9f9]'}`}>
//                         <img src={v.images?.[0]?.url || DEFAULT_IMG} className="w-full h-full object-contain mix-blend-multiply" alt="v" />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ACTION BUTTONS (FIXED TEXT DISPLAY) */}
//               <div className="flex flex-row gap-3 w-full mb-6">
//                 <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 w-28 shrink-0 h-[46px]">
//                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-theme-primary font-bold">−</button>
//                   <span className="font-bold text-gray-900 text-sm">{quantity}</span>
//                   <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-theme-primary font-bold">+</button>
//                 </div>
                
//                 <button 
//                   onClick={handleModalAddToCart} 
//                   disabled={isAddingToCart} 
//                   className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 px-6 ${isDealActive ? 'bg-red-600 text-white' : 'bg-theme-primary text-white'}`}
//                   style={{ height: '46px', fontSize: '12px' }}
//                 >
//                   <ShoppingBag size={18} />
//                   <span className="whitespace-nowrap">{isAddingToCart ? 'Adding...' : 'ADD TO CART'}</span>
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 gap-3 w-full mb-4">
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
//                   <Truck className="w-5 h-5 text-theme-primary" />
//                   <div className="flex flex-col text-left"><h4 className="text-[12px] font-bold text-gray-800 leading-none">Free Shipping</h4><p className="text-[10px] text-gray-400">Premium orders</p></div>
//                 </div>
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
//                   <ShieldCheck className="w-5 h-5 text-theme-primary" />
//                   <div className="flex flex-col text-left"><h4 className="text-[12px] font-bold text-gray-800 leading-none">Authentic</h4><p className="text-[10px] text-gray-400">Certified product</p></div>
//                 </div>
//               </div>

//               {!expand && (
//                 <div className="w-full flex items-center justify-center pt-2 cursor-pointer group" onClick={() => setExpand(true)}>
//                   <div className="flex items-center gap-2 text-gray-400 group-hover:text-theme-primary transition-all">
//                     <Package size={16} />
//                     <span className="text-[13px] font-medium">View Full Details</span>
//                     <ChevronDown size={16} className="animate-bounce" />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Details Section (Expansion) */}
//           <div style={{ maxHeight: expand ? '2000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.6s ease' }}>
//             <div className="mt-16 w-full max-w-3xl mx-auto">
//               <div className="flex justify-center gap-8 border-b border-gray-100 mb-8">
//                 {['overview', 'specs'].map(tab => (
//                   <button key={tab} onClick={() => setActiveDetailTab(tab)} className={`pb-3 text-xs font-bold uppercase tracking-widest relative transition-all ${activeDetailTab === tab ? 'text-gray-900' : 'text-gray-400'}`}>
//                     {tab === 'overview' ? 'Description' : 'Specifications'}
//                     {activeDetailTab === tab && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-theme-primary" />}
//                   </button>
//                 ))}
//               </div>
              
//               <div className="min-h-[200px] px-2">
//                 {activeDetailTab === 'overview' ? (
//                   <div className="text-center space-y-6">
//                     <p className="text-gray-600 text-sm leading-relaxed">{featuresText}</p>
//                     <ul className="text-left inline-block space-y-3 marker:text-theme-primary list-disc pl-5">
//                       {descriptionList.map((d, i) => <li key={i} className="text-gray-600 text-sm">{d}</li>)}
//                     </ul>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {specs.map((s, i) => (
//                       <div key={i} className="flex justify-between py-3 border-b border-gray-50 text-sm">
//                         <span className="text-gray-400 font-medium">{s.label}</span>
//                         <span className="text-gray-900 font-bold">{s.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="py-12 flex flex-col items-center justify-center text-gray-300 hover:text-theme-primary cursor-pointer transition-all" onClick={() => { setExpand(false); modalRef.current.scrollTo({top: 0, behavior: 'smooth'}); }}>
//               <ChevronUp className="animate-bounce mb-2" />
//               <p className="text-[9px] uppercase font-black tracking-widest">Close Overview</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star, ChevronDown, ChevronUp, Package, CheckCircle, Truck, Zap, Clock, Cpu } from 'lucide-react';
// Corrected Path (Double check if it's ../hooks or ../../hooks)
import { useServerTheme } from '../../hooks/useServerTheme'; 

// --- FIXED: Added missing useAuth mock ---
const useAuth = () => ({ user: null });

// Basic mocks 
const axiosInstance = {
  post: async (url, data) => new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 800)),
  get: async (url) => new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, product: null, products: [] } }), 500))
};

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

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div className="fixed top-5 right-5 z-[999999] bg-black text-white border border-theme-primary px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-top-4">
      <span className="font-medium text-sm tracking-wide">{toast.message}</span>
      <button onClick={onClose} className="hover:text-white transition-colors"><X className="w-4 h-4" /></button>
    </div>
  );
};

export default function QuickViewModal({ product, onClose }) {
  // 1. Theme Hook Integrated
  const theme = useServerTheme(); 
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullProduct, setFullProduct] = useState(product);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [expand, setExpand] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const modalRef = useRef(null);
  const thumbScrollRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isDealActive = fullProduct?.flashDeal?.isActive && new Date(fullProduct.flashDeal.endTime).getTime() > Date.now();
  const displayPrice = isDealActive ? fullProduct.flashDeal.dealPrice : (fullProduct?.price - (fullProduct?.discountPrice || 0));

  useEffect(() => {
    if (product && product._id) {
      const fetchDetails = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${product._id}`);
          if (data?.success && data?.product) setFullProduct(data.product);
        } catch (e) { console.error(e); }
      };
      fetchDetails();
    }
  }, [product]);

  // --- Original Scroll Logic Preserved ---
  const handleScrollAndSwipe = (deltaY) => {
    const scrollTop = modalRef.current?.scrollTop || 0;
    if (!expand && deltaY > 15) setExpand(true);
    else if (expand && scrollTop <= 5 && deltaY < -15) setExpand(false);
  };

  const handleModalAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await axiosInstance.post('/cart/add', { productId: fullProduct._id, quantity });
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { increase: quantity } }));
      showToast('success', `${quantity} items added to your luxury cart!`);
    } catch (error) {
      showToast('error', 'Failed to add items to cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const hasVariants = fullProduct?.variants?.length > 0;
  let galleryImages = (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0)
    ? fullProduct.variants[selectedVariantIdx].images.map(img => img.url)
    : getAllImages(fullProduct);
  galleryImages = [...new Set(galleryImages.filter(Boolean))];
  if (galleryImages.length === 0) galleryImages = [DEFAULT_IMG];

  const descriptionList = fullProduct?.details?.descriptionList || ["Premium sound quality", "6 hours battery life", "Sweat and water resistant", "Ergonomic fit"];
  const featuresText = fullProduct?.details?.features || "Experience premium audio quality with our latest collection.";
  const specs = fullProduct?.details?.specs || [{ label: "Brand", value: fullProduct?.brand || "Exclusive" }, { label: "Category", value: fullProduct?.category || "Luxury" }];

  return (
    <div className={`fixed inset-0 z-[99999]    cursor-pointer  flex transition-all duration-500 ease-in-out ${expand ? 'bg-white items-start p-0' : 'bg-black/70 backdrop-blur-sm items-center justify-center p-4'}`} onClick={onClose}>
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      <div 
        ref={modalRef} 
        onWheel={(e) => handleScrollAndSwipe(e.deltaY)} 
        onScroll={(e) => { if(e.target.scrollTop > 10 && !expand) setExpand(true); }}
        onClick={(e) => e.stopPropagation()} 
        className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out hide-scroll transform-gpu ${expand ? 'w-full h-full rounded-none px-6 md:px-12' : 'w-full max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-6 pb-8 pt-2 md:pt-4'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', backgroundColor: 'var(--theme-bg-light)' }}
      >
        <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-50 hover:bg-gray-100 shadow-sm z-[100] cursor-pointer transition-all"><X className="w-5 h-5 text-gray-800" /></button>
        
        <div className={`w-full max-w-[1300px] mx-auto transition-all duration-500 ${expand ? 'pt-20 md:pt-28 pb-20' : 'pt-8 pb-4'}`}>
          
          {/* Theme Greeting Banner */}
          <div className="mb-6 text-center animate-pulse">
             <span className="text-[12px] font-bold tracking-[0.2em] px-4 py-1 rounded-full border" style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' }}>
                {theme?.greeting || "Exclusive Product"}
             </span>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8 items-start">
            
            {/* Image Gallery */}
            <div className="w-full md:w-[48%] flex flex-row justify-start items-center relative min-h-[300px]">
              <div className="flex flex-col items-center justify-between mr-3 w-[60px] md:w-[70px] h-[260px] md:h-[320px]">
                <button onClick={() => thumbScrollRef.current?.scrollBy({ top: -100, behavior: 'smooth' })} className="p-1 mb-1 bg-gray-50 rounded-full hover:bg-gray-100"><ChevronUp className="w-4 h-4 text-gray-400" /></button>
                <div ref={thumbScrollRef} className="hide-scroll flex flex-col gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1">
                  {galleryImages.map((imgSrc, idx) => (
                    <div key={idx} onMouseEnter={() => setActiveImgIdx(idx)} className={`w-full aspect-square bg-white rounded-xl flex items-center justify-center cursor-pointer transition-all border-2`} style={{ padding: '4px', borderColor: activeImgIdx === idx ? 'var(--theme-primary)' : 'transparent' }}>
                      <img src={imgSrc} alt="thumb" className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                  ))}
                </div>
                <button onClick={() => thumbScrollRef.current?.scrollBy({ top: 100, behavior: 'smooth' })} className="p-1 mt-1 bg-gray-50 rounded-full hover:bg-gray-100"><ChevronDown className="w-4 h-4 text-gray-400" /></button>
              </div>

              <div className="flex-1 rounded-2xl flex items-center justify-center p-4 relative h-[260px] md:h-[320px]" style={{ background: 'var(--theme-gradient)' }}>
                {isDealActive && <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm"><Zap className="w-3 h-3 inline fill-current mr-1" /> Limited Deal</div>}
                <img src={galleryImages[activeImgIdx]} alt="main" className="max-h-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105" />
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-[52%] flex flex-col items-start text-left md:pl-4 min-h-full">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-1" style={{ color: 'var(--theme-primary)' }}>{fullProduct?.brand || 'Premium'}</p>
              <h1 className="text-gray-900 font-semibold text-[20px] md:text-[26px] leading-tight mb-2">
                {showFullTitle ? fullProduct?.name : (fullProduct?.name?.length > 60 ? fullProduct?.name?.substring(0, 60) + "..." : fullProduct?.name)}
                <button onClick={() => setShowFullTitle(!showFullTitle)} className="text-[11px] ml-2 font-bold hover:underline underline-offset-4" style={{ color: 'var(--theme-primary)' }}>{showFullTitle ? 'less' : 'more'}</button>
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex" style={{ color: 'var(--theme-primary)' }}>{[...Array(5)].map((_, i) => <Star key={i} size={13} className={i < 4 ? 'fill-current' : 'text-gray-200'} />)}</div>
                <span className="text-gray-400 text-[11px] font-medium">{fullProduct?.reviews?.length || "0"} Reviews</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-black text-[28px] text-gray-900">{formatPrice(displayPrice)}</span>
                <span className="text-gray-300 line-through text-[16px]">{formatPrice(fullProduct?.price)}</span>
              </div>
              
              {hasVariants && (
                <div className="mb-6 space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Variant:</span>
                  <div className="flex gap-2 flex-wrap">
                    {fullProduct.variants.map((v, idx) => (
                      <button key={idx} onClick={() => { setSelectedVariantIdx(idx); setActiveImgIdx(0); }} 
                              className={`w-10 h-10 rounded-lg border-2 transition-all p-1`}
                              style={{ borderColor: selectedVariantIdx === idx ? 'var(--theme-primary)' : '#f3f4f6', backgroundColor: '#fff' }}>
                        <img src={v.images?.[0]?.url || DEFAULT_IMG} className="w-full h-full object-contain mix-blend-multiply" alt="v" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex flex-row gap-3 w-full mb-8 relative z-20">
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 w-28 shrink-0 h-[50px]">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black font-bold px-2">−</button>
                  <span className="font-bold text-gray-900 text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black font-bold px-2">+</button>
                </div>
                
                <button 
                  onClick={handleModalAddToCart} 
                  disabled={isAddingToCart} 
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 px-6 ${isDealActive ? 'bg-red-600' : 'bg-black'} text-white hover:opacity-90`}
                  style={{ height: '50px', fontSize: '12px', backgroundColor: isDealActive ? '#dc2626' : 'var(--theme-bg-dark)' }}
                >
                  <ShoppingBag size={18} />
                  <span className="whitespace-nowrap">{isAddingToCart ? 'Adding...' : 'ADD TO CART'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-100">
                  <Truck className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  <div className="flex flex-col text-left"><h4 className="text-[12px] font-bold text-gray-800 leading-none">Free Shipping</h4><p className="text-[10px] text-gray-400">Premium orders</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                  <div className="flex flex-col text-left"><h4 className="text-[12px] font-bold text-gray-800 leading-none">Authentic</h4><p className="text-[10px] text-gray-400">Certified product</p></div>
                </div>
              </div>

              {!expand && (
                <div className="w-full flex items-center justify-center pt-2 cursor-pointer group" onClick={() => setExpand(true)}>
                  <div className="flex items-center gap-2 text-gray-400 group-hover:opacity-70 transition-all" style={{ color: 'var(--theme-primary)' }}>
                    <Package size={16} />
                    <span className="text-[13px] font-medium">View Full Details</span>
                    <ChevronDown size={16} className="animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Section (Expansion) - This was the missing scrollable content */}
          <div style={{ maxHeight: expand ? '2000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.6s ease' }}>
            <div className="mt-16 w-full max-w-3xl mx-auto">
              <div className="flex justify-center gap-8 border-b border-gray-100 mb-8">
                {['overview', 'specs'].map(tab => (
                  <button key={tab} onClick={() => setActiveDetailTab(tab)} className={`pb-3 text-xs font-bold uppercase tracking-widest relative transition-all ${activeDetailTab === tab ? 'text-gray-900' : 'text-gray-400'}`}>
                    {tab === 'overview' ? 'Description' : 'Specifications'}
                    {activeDetailTab === tab && <div className="absolute bottom-[-1px] left-0 w-full h-[2px]" style={{ backgroundColor: 'var(--theme-primary)' }} />}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[200px] px-2">
                {activeDetailTab === 'overview' ? (
                  <div className="text-center space-y-6">
                    <p className="text-gray-600 text-sm leading-relaxed">{featuresText}</p>
                    <ul className="text-left inline-block space-y-3 marker:text-theme-primary list-disc pl-5">
                      {descriptionList.map((d, i) => <li key={i} className="text-gray-600 text-sm" style={{ color: 'var(--theme-text-main)' }}>{d}</li>)}
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {specs.map((s, i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-gray-50 text-sm">
                        <span className="text-gray-400 font-medium">{s.label}</span>
                        <span className="text-gray-900 font-bold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="py-12 flex flex-col items-center justify-center text-gray-300 hover:opacity-70 cursor-pointer transition-all" onClick={() => { setExpand(false); modalRef.current.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <ChevronUp className="animate-bounce mb-2" style={{ color: 'var(--theme-primary)' }} />
              <p className="text-[9px] uppercase font-black tracking-widest" style={{ color: 'var(--theme-primary)' }}>Close Overview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}