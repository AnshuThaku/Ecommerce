import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, ShoppingBag, X, ShieldCheck, Star, ChevronDown, ChevronUp, Package, CheckCircle, Truck, Zap, Lock, Tag, Check } from 'lucide-react';
import { useServerTheme } from '../../hooks/useServerTheme';
import axiosInstance from '../../utils/axiosInstance';

const useAuth = () => ({ user: null });

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
    <div className="fixed top-5 right-5 z-[999999] bg-[#111] text-white border border-gray-800 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-top-4">
      <span className="font-medium text-sm tracking-wide">{toast.message}</span>
      <button onClick={onClose} className="hover:text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
    </div>
  );
};

export default function QuickViewModal({ product, onClose }) {
  const theme = useServerTheme(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [fullProduct, setFullProduct] = useState(product);
  const [relatedProducts, setRelatedProducts] = useState([]); 
  
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [expand, setExpand] = useState(false); // State for Slide-Up Expansion
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const modalRef = useRef(null);
  const thumbScrollRef = useRef(null);

  // Prevent background scrolling when modal is open
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

  // Fetch full details and related products
  useEffect(() => {
    if (product && product._id) {
      const fetchDetails = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${product._id}`);
          if (data?.success && data?.product) {
            setFullProduct(data.product);
            if (data.relatedProducts) {
              setRelatedProducts(data.relatedProducts);
            }
          }
        } catch (e) { console.error(e); }
      };
      fetchDetails();
    }
  }, [product]);

  // ─── MAGIC SCROLL LOGIC FOR EXPANSION ───
  const handleScrollAndSwipe = (deltaY) => {
    const scrollTop = modalRef.current?.scrollTop || 0;
    // If scrolled down slightly and not expanded, trigger expand
    if (!expand && deltaY > 15) setExpand(true);
    // If scrolled back up to top, un-expand
    else if (expand && scrollTop <= 5 && deltaY < -15) setExpand(false);
  };
  // ────────────────────────────────────────

  const handleModalAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await axiosInstance.post('/cart/add', { productId: fullProduct._id, quantity });
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { increase: quantity } }));
      showToast('success', `${quantity} item(s) added to cart.`);
    } catch (error) {
      showToast('error', 'Failed to add items to cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRecommendedClick = (recommendedId) => {
    onClose(); 
    navigate(`/product/${recommendedId}`); 
  };

  const hasVariants = fullProduct?.variants?.length > 0;
  let galleryImages = (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0)
    ? fullProduct.variants[selectedVariantIdx].images.map(img => img.url)
    : getAllImages(fullProduct);
  galleryImages = [...new Set(galleryImages.filter(Boolean))];
  if (galleryImages.length === 0) galleryImages = [DEFAULT_IMG];

  // ─── DYNAMIC DATA PARSER WITH EXTRA CONTENT ───
  let featuresText = "Experience premium quality with our latest collection.";
  let descriptionList = ["Premium build quality", "Durable materials", "Ergonomic design"];
  let specs = [
    { label: "Brand", value: fullProduct?.brand || "Exclusive" },
    { label: "Category", value: fullProduct?.category || "Luxury" }
  ];

  if (fullProduct?.description) {
    const descStr = fullProduct.description;
    const featuresSplit = descStr.split("Description List (Bullets):");
    
    if (featuresSplit.length === 2) {
      featuresText = featuresSplit[0].replace("Features (Paragraph):", "").trim();
      
      const specsSplit = featuresSplit[1].split("Specifications:");
      if (specsSplit.length === 2) {
        descriptionList = specsSplit[0].split('\n').map(s => s.trim()).filter(Boolean);
        
        const rawSpecs = specsSplit[1].split('\n').map(s => s.trim()).filter(Boolean);
        specs = rawSpecs.map(line => {
          const idx = line.indexOf(':');
          if (idx > -1) {
            return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
          }
          return null;
        }).filter(Boolean);
      }
    } else {
      featuresText = fullProduct.description;
    }
  }

  // Adding dynamic bullet points to make it look fuller like Amazon
  const dynamicBullets = [
    `100% Authentic ${fullProduct?.brand || 'Premium'} Product`,
    "7-Days Easy Return & Exchange Policy",
    "Standard Manufacturer Warranty Applicable",
    "Secure & Verified Checkout"
  ];
  const finalDescriptionList = [...descriptionList, ...dynamicBullets];
  // ──────────────────────────────────────────────

  return (
    // ⚡ The wrapper handles the background and overall centering. Notice the `ease-out` transition.
    <div className={`fixed inset-0 z-[99999] flex transition-all duration-500 ease-out ${expand ? 'bg-white items-start p-0' : 'bg-black/70 backdrop-blur-sm items-center justify-center p-4'}`} onClick={onClose}>
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      {/* ⚡ The main modal container that expands full width/height when `expand` is true */}
      <div 
        ref={modalRef} 
        onWheel={(e) => handleScrollAndSwipe(e.deltaY)} 
        onScroll={(e) => { if(e.target.scrollTop > 10 && !expand) setExpand(true); }}
        onClick={(e) => e.stopPropagation()} 
        className={`relative bg-white overflow-y-auto transition-all duration-500 ease-out hide-scroll transform-gpu ${expand ? 'w-full h-full rounded-none px-6 md:px-12' : 'w-full max-w-[1100px] max-h-[90vh] rounded-[24px] shadow-2xl px-6 pb-6 pt-2 md:pt-4'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
      >
        {/* Close Button - Stays fixed on top right */}
        <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-8 p-2 rounded-full bg-gray-50 hover:bg-gray-200 shadow-sm z-[100] cursor-pointer transition-all">
          <X className="w-5 h-5 text-gray-800" />
        </button>
        
        {/* Inner wrapper adds top padding when expanded so content doesn't hit the ceiling */}
        <div className={`w-full max-w-[1300px] mx-auto transition-all duration-500 ${expand ? 'pt-20 md:pt-28 pb-10' : 'pt-8 pb-4'}`}>
          <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8 items-start">
            
            {/* ── IMAGE GALLERY (LEFT) ── */}
            <div className="w-full md:w-[48%] flex flex-row justify-start items-start relative min-h-[300px]">
              {/* Thumbnails */}
              <div className="flex flex-col items-center mr-3 w-[60px] md:w-[70px] h-[300px] md:h-[400px]">
                <div className="hide-scroll flex flex-col gap-2 overflow-y-auto scroll-smooth w-full flex-1 py-1">
                  {galleryImages.map((imgSrc, idx) => (
                    <div key={idx} onMouseEnter={() => setActiveImgIdx(idx)} className={`w-full aspect-square rounded-md flex items-center justify-center cursor-pointer transition-all border-2 ${activeImgIdx === idx ? 'border-black shadow-sm' : 'border-gray-200 bg-gray-50 hover:border-gray-400'}`} style={{ padding: '2px' }}>
                      <img src={imgSrc} alt="thumb" className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-4 relative h-[300px] md:h-[400px]">
                {isDealActive && <div className="absolute top-0 left-0 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-br-lg shadow-sm"><Zap className="w-3 h-3 inline fill-current mr-1" /> Deal</div>}
                <img src={galleryImages[activeImgIdx]} alt="main" className="max-h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105" />
              </div>
            </div>

            {/* ── PRODUCT INFO (RIGHT) ── */}
            <div className="w-full md:w-[52%] flex flex-col items-start text-left md:pl-2">
              <div className="flex items-center justify-between w-full mb-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{fullProduct?.brand}</p>
                <div className="flex items-center gap-1 bg-[#111] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                  <span>{fullProduct?.ratings || "4.8"}</span>
                  <Star size={10} className="fill-current" />
                </div>
              </div>

              <h1 className="text-gray-900 font-semibold text-[20px] md:text-[26px] leading-tight mb-2">
                {showFullTitle ? fullProduct?.name : (fullProduct?.name?.length > 70 ? fullProduct?.name?.substring(0, 70) + "..." : fullProduct?.name)}
                {fullProduct?.name?.length > 70 && (
                  <button onClick={() => setShowFullTitle(!showFullTitle)} className="text-gray-500 text-[12px] ml-2 font-semibold hover:text-black hover:underline">
                    {showFullTitle ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </h1>
              
              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-black text-[28px] text-gray-900">{formatPrice(displayPrice)}</span>
                {fullProduct?.discountPrice > 0 && (
                  <>
                    <span className="text-gray-400 line-through text-[16px]">{formatPrice(fullProduct?.price)}</span>
                    <span className="text-green-600 text-[13px] font-bold">
                      {Math.round(((fullProduct.price - displayPrice) / fullProduct.price) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              {/* ── OFFERS CARDS ── */}
              <div className="flex gap-3 overflow-x-auto hide-scroll w-full mb-6 pb-2">
                <div className="min-w-[150px] border border-gray-200 rounded-md p-2.5 bg-gray-50">
                  <p className="flex items-center gap-1 text-[11px] font-bold text-[#111] mb-1"><Tag size={12}/> Bank Offer</p>
                  <p className="text-[11px] text-gray-600 leading-tight">5% Cashback on Axis Bank Credit Card.</p>
                </div>
                <div className="min-w-[150px] border border-gray-200 rounded-md p-2.5 bg-gray-50">
                  <p className="flex items-center gap-1 text-[11px] font-bold text-[#111] mb-1"><Tag size={12}/> Special Price</p>
                  <p className="text-[11px] text-gray-600 leading-tight">Get extra ₹{fullProduct?.discountPrice || 500} off (inclusive of cashback).</p>
                </div>
                <div className="min-w-[150px] border border-gray-200 rounded-md p-2.5 bg-gray-50">
                  <p className="flex items-center gap-1 text-[11px] font-bold text-[#111] mb-1"><Tag size={12}/> Partner Offer</p>
                  <p className="text-[11px] text-gray-600 leading-tight">Sign up for Pay Later and get free Gift Card.</p>
                </div>
              </div>
              
              {/* Variants */}
              {hasVariants && (
                <div className="mb-6 space-y-2 w-full">
                  <span className="text-sm text-gray-600 font-semibold">
                    Color: <span className="text-gray-900 font-bold">{fullProduct.variants[selectedVariantIdx].color}</span>
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {fullProduct.variants.map((v, idx) => (
                      <button key={idx} onClick={() => { setSelectedVariantIdx(idx); setActiveImgIdx(0); }} 
                              className={`w-14 h-14 rounded-md border-2 transition-all p-1 bg-white ${selectedVariantIdx === idx ? 'border-black shadow-sm' : 'border-gray-200 hover:border-gray-400'}`}>
                        <img src={v.images?.[0]?.url || DEFAULT_IMG} className="w-full h-full object-contain mix-blend-multiply" alt="v" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── THEME MATCHING ACTION BUTTONS ── */}
              <div className="flex flex-col gap-3 w-full mb-6 relative z-20">
                
                <div className="flex flex-row gap-3 w-full">
                  {/* Quantity */}
                  <div className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-2 w-28 shrink-0 h-[46px]">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold">−</button>
                    <span className="font-semibold text-gray-900 text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold">+</button>
                  </div>
                  
                  {/* Add to Cart (Outline Theme) */}
                  <button 
                    onClick={handleModalAddToCart} 
                    disabled={isAddingToCart} 
                    className="flex-1 flex items-center justify-center gap-2 rounded-md font-semibold text-[14px] transition-all bg-white border-2 border-[#111] text-[#111] hover:bg-gray-50 shadow-sm"
                    style={{ height: '46px' }}
                  >
                    <ShoppingCart size={18} />
                    <span>{isAddingToCart ? 'Adding...' : 'ADD TO CART'}</span>
                  </button>
                </div>

                {/* BUY NOW (Solid Theme) */}
                <button 
                  onClick={() => navigate('/checkout')} 
                  className="w-full flex items-center justify-center gap-2 rounded-md font-semibold text-[14px] transition-all bg-[#111] hover:bg-black text-white shadow-sm"
                  style={{ height: '46px' }}
                >
                  <Zap size={18} className="fill-current" />
                  <span>BUY NOW</span>
                </button>

                {/* Safe Payment Options Card */}
                <div className="flex flex-wrap items-center justify-between mt-2 border border-gray-200 rounded-md p-3 bg-white">
                   <div className="flex items-center gap-1.5 text-gray-500">
                      <Lock size={14} className="text-gray-800" />
                      <span className="text-[11px] font-semibold text-gray-800">Safe & Secure Payments</span>
                   </div>
                   <div className="flex items-center gap-2 grayscale opacity-70">
                      <span className="text-[10px] font-bold border border-gray-300 px-1 rounded">UPI</span>
                      <span className="text-[10px] font-bold border border-gray-300 px-1 rounded text-blue-800 italic">VISA</span>
                      <span className="text-[10px] font-bold border border-gray-300 px-1 rounded text-red-600">MC</span>
                      <span className="text-[10px] font-bold border border-gray-300 px-1 rounded">NetBanking</span>
                   </div>
                </div>
              </div>

              {/* Delivery Badges */}
              <div className="grid grid-cols-2 gap-3 w-full mb-2">
                <div className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-200">
                  <Truck className="w-5 h-5 text-gray-800" />
                  <div className="flex flex-col text-left"><h4 className="text-[12px] font-semibold text-gray-800">Free Delivery</h4><p className="text-[11px] text-gray-500">By Tomorrow</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-200">
                  <ShieldCheck className="w-5 h-5 text-gray-800" />
                  <div className="flex flex-col text-left"><h4 className="text-[12px] font-semibold text-gray-800">1 Year Warranty</h4><p className="text-[11px] text-gray-500">Brand Authorized</p></div>
                </div>
              </div>
              
              {/* ⚡ The "Explore Full Details" button that triggers expansion ⚡ */}
              {!expand && (
                <div className="w-full flex items-center justify-center mt-6 cursor-pointer group" onClick={() => setExpand(true)}>
                  <div className="flex flex-col items-center gap-2 text-blue-500 hover:text-blue-700 transition-all">
                    <span className="text-[12px] font-bold uppercase tracking-widest">Explore Full Details</span>
                    <ChevronDown size={20} className="animate-bounce" />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ── EXPANDED DETAILS SECTION (Only visible when `expand` is true) ── */}
          <div style={{ maxHeight: expand ? '6000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.8s ease-in-out' }}>
            <div className="mt-12 w-full max-w-5xl mx-auto border-t border-gray-200 pt-8">
              
              {/* Tabs for Description & Specs */}
              <div className="flex gap-6 border-b border-gray-200 mb-8 px-2 md:px-0 overflow-x-auto hide-scroll">
                {['overview', 'specs'].map(tab => (
                  <button key={tab} onClick={() => setActiveDetailTab(tab)} className={`pb-3 text-[15px] font-semibold whitespace-nowrap relative transition-all ${activeDetailTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-800'}`}>
                    {tab === 'overview' ? 'Product Description' : 'Specifications'}
                    {activeDetailTab === tab && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-gray-900 rounded-t-md" />}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[150px] px-2 md:px-0 mb-12">
                {activeDetailTab === 'overview' ? (
                  <div className="w-full">
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">{featuresText}</p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Key Features</h3>
                    <ul className="text-left space-y-3 list-disc pl-5">
                      {finalDescriptionList.map((d, i) => (
                        <li key={i} className="text-gray-700 text-sm">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">General Specifications</h3>
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                      {specs.map((s, i) => (
                        <div key={i} className={`flex flex-col sm:flex-row py-3 px-4 text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100 last:border-0`}>
                          <span className="text-gray-500 w-full sm:w-1/3">{s.label}</span>
                          <span className="text-gray-900 font-medium w-full sm:w-2/3">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ⚡ RECOMMENDED PRODUCTS (ABOVE IMAGES) ⚡ */}
              {relatedProducts.length > 0 && (
                <div className="w-full pt-6 pb-12 px-2 md:px-0">
                  <div className="mb-6">
                    <h3 className="text-[18px] font-semibold text-gray-900 border-l-4 border-[#111] pl-3">Similar Products</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {relatedProducts.map((related) => {
                      const isRelatedDeal = related.flashDeal?.isActive && new Date(related.flashDeal.endTime).getTime() > Date.now();
                      const relatedPrice = isRelatedDeal ? related.flashDeal.dealPrice : (related.price - (related.discountPrice || 0));
                      
                      return (
                        <div 
                          key={related._id} 
                          className="group cursor-pointer flex flex-col bg-white border border-gray-200 p-3 rounded-md hover:shadow-md transition-shadow"
                          onClick={() => handleRecommendedClick(related._id)}
                        >
                          <div className="bg-white overflow-hidden aspect-square mb-3 flex items-center justify-center relative">
                            <img 
                              src={related.images?.[0]?.url || related.variants?.[0]?.images?.[0]?.url || DEFAULT_IMG} 
                              alt={related.name} 
                              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-[13px] text-gray-800 line-clamp-2 hover:text-black transition-colors mb-1">
                            {related.name}
                          </h4>
                          <div className="flex items-center gap-1 text-white bg-green-700 px-1.5 py-0.5 rounded-sm w-fit mb-2">
                             <span className="text-[10px] font-bold">{related.ratings || "4.5"}</span>
                             <Star size={8} className="fill-current" />
                          </div>
                          <p className="text-[16px] font-bold text-gray-900">
                            {formatPrice(relatedPrice)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── FULL WIDTH IMAGE GALLERY (AT BOTTOM) ── */}
              {galleryImages.length > 0 && (
                <div className="w-full pb-16 px-2 md:px-0">
                   <div className="mb-6">
                     <h3 className="text-[18px] font-semibold text-gray-900 border-l-4 border-[#111] pl-3">Product Gallery</h3>
                   </div>
                   <div className="flex flex-col gap-6 w-full items-center">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-6 md:p-10 flex items-center justify-center">
                           <img src={img} alt={`gallery-full-${i}`} className="w-full max-h-[600px] object-contain mix-blend-multiply" />
                        </div>
                      ))}
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}