import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star,
  ChevronDown, ChevronUp, Package, CheckCircle, Truck,
  Zap, Clock, Info, Cpu
} from 'lucide-react';

// Canvas environment ke liye custom AOS style + Naya Fade-In Animation
const injectAOSStyles = () => {
  if (!document.getElementById('custom-aos-styles')) {
    const style = document.createElement('style');
    style.id = 'custom-aos-styles';
    style.innerHTML = `
      [data-aos="fade-up"] {
        opacity: 0;
        transform: translateY(120px) scale(0.95);
        transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
      }
      [data-aos="fade-up"].aos-animate {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      /* Hide scrollbar for smooth slider */
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      /* ⚡ Naya Card Image Fade-In Animation (Ease-In) ⚡ */
      @keyframes cardImageFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-card-fade-in {
        animation: cardImageFadeIn 0.8s ease-in forwards;
      }
    `;
    document.head.appendChild(style);
  }
};

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

const getAllImages = (product) => {
  if (!product) return [DEFAULT_IMG];
  let images = [];
  
  if (product.images?.length > 0) {
    images.push(...product.images.map(img => img.url));
  } else if (product.image) {
    images.push(product.image);
    if (product.hoverImage) images.push(product.hoverImage);
  }

  if (product.variants?.length > 0) {
    product.variants.forEach(variant => {
      if (variant.images?.length > 0) {
        images.push(...variant.images.map(img => img.url));
      }
    });
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

  const descriptionList = fullProduct.details?.descriptionList || [
    "Active noise cancellation",
    "Upto 6 hours battery with quick charge feature",
    "IPX4 sweat and water resistant",
    "Magnetic buds",
    "Integrated Tile Technology to find your lost earbuds"
  ];

  const featuresText = fullProduct.details?.features || "The new Skullcandy Method Active Noise Cancellation will completely isolate you and your music...";
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
        className={`relative bg-white overflow-y-auto transition-all duration-500 ease-in-out hide-scroll transform-gpu ${expand ? 'w-full h-[100vh] rounded-none shadow-none px-4 md:px-10' : 'w-full max-w-[95%] md:max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-4'
          }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', margin: '0 auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm transition-all z-50 cursor-pointer">
          <X className="w-5 h-5 text-gray-800" />
        </button>

        <div className={`w-full max-w-[1400px] mx-auto transition-all duration-500 ease-in-out ${expand ? 'pt-10 md:pt-16 pb-20' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
          <div className="flex flex-col md:flex-row w-full">
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
                <div ref={thumbScrollRef} className="hide-scroll flex flex-col gap-2 md:gap-3 overflow-y-auto scroll-smooth w-full flex-1 py-1" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
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

            <div className="w-full md:w-[50%] flex flex-col justify-start items-start text-left p-4 md:px-8">
              <p className={`text-[11px] uppercase tracking-[0.5em] font-bold ${isDealActive ? 'text-red-500' : 'text-[#d3b574]'} mb-2`}>{fullProduct.brand || fullProduct.category}</p>
              <h1 className="text-[#212121] font-medium text-[15px] md:text-[20px] mb-2 leading-snug">
                {showFullTitle ? fullProduct.name : (fullProduct.name.length > 60 ? fullProduct.name.substring(0, 60) + "..." : fullProduct.name)}
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

              {hasVariants && (
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Variant:</span>
                  <div className="flex gap-2 items-center flex-wrap">
                    {fullProduct.variants.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedVariantIdx(idx); setActiveImgIdx(0); }}
                        className={`w-10 h-10 rounded-md border transition-all flex items-center justify-center bg-[#f9f9f9] ${selectedVariantIdx === idx ? 'border-[#d3b574] shadow-md scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                        title={v.color || `Variant ${idx + 1}`}
                        style={{ padding: '2px' }}
                      >
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
                <button
                  onClick={handleModalAddToCart}
                  disabled={isAddingToCart}
                  className={`flex-1 max-w-[350px] shadow-lg active:scale-95 transition-all rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest ${isDealActive ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#d3b574] text-black hover:bg-[#c4a66a]'}`}
                  style={{ height: '44px', fontSize: '12px' }}
                >
                  {isAddingToCart ? <span>Adding...</span> : (
                    <><ShoppingBag size={16} /><span className="truncate">{isDealActive ? 'CLAIM DEAL' : 'ADD TO CART'}</span></>
                  )}
                </button>
              </div>

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

          <div style={{ maxHeight: expand ? '5000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.5s ease-in-out' }}>
            <div className="border-t border-gray-100 bg-white pt-10 px-4">
              <div className="flex gap-2 md:gap-4 mb-8 max-w-2xl mx-auto overflow-x-auto pb-2 justify-center px-2">
                <button onClick={() => setActiveDetailTab('overview')} className={`flex-1 min-w-[130px] md:min-w-[150px] flex items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-all ${activeDetailTab === 'overview' ? 'bg-[#0f0f0f] border-[#d3b574] text-white' : 'bg-[#f9f9f9] border-gray-100'}`}>
                  <Package className={`w-4 h-4 md:w-5 md:h-5 ${activeDetailTab === 'overview' ? 'text-[#d3b574]' : 'text-gray-400'}`} />
                  <div><h4 className="text-[12px] md:text-sm font-bold">Product Detail</h4></div>
                </button>
                <button onClick={() => setActiveDetailTab('specs')} className={`flex-1 min-w-[130px] md:min-w-[150px] flex items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-all ${activeDetailTab === 'specs' ? 'bg-[#0f0f0f] border-[#d3b574] text-white' : 'bg-[#f9f9f9] border-gray-100'}`}>
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

              <div className="w-full flex flex-col items-center justify-center text-gray-400 hover:text-black cursor-pointer transition-all mt-16 pb-10" onClick={() => { setExpand(false); if (modalRef.current) modalRef.current.scrollTop = 0; }}>
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
 * ⚡ SMART PRODUCT CARD
 * ========================================= */
const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const productUrl = createProductUrl(product);

  const [timeLeft, setTimeLeft] = useState(null);
  const [isDealActive, setIsDealActive] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const cardImages = getAllImages(product);

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
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] hover:shadow-[0_30px_50px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-2 w-full h-full cursor-pointer 
        ${isDealActive ? 'border border-red-500/20' : ''}`}
    >
      <div className="relative h-[350px] sm:h-[380px] bg-gray-100 overflow-hidden rounded-2xl cursor-pointer w-full">

        {isDealActive && (
          <div className="absolute top-4 left-4 z-50 bg-red-600 text-white text-[9px] font-black px-3 py-1 flex items-center gap-1 uppercase tracking-widest rounded-sm shadow-xl">
            <Zap className="w-3 h-3 fill-current" /> Lightning Deal
          </div>
        )}

        <div className="absolute inset-0 w-full h-full p-4 sm:p-6 transition-transform duration-1000 group-hover:scale-105">
          {/* ⚡ THE FIX: Added 'key' for remount and 'animate-card-fade-in' ⚡ */}
          <img 
            key={currentImgIndex} // critical trigger: changing key forces remount to restart animation
            src={cardImages[currentImgIndex]} 
            alt={product.name} 
            className="w-70 h-70 object-contain mix-blend-multiply animate-card-fade-in" // uses the custom keyframe in injectAOSStyles
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
            try {
              await axiosInstance.post('/cart/add', { productId: product._id, quantity: 1 });
              window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { increase: 1 } }));
            } catch (err) {}
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
};

/* =========================================
 * EXPORTED GRID COMPONENT
 * ========================================= */
export default function ProductGrid({ title, subtitle, products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    injectAOSStyles();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.1 }); 

    setTimeout(() => {
      document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, [products]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedProduct]);

  if (!products || products.length === 0) return null;

  const isLightning = title?.toLowerCase().includes('lightning');

  return (
    <section className="bg-white py-12 sm:py-20 font-sans selection:bg-[#d3b574] selection:text-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12">
          <div className="text-left">
            <div className="flex items-center space-x-4 mb-3 sm:mb-4">
              <div className={`w-8 sm:w-10 h-[1px] ${isLightning ? 'bg-red-600' : 'bg-[#d3b574]'}`}></div>
              <span className={`text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-black ${isLightning ? 'text-red-600 animate-pulse' : 'text-[#d3b574]'}`}>
                {isLightning ? 'Limited Time Offer' : 'Exclusively Curated'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-black leading-tight">
              {title} <span className="text-gray-300">{subtitle}</span>
            </h2>
          </div>
        </div>

        {/* Slider Container */}
        <div 
          className="flex flex-nowrap overflow-x-auto overflow-y-hidden justify-start items-stretch gap-4 sm:gap-6 pt-6 pb-10 hide-scrollbar snap-x px-2"
          style={{ touchAction: 'pan-x' }} 
        >
          {products.map((p) => (
            <div key={p._id || Math.random()} className="w-[280px] sm:w-[340px] shrink-0 snap-start">
              <ProductCard product={p} onQuickView={setSelectedProduct} />
            </div>
          ))}
        </div>

      </div>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}