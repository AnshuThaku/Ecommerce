
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star, ChevronDown, ChevronUp, Package, CheckCircle, Truck, Zap, Clock, Cpu } from 'lucide-react';

// Basic mocks if needed
const useAuth = () => ({ user: null });
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
    <div className="fixed top-5 right-5 z-[99999] bg-black text-[#d3b574] border border-[#d3b574] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-top-4">
      <span className="font-medium text-sm tracking-wide">{toast.message}</span>
      <button onClick={onClose} className="hover:text-white transition-colors"><X className="w-4 h-4" /></button>
    </div>
  );
};

export default function QuickViewModal({ product, onClose }) {
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
          if (data?.success && data?.product) setFullProduct(data.product);
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
  let galleryImages = [];
  if (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0) {
    galleryImages = fullProduct.variants[selectedVariantIdx].images.map(img => img.url);
  } else {
    galleryImages = getAllImages(fullProduct);
  }
  galleryImages = [...new Set(galleryImages.filter(Boolean))];
  if (galleryImages.length === 0) galleryImages = [DEFAULT_IMG];

  const descriptionList = fullProduct?.details?.descriptionList || [
    "Active noise cancellation",
    "Upto 6 hours battery with quick charge feature",
    "IPX4 sweat and water resistant",
    "Magnetic buds"
  ];
  const featuresText = fullProduct?.details?.features || "Premium quality piece designed for exceptional style and luxury.";
  const specs = fullProduct?.details?.specs || [
    { label: "Brand", value: fullProduct?.brand || "Exclusive" },
    { label: "Category", value: fullProduct?.category || "Luxury" },
    { label: "Material", value: "Premium Grade" }
  ];
  const boxItems = fullProduct?.details?.boxItems || ["Main Unit", "Authenticity Card", "Premium Packaging"];

  return (
    <div className={`fixed inset-0 z-[99999] flex transition-all duration-500 ease-in-out ${expand ? 'items-start bg-white p-0' : 'items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-6'}`} onClick={onClose}>
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      <div ref={modalRef} onWheel={(e) => handleScrollAndSwipe(e.deltaY)} onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }} onTouchEnd={(e) => handleScrollAndSwipe(touchStartY.current - e.changedTouches[0].clientY)} onClick={(e) => e.stopPropagation()} className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out hide-scroll transform-gpu ${expand ? 'w-full h-[100vh] rounded-none shadow-none px-4 md:px-10' : 'w-full max-w-[95%] md:max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-4'}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', margin: '0 auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm transition-all z-50 cursor-pointer"><X className="w-5 h-5 text-gray-800" /></button>
        
        <div className={`w-full max-w-[1400px] mx-auto transition-all duration-500 ease-in-out ${expand ? 'pt-10 md:pt-16 pb-20' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
          <div className="flex flex-col md:flex-row w-full" style={{ position: 'static' }}>
            {/* Image Section */}
            <div className="w-full md:w-[50%] bg-white flex flex-row justify-start items-center relative p-4" style={{ minHeight: '300px' }}>
              {isDealActive && (
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl"><Zap className="w-3 h-3 fill-current" /> Limited Deal</div>
              )}
              <div className="flex flex-col items-center justify-between mr-2 md:mr-4 w-[50px] md:w-[70px] h-[260px] md:h-[320px]" style={{ flexShrink: 0 }}>
                {galleryImages.length > 1 && (<button onClick={() => thumbScrollRef.current?.scrollBy({ top: -100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mb-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-full transition-all"><ChevronUp className="w-5 h-5" /></button>)}
                <div ref={thumbScrollRef} className="hide-scroll flex flex-col gap-2 md:gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
                  {galleryImages.map((imgSrc, idx) => (
                    <div key={idx} onMouseEnter={() => setActiveImgIdx(idx)} onClick={() => setActiveImgIdx(idx)} className={`w-full aspect-square bg-[#f9f9f9] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${activeImgIdx === idx ? 'border-[#d3b574]' : 'border-transparent'}`} style={{ padding: '4px', flexShrink: 0 }}>
                      <img src={imgSrc} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    </div>
                  ))}
                </div>
                {galleryImages.length > 1 && (<button onClick={() => thumbScrollRef.current?.scrollBy({ top: 100, behavior: 'smooth' })} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mt-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-full transition-all"><ChevronDown className="w-5 h-5" /></button>)}
              </div>
              <div className="flex-1 bg-[#f9f9f9] rounded-xl flex items-center justify-center p-4 md:p-6 relative overflow-hidden h-[260px] md:h-[320px]">
                <img key={activeImgIdx} src={galleryImages[activeImgIdx] || galleryImages[0]} alt={fullProduct?.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: 'transform 0.5s ease', maxHeight: '280px' }} className="hover:scale-105" />
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-[50%] flex flex-col justify-start items-start text-left p-4 md:px-8" style={{ position: 'static' }}>
              {/* Force absolute static unsticky behavior using inline styles */}
              <p className={`text-[11px] uppercase tracking-[0.5em] font-bold ${isDealActive ? 'text-red-500' : 'text-[#d3b574]'} mb-2`} style={{ position: 'static', top: 'unset', transform: 'none' }}>
                {fullProduct?.brand || fullProduct?.category}
              </p>
              <h1 className="text-[#212121] font-medium text-[15px] md:text-[20px] mb-2 leading-snug" style={{ position: 'static', top: 'unset', transform: 'none' }}>
                {showFullTitle ? fullProduct?.name : (fullProduct?.name?.length > 60 ? fullProduct?.name?.substring(0, 60) + "..." : fullProduct?.name)}
                <button onClick={() => setShowFullTitle(!showFullTitle)} className="text-[#d3b574] text-[12px] ml-2 font-bold bg-transparent border-none p-0 cursor-pointer">{showFullTitle ? 'less' : 'more'}</button>
              </h1>
              
              <div className="flex items-center gap-3 mb-4 flex-wrap mt-1">
                <div className="flex items-center gap-1 text-[#d3b574]">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < 4 ? 'fill-current' : 'text-gray-200'} />)}</div>
                <span className="text-gray-500 text-xs font-medium">{fullProduct?.reviews?.length || "0"} Reviews</span>
              </div>
              <div className="flex items-center justify-start flex-wrap w-full gap-2 md:gap-3 mb-6">
                <span className={`font-black tracking-tight transition-all duration-300 ${isDealActive ? 'text-red-600' : 'text-black'}`} style={{ fontSize: '24px' }}>{formatPrice(displayPrice)}</span>
                {(fullProduct?.discountPrice > 0 || isDealActive) && (<span className="text-gray-400 line-through font-medium text-[15px]"> {formatPrice(fullProduct.price)} </span>)}
              </div>
              
              {hasVariants && (
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Variant:</span>
                  <div className="flex gap-2 items-center flex-wrap">
                    {fullProduct.variants.map((v, idx) => (
                      <button key={idx} onClick={() => { setSelectedVariantIdx(idx); setActiveImgIdx(0); }} className={`w-10 h-10 rounded-md border transition-all flex items-center justify-center bg-[#f9f9f9] ${selectedVariantIdx === idx ? 'border-[#d3b574] shadow-md scale-110' : 'border-gray-200 hover:border-gray-400'}`} title={v.color || `Variant ${idx + 1}`} style={{ padding: '2px' }}>
                        <img src={v.images?.[0]?.url || DEFAULT_IMG} alt={v.color || `Variant ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply rounded-sm" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-row gap-2 md:gap-3 w-full mb-6">
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 w-[110px] sm:w-28 shrink-0 h-[44px]">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">−</button>
                  <span className="font-bold text-black text-[13px]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-[#d3b574] text-lg font-medium">+</button>
                </div>
                <button onClick={handleModalAddToCart} disabled={isAddingToCart} className={`flex-1 max-w-[350px] shadow-lg active:scale-95 transition-all rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest ${isDealActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#d3b574] text-black hover:bg-[#c4a66a]'}`} style={{ height: '44px', fontSize: '12px' }}>
                  {isAddingToCart ? <span>Adding...</span> : (<><ShoppingBag size={16} /><span className="truncate">{isDealActive ? 'CLAIM DEAL' : 'ADD TO CART'}</span></>)}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
                <div className="flex gap-4 p-2 justify-center rounded-xl bg-[#0f0f0f] border border-[#222]">
                  <Truck className="w-6 h-6 text-[#d3b574]" strokeWidth={1} />
                  <div className="flex flex-col text-left"><h4 className="text-[14px] font-semibold text-white leading-none mb-1">Free Shipping</h4><p className="text-[12px] text-gray-500 leading-none">Premium orders</p></div>
                </div>
                <div className="flex gap-4 p-2 justify-center rounded-xl bg-[#0f0f0f] border border-[#222]">
                  <ShieldCheck className="w-6 h-6 text-[#d3b574]" strokeWidth={1.5} />
                  <div className="flex flex-col text-left"><h4 className="text-[14px] font-semibold text-white leading-none mb-1">Authentic</h4><p className="text-[12px] text-gray-500 leading-none">Certified product</p></div>
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

          <div style={{ maxHeight: expand ? '5000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.5s ease-in-out' }}>
            
            {/* Centered Tabs for Details */}
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center mt-12 px-4 transition-all duration-500">
              <div className="flex gap-12 border-b border-gray-200 mb-8 w-full justify-center">
                <button
                  onMouseEnter={() => setActiveDetailTab('overview')}
                  onClick={() => setActiveDetailTab('overview')}
                  className={`pb-3 text-sm md:text-[15px] font-bold uppercase tracking-[0.1em] transition-all duration-300 relative ${activeDetailTab === 'overview' ? 'text-black' : 'text-gray-400 hover:text-gray-800'}`}
                >
                  Description
                  {activeDetailTab === 'overview' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-black transition-all duration-300"></span>}
                </button>
                <button
                  onMouseEnter={() => setActiveDetailTab('specs')}
                  onClick={() => setActiveDetailTab('specs')}
                  className={`pb-3 text-sm md:text-[15px] font-bold uppercase tracking-[0.1em] transition-all duration-300 relative ${activeDetailTab === 'specs' ? 'text-black' : 'text-gray-400 hover:text-gray-800'}`}
                >
                  Specifications
                  {activeDetailTab === 'specs' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-black transition-all duration-300"></span>}
                </button>
              </div>

              <div className="w-full min-h-[180px] flex justify-center">
                {activeDetailTab === 'overview' ? (
                  <div className="w-full max-w-2xl text-center transition-all duration-500 opacity-100 translate-y-0">
                    <p className="text-gray-600 mb-6 leading-relaxed text-[14px] md:text-[15px]">{featuresText}</p>
                    <ul className="text-left inline-block list-disc text-gray-600 space-y-3 marker:text-[#d3b574] text-[14px] md:text-[15px]">
                      {descriptionList.map((desc, i) => <li key={i}>{desc}</li>)}
                    </ul>
                  </div>
                ) : (
                  <div className="w-full max-w-2xl transition-all duration-500 opacity-100 translate-y-0">
                    <div className="flex flex-col gap-4 text-[14px] md:text-[15px]">
                      {specs.map((spec, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <span className="text-gray-500 font-medium">{spec.label}</span>
                          <span className="text-black font-semibold text-right">{spec.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-gray-500 font-medium">In the Box</span>
                        <span className="text-black font-semibold text-right">{boxItems.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center text-gray-400 hover:text-black cursor-pointer transition-all mt-16 pb-10" onClick={() => { setExpand(false); if (modalRef.current) modalRef.current.scrollTop = 0; }}><ChevronUp className="w-5 h-5 animate-bounce mb-2" /><p className="uppercase tracking-[0.3em] font-black text-[9px]">Close Overview</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}