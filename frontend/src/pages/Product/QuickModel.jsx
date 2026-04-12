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
    <div className="fixed top-5 right-5 z-[999999] bg-[#111] text-white border border-gray-800 px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4">
      <span className="font-medium text-xs tracking-wide">{toast.message}</span>
      <button onClick={onClose} className="hover:text-gray-400 transition-colors"><X className="w-3 h-3" /></button>
    </div>
  );
};

export default function QuickViewModal({ product, onClose }) {
  const theme = useServerTheme(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeProductId, setActiveProductId] = useState(product?._id);
  const [fullProduct, setFullProduct] = useState(product);
  const [relatedProducts, setRelatedProducts] = useState([]); 
  
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [expand, setExpand] = useState(false); 
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (product?._id) {
      setActiveProductId(product._id);
    }
  }, [product]);

  useEffect(() => {
    if (activeProductId) {
      const fetchDetails = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${activeProductId}`);
          if (data?.success && data?.product) {
            setFullProduct(data.product);
            if (data.relatedProducts) {
              setRelatedProducts(data.relatedProducts);
            }
            
            setActiveImgIdx(0);
            setSelectedVariantIdx(0);
            setQuantity(1);
            setExpand(false); 
            setActiveDetailTab('overview');
            setShowFullTitle(false);
            
            if (modalRef.current) {
              modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        } catch (e) { console.error(e); }
      };
      fetchDetails();
    }
  }, [activeProductId]);

  const isDealActive = fullProduct?.flashDeal?.isActive && new Date(fullProduct.flashDeal.endTime).getTime() > Date.now();
  const displayPrice = isDealActive ? fullProduct.flashDeal.dealPrice : (fullProduct?.price - (fullProduct?.discountPrice || 0));

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
      showToast('success', `${quantity} item(s) added to cart.`);
    } catch (error) {
      showToast('error', 'Failed to add items to cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRecommendedClick = (recommendedId) => {
    setActiveProductId(recommendedId);
  };

  const hasVariants = fullProduct?.variants?.length > 0;
  let galleryImages = (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0)
    ? fullProduct.variants[selectedVariantIdx].images.map(img => img.url)
    : getAllImages(fullProduct);
  galleryImages = [...new Set(galleryImages.filter(Boolean))];
  if (galleryImages.length === 0) galleryImages = [DEFAULT_IMG];

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

  const dynamicBullets = [
    `100% Authentic ${fullProduct?.brand || 'Premium'} Product`,
    "7-Days Easy Return & Exchange",
    "Standard Manufacturer Warranty",
    "Secure Checkout"
  ];
  const finalDescriptionList = [...descriptionList, ...dynamicBullets];

  return (
    <div className={`fixed inset-0 z-[99999] flex transition-all duration-500 ease-out ${expand ? 'bg-white items-start p-0' : 'bg-black/60 backdrop-blur-sm items-center justify-center p-4'}`} onClick={onClose}>
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      <div 
        ref={modalRef} 
        onWheel={(e) => handleScrollAndSwipe(e.deltaY)} 
        onScroll={(e) => { if(e.target.scrollTop > 10 && !expand) setExpand(true); }}
        onClick={(e) => e.stopPropagation()} 
        className={`relative bg-white overflow-y-auto transition-all duration-500 ease-out hide-scroll transform-gpu ${expand ? 'w-full h-full rounded-none px-6 md:px-12' : 'w-full max-w-[1000px] max-h-[90vh] rounded-[20px] shadow-2xl px-5 pb-5 pt-3 md:pt-4'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
      >
        <button onClick={onClose} className="fixed top-4 right-4 md:top-6 md:right-6 p-1.5 rounded-full bg-gray-50 hover:bg-gray-200 shadow-sm z-[100] cursor-pointer transition-all">
          <X className="w-4 h-4 text-gray-700" />
        </button>
        
        <div className={`w-full max-w-[1100px] mx-auto transition-all duration-500 ${expand ? 'pt-16 md:pt-20 pb-8' : 'pt-6 pb-2'}`}>
          <div className="flex flex-col md:flex-row w-full gap-5 md:gap-7 items-start">
            
            <div className="w-full md:w-[46%] flex flex-row justify-start items-start relative min-h-[280px]">
              <div className="flex flex-col items-center mr-2 w-[55px] md:w-[60px] h-[280px] md:h-[360px]">
                <div className="hide-scroll flex flex-col gap-2 overflow-y-auto scroll-smooth w-full flex-1 py-1">
                  {galleryImages.map((imgSrc, idx) => (
                    <div key={idx} onMouseEnter={() => setActiveImgIdx(idx)} className={`w-full aspect-square rounded-md flex items-center justify-center cursor-pointer transition-all border ${activeImgIdx === idx ? 'border-gray-800 shadow-sm' : 'border-gray-200 bg-gray-50 hover:border-gray-400'}`} style={{ padding: '2px' }}>
                      <img src={imgSrc} alt="thumb" className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-4 relative h-[280px] md:h-[360px]">
                {isDealActive && <div className="absolute top-0 left-0 z-10 bg-red-600 text-white text-[9px] font-medium px-2 py-0.5 uppercase rounded-br-md shadow-sm">Deal</div>}
                <img src={galleryImages[activeImgIdx]} alt="main" className="max-h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105" />
              </div>
            </div>

            <div className="w-full md:w-[54%] flex flex-col items-start text-left md:pl-2">
              <div className="flex items-center justify-between w-full mb-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{fullProduct?.brand}</p>
                <div className="flex items-center gap-1 bg-[#111] text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                  <span>{fullProduct?.ratings || "4.8"}</span>
                  <Star size={9} className="fill-current" />
                </div>
              </div>

              <h1 className="text-gray-900 font-medium text-[18px] md:text-[22px] leading-snug mb-2">
                {showFullTitle ? fullProduct?.name : (fullProduct?.name?.length > 65 ? fullProduct?.name?.substring(0, 65) + "..." : fullProduct?.name)}
                {fullProduct?.name?.length > 65 && (
                  <button onClick={() => setShowFullTitle(!showFullTitle)} className="text-blue-500 text-[11px] ml-2 font-medium hover:underline">
                    {showFullTitle ? 'Show Less' : 'More'}
                  </button>
                )}
              </h1>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-semibold text-[24px] text-gray-900">{formatPrice(displayPrice)}</span>
                {fullProduct?.discountPrice > 0 && (
                  <>
                    <span className="text-gray-400 line-through text-[14px]">{formatPrice(fullProduct?.price)}</span>
                    <span className="text-green-600 text-[12px] font-medium">
                      {Math.round(((fullProduct.price - displayPrice) / fullProduct.price) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto hide-scroll w-full mb-5 pb-1">
                <div className="min-w-[140px] border border-gray-200 rounded p-2 bg-gray-50">
                  <p className="flex items-center gap-1 text-[10px] font-medium text-[#111] mb-1"><Tag size={10}/> Bank Offer</p>
                  <p className="text-[10px] text-gray-600 leading-tight">5% Cashback on Axis Card.</p>
                </div>
                <div className="min-w-[140px] border border-gray-200 rounded p-2 bg-gray-50">
                  <p className="flex items-center gap-1 text-[10px] font-medium text-[#111] mb-1"><Tag size={10}/> Special Price</p>
                  <p className="text-[10px] text-gray-600 leading-tight">Extra ₹{fullProduct?.discountPrice || 500} off.</p>
                </div>
              </div>
              
              {hasVariants && (
                <div className="mb-5 space-y-1.5 w-full">
                  <span className="text-xs text-gray-600 font-medium">
                    Color: <span className="text-gray-900">{fullProduct.variants[selectedVariantIdx].color}</span>
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {fullProduct.variants.map((v, idx) => (
                      <button key={idx} onClick={() => { setSelectedVariantIdx(idx); setActiveImgIdx(0); }} 
                              className={`w-12 h-12 rounded-md border-2 transition-all p-1 bg-white ${selectedVariantIdx === idx ? 'border-gray-800 shadow-sm' : 'border-gray-200 hover:border-gray-400'}`}>
                        <img src={v.images?.[0]?.url || DEFAULT_IMG} className="w-full h-full object-contain mix-blend-multiply" alt="v" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5 w-full mb-5 relative z-20">
                <div className="flex flex-row gap-2.5 w-full">
                  <div className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-2 w-24 shrink-0 h-[42px]">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black w-6 h-6 flex items-center justify-center text-sm font-medium">−</button>
                    <span className="font-medium text-gray-900 text-[13px]">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black w-6 h-6 flex items-center justify-center text-sm font-medium">+</button>
                  </div>
                  
                  <button 
                    onClick={handleModalAddToCart} 
                    disabled={isAddingToCart} 
                    className="flex-1 flex items-center justify-center gap-2 rounded-md font-medium text-[12px] transition-all bg-white border border-gray-800 text-gray-900 hover:bg-gray-50 shadow-sm"
                    style={{ height: '42px' }}
                  >
                    <ShoppingCart size={14} />
                    <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
                  </button>
                </div>

                <button 
                  onClick={() => navigate('/checkout')} 
                  className="w-full flex items-center justify-center gap-2 rounded-md font-medium text-[12px] transition-all bg-[#111] hover:bg-black text-white shadow-sm"
                  style={{ height: '42px' }}
                >
                  <Zap size={14} className="fill-current" />
                  <span>Buy Now</span>
                </button>

                <div className="flex flex-wrap items-center justify-between mt-1 border border-gray-200 rounded p-2 bg-white">
                   <div className="flex items-center gap-1.5 text-gray-500">
                      <Lock size={12} className="text-gray-700" />
                      <span className="text-[10px] font-medium text-gray-700">Safe Payments</span>
                   </div>
                   <div className="flex items-center gap-1.5 grayscale opacity-60">
                      <span className="text-[9px] font-medium border border-gray-300 px-1 rounded">UPI</span>
                      <span className="text-[9px] font-medium border border-gray-300 px-1 rounded text-blue-800">VISA</span>
                      <span className="text-[9px] font-medium border border-gray-300 px-1 rounded text-red-600">MC</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full mb-1">
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <div className="flex flex-col text-left"><h4 className="text-[11px] font-medium text-gray-800">Free Delivery</h4><p className="text-[9px] text-gray-500">By Tomorrow</p></div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                  <ShieldCheck className="w-4 h-4 text-gray-600" />
                  <div className="flex flex-col text-left"><h4 className="text-[11px] font-medium text-gray-800">1 Year Warranty</h4><p className="text-[9px] text-gray-500">Authorized</p></div>
                </div>
              </div>
              
              {!expand && (
                <div className="w-full flex items-center justify-center mt-4 cursor-pointer group" onClick={() => setExpand(true)}>
                  <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-800 transition-all">
                    <span className="text-[10px] font-medium uppercase tracking-widest">View Details</span>
                    <ChevronDown size={16} className="animate-bounce opacity-70" />
                  </div>
                </div>
              )}

            </div>
          </div>

          <div style={{ maxHeight: expand ? '6000px' : '0px', opacity: expand ? 1 : 0, overflow: 'hidden', transition: 'all 0.6s ease-in-out' }}>
            <div className="mt-8 w-full max-w-4xl mx-auto border-t border-gray-200 pt-6">
              
              <div className="flex gap-6 border-b border-gray-200 mb-6 px-2 md:px-0 overflow-x-auto hide-scroll">
                {['overview', 'specs'].map(tab => (
                  <button key={tab} onClick={() => setActiveDetailTab(tab)} className={`pb-2 text-[13px] font-medium whitespace-nowrap relative transition-all ${activeDetailTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                    {tab === 'overview' ? 'Description' : 'Specifications'}
                    {activeDetailTab === tab && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-gray-900 rounded-t-md" />}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[150px] px-2 md:px-0 mb-8">
                {activeDetailTab === 'overview' ? (
                  <div className="w-full">
                    <p className="text-gray-600 text-[13px] leading-relaxed mb-5">{featuresText}</p>
                    <h3 className="text-base font-medium text-gray-900 mb-3 border-b border-gray-100 pb-1">Key Features</h3>
                    <ul className="text-left space-y-2 list-disc pl-4">
                      {finalDescriptionList.map((d, i) => (
                        <li key={i} className="text-gray-600 text-[13px]">{d}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="w-full">
                    <h3 className="text-base font-medium text-gray-900 mb-3 border-b border-gray-100 pb-1">General Specifications</h3>
                    <div className="bg-white border border-gray-200 rounded overflow-hidden">
                      {specs.map((s, i) => (
                        <div key={i} className={`flex flex-col sm:flex-row py-2.5 px-4 text-[13px] ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100 last:border-0`}>
                          <span className="text-gray-500 w-full sm:w-1/3">{s.label}</span>
                          <span className="text-gray-800 font-medium w-full sm:w-2/3">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {relatedProducts.length > 0 && (
                <div className="w-full pt-4 pb-8 px-2 md:px-0">
                  <div className="mb-4">
                    <h3 className="text-[16px] font-medium text-gray-900 border-l-4 border-gray-800 pl-2">Similar Products</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {relatedProducts.map((related) => {
                      const isRelatedDeal = related.flashDeal?.isActive && new Date(related.flashDeal.endTime).getTime() > Date.now();
                      const relatedPrice = isRelatedDeal ? related.flashDeal.dealPrice : (related.price - (related.discountPrice || 0));
                      
                      return (
                        <div 
                          key={related._id} 
                          className="group cursor-pointer flex flex-col bg-white border border-gray-100 p-2.5 rounded hover:shadow-sm transition-shadow"
                          onClick={() => handleRecommendedClick(related._id)}
                        >
                          <div className="bg-white overflow-hidden aspect-square mb-2.5 flex items-center justify-center relative">
                            <img 
                              src={related.images?.[0]?.url || related.variants?.[0]?.images?.[0]?.url || DEFAULT_IMG} 
                              alt={related.name} 
                              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h4 className="text-[12px] text-gray-700 line-clamp-2 hover:text-black transition-colors mb-1 font-medium">
                            {related.name}
                          </h4>
                          <p className="text-[14px] font-semibold text-gray-900 mt-1">
                            {formatPrice(relatedPrice)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {galleryImages.length > 0 && (
                <div className="w-full pb-10 px-2 md:px-0">
                   <div className="mb-4">
                     <h3 className="text-[16px] font-medium text-gray-900 border-l-4 border-gray-800 pl-2">Product Gallery</h3>
                   </div>
                   <div className="flex flex-col gap-4 w-full items-center">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="w-full bg-[#fcfcfc] border border-gray-100 rounded p-4 md:p-8 flex items-center justify-center">
                           <img src={img} alt={`gallery-full-${i}`} className="w-full max-h-[500px] object-contain mix-blend-multiply" />
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