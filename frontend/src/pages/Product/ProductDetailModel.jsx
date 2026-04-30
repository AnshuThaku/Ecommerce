import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, ShoppingBag, CheckCircle2, Battery, Droplets, Wifi, Bluetooth, Zap, Shield, Tv, Volume, Smartphone, Mic } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

const iconMap = { 
  Battery: <Battery size={24} />,
  Droplets: <Droplets size={24} />,
  Wifi: <Wifi size={24} />,
  Bluetooth: <Bluetooth size={24} />,
  Zap: <Zap size={24} />,
  Shield: <Shield size={24} />,
  Tv: <Tv size={24} />,
  Volume: <Volume size={24} />,
  Smartphone: <Smartphone size={24} />,
  Mic: <Mic size={24} />
};

const formatPrice = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export default function QuickViewModal({ product: initialProduct, onClose, onQuickView }) {
  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);
  const [activeTab, setActiveTab] = useState('Features'); 
  const [fullProduct, setFullProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [activeSpecTab, setActiveSpecTab] = useState('');
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandDescription, setExpandDescription] = useState(false);
  const modalRef = useRef(null);

  // Reset states when a new product is selected from recommended section
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setLoading(true); // Reset loading when product changes
    setActiveImgIdx(0);
    setSelectedVariantIdx(0);
    setExpandDescription(false);

    if (initialProduct?._id) {
      const fetchDetails = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${initialProduct._id}`);
          if (data?.success && data?.product) {
            const productData = data.product;
            setFullProduct(productData);
            setRelatedProducts(data.relatedProducts || []);
            
            if (productData.techSpecs && productData.techSpecs.length > 0) {
              setActiveSpecTab(productData.techSpecs[0].category);
            }
          }
        } catch (e) { 
          console.error("Fetch error:", e); 
        } finally { 
          setLoading(false); 
        }
      };
      fetchDetails();
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [initialProduct?._id]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading || !fullProduct) {
    return (
      <div className="fixed inset-0 z-[99999] bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
      </div>
    );
  }

  const hasVariants = fullProduct?.variants?.length > 0;
  let galleryImages = (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0)
    ? fullProduct.variants[selectedVariantIdx].images.map(img => img.url)
    : (fullProduct.images?.length > 0 ? fullProduct.images.map(img => img.url) : [fullProduct?.image || DEFAULT_IMG]);

  const mainPrice = fullProduct?.discountPrice > 0 ? (fullProduct.price - fullProduct.discountPrice) : fullProduct?.price || 0;

  const handleAddToCart = async () => {
    try {
      const { data } = await axiosInstance.post('/cart/add', {
        productId: fullProduct._id,
        quantity: 1
      });

      if (data.success) {
        window.dispatchEvent(new CustomEvent("cartUpdated", {
          detail: { increase: 1 }
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex items-start justify-center font-sans text-[#1a1a1a]">
      <div ref={modalRef} onScroll={(e) => setExpand(e.target.scrollTop > 100)} onClick={(e) => e.stopPropagation()} className="w-full h-screen overflow-y-auto scroll-smooth scrollbar-hide pb-[140px]">        
        
        {/* --- TOP NAV --- */}
        <nav id="product-hero" className={`sticky top-0 z-[150] w-full bg-white transition-all duration-300 border-b border-gray-50 ${expand ? 'py-2' : 'py-3'}`}>
          <div className="max-w-[1340px] mx-auto px-6 md:px-12 flex justify-between items-center">
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => navigate('/')}>
               <img src="/Truee_Luxury_Logo.png" alt="Truee" className="h-8 md:h-10 w-auto object-contain brightness-0" />    
               <span className="text-[8px] font-bold tracking-[0.4em] uppercase mt-0.5 text-black opacity-80">TRUEE</span>
            </div>

            {expand && (
               <div className="hidden md:flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                 <img src={galleryImages[0]} className="w-6 h-6 object-contain" alt="p"/>
                 <span className="font-bold text-[9px] uppercase tracking-widest text-gray-500">{fullProduct?.name}</span>
               </div>
            )}

            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-all cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <div className="max-w-[1340px] mx-auto px-6 md:px-12 pt-8 flex flex-col lg:flex-row gap-8 lg:gap-20 mb-20 items-start relative">
          
          {/* LEFT SIDE: Gallery */}
          <div className="w-full lg:w-[60%] lg:sticky lg:top-24 self-start">
            <div className="bg-[#f7f7f7] w-full max-w-[850px] aspect-square rounded-[2rem] flex items-center justify-center p-8 relative overflow-hidden group mx-auto">
              <img 
                src={galleryImages[activeImgIdx]} 
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700" 
                alt="main" 
                style={{ maxHeight: '460px', marginTop: '-10px' }} 
              />
            </div>
            
            <div className="flex gap-3 mt-4 justify-center">
              {galleryImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImgIdx(i)} 
                  className={`w-26 h-26 rounded-xl bg-[#f7f7f7] p-2 border-2 cursor-pointer transition-all ${activeImgIdx === i ? 'border-black' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Details */}
          <div className="w-full lg:w-[40%] flex flex-col pt-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 leading-tight">{fullProduct?.name}</h1>
            
            <div className="flex justify-between items-baseline border-b border-gray-100 pb-6 mb-6">
              <p className="text-3xl font-light text-black">{formatPrice(mainPrice)}</p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#C8A253] uppercase tracking-widest">
                <Star size={12} fill="#C8A253"/> 4.9/5
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="text-[11px] font-black uppercase tracking-widest mb-3 text-gray-400">Description</div>
              <div 
                className={`text-gray-700 leading-relaxed text-[15px] transition-all duration-300 ${expandDescription ? 'max-h-[1000px]' : 'max-h-[80px] overflow-hidden'}`}
                dangerouslySetInnerHTML={{ __html: fullProduct?.description }} 
              />
              <button 
                onClick={() => setExpandDescription(!expandDescription)}
                className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black underline underline-offset-4 hover:text-[#C8A253] transition-colors cursor-pointer"
              >
                {expandDescription ? 'Read Less' : 'Read More'}
              </button>
            </div>

            {/* Variants */}
            {hasVariants && (
              <div className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-widest mb-4 text-gray-400">Finish: {fullProduct.variants[selectedVariantIdx].color}</p>
                <div className="flex gap-4">
                  {fullProduct.variants.map((v, i) => (
                    <button 
                      key={i} 
                      onClick={() => {setSelectedVariantIdx(i); setActiveImgIdx(0);}} 
                      className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all cursor-pointer ${selectedVariantIdx === i ? 'border-black scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: v.color.toLowerCase().includes('cream') ? '#f5f5dc' : (v.color.toLowerCase().includes('white') ? '#fff' : '#000') }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} className="w-full py-5 bg-black text-white rounded-full font-bold text-[10px] tracking-[0.3em] uppercase mb-10 hover:bg-[#333] transition-all active:scale-95 shadow-lg cursor-pointer">Add to Cart</button>

            {/* Sidebar Tabs */}
            <div id="sidebar-features" className="bg-[#f2f2f2] rounded-[2.5rem] p-1.5 flex flex-col min-h-[300px] border border-gray-100">
              <div className="flex p-1">
                <button onClick={() => setActiveTab('Features')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer ${activeTab === 'Features' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-black'}`}>Features</button>
                <button onClick={() => setActiveTab('Included')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer ${activeTab === 'Included' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-black'}`}>Included</button>
              </div>
              <div className="px-6 py-8 overflow-y-auto scrollbar-hide h-full">
                {activeTab === 'Features' ? (
                  <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                    {(fullProduct?.highlights || []).map((h, i) => (
                      <div key={i} className="flex flex-col items-center text-center gap-2 group">
                        <div className="text-gray-800 opacity-70 group-hover:scale-110 transition-transform">{iconMap[h.iconName] || <Zap size={24}/>}</div>
                        <p className="text-[10px] font-bold uppercase tracking-tight text-gray-800 leading-tight">{h.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {(fullProduct?.inTheBox || ['Authentic Speaker', 'Premium Cable', 'Quick Start Guide']).map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-[11px] font-bold text-gray-700 uppercase tracking-tighter">
                        <CheckCircle2 size={16} className="text-black"/> {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- VIDEO SECTION --- */}
        <section id="video" className="mb-16 px-6 md:px-12">
          <div className="w-full h-64 md:h-[500px] bg-black rounded-[3rem] overflow-hidden shadow-lg">
            <video className="w-full h-full object-cover" autoPlay muted loop playsInline controls>
              <source src="/342594216c4392756219a48bf547870e0948133c-bg-720p.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

      {/* --- TECH SPECS SECTION - FULLY RESPONSIVE --- */}
<section id="tech-specs-section" className="py-20 md:py-32 bg-white border-t border-gray-50">
  <div className="max-w-[1340px] mx-auto px-6 md:px-12 text-center">
    
    <h2 className="text-4xl md:text-7xl font-medium tracking-tighter mb-12 md:mb-20 uppercase">Tech Specs.</h2>
    
    {/* Category Tabs - Scrollable but scrollbar hidden */}
    <div className="flex justify-start md:justify-center gap-6 md:gap-16 border-b border-gray-100 mb-12 md:mb-20 overflow-x-auto scrollbar-hide px-2">
      {fullProduct?.techSpecs?.map((spec, idx) => (
        <button 
          key={spec.category || idx} 
          onClick={() => setActiveSpecTab(spec.category)} 
          className={`pb-4 text-base md:text-xl font-medium transition-all relative whitespace-nowrap cursor-pointer ${
            activeSpecTab === spec.category ? 'text-black' : 'text-gray-400'
          }`}
        >
          {spec.category}
          {activeSpecTab === spec.category && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full animate-in slide-in-from-left duration-300"/>
          )}
        </button>
      ))}
    </div>

    {/* Content Grid - 1 column on mobile, 3 on desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 md:gap-y-16 text-left max-w-6xl mx-auto">
      {fullProduct?.techSpecs
        ?.filter(s => s.category === activeSpecTab)
        ?.map((spec) => (
          spec.details?.map((detail, idx) => (
            <div key={`${spec.category}-${idx}`} className="animate-in fade-in slide-in-from-bottom-2 duration-500 border-b border-gray-50  md:border-none md:pb-0">
              <h4 className="text-[15px] font-semibold text-black mb-2 tracking-tight">
                {detail.title || (typeof detail === 'string' ? detail.split(':')[0] : 'Spec')}
              </h4>
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed font-light">
                {detail.desc || (typeof detail === 'string' ? detail.split(':').slice(1).join(':') : detail)}
              </p>
            </div>
          ))
        ))}
    </div>
  </div>
</section>

{/* --- RECOMMENDED SECTION - CLICK FIX FOR MOBILE --- */}
<section id="curated-section" className="py-20 md:py-32 bg-white border-t border-gray-50 relative z-10">
  <div className="max-w-[1340px] mx-auto px-6 md:px-12">
    <h2 className="text-3xl md:text-5xl font-medium tracking-tighter mb-12 text-center md:text-left">Recommended for you.</h2>
    
    {/* Grid fix: 2 columns on mobile is better for luxury feel */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
      {relatedProducts.slice(0, 4).map((p) => (
        <div 
          key={p._id} 
          className="group cursor-pointer relative" 
          style={{ touchAction: 'manipulation' }} // Better touch handling for mobile
          onClick={async (e) => {
            e.preventDefault(); // Stop any ghost clicks
            if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            setLoading(true);
            setActiveImgIdx(0);
            setSelectedVariantIdx(0);
            setExpandDescription(false);
            
            try {
              const { data } = await axiosInstance.get(`/products/${p._id}`);
              if (data?.success && data?.product) {
                setFullProduct(data.product);
                setRelatedProducts(data.relatedProducts || []);
                if (data.product.techSpecs?.length > 0) setActiveSpecTab(data.product.techSpecs[0].category);
              }
            } catch (e) { console.error(e); } 
            finally { setLoading(false); }
          }}
        >
          <div className="aspect-square bg-[#f8f8f8] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-10 mb-4 overflow-hidden flex items-center justify-center relative">
            <img 
              src={p.images?.[0]?.url || DEFAULT_IMG} 
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
              alt={p.name} 
            />
          </div>

          <h4 className="font-bold text-[11px] md:text-[13px] uppercase tracking-widest mb-1 group-hover:text-[#C8A253] transition-colors line-clamp-2">
            {p.name}
          </h4>
          <p className="text-gray-400 text-[12px] md:text-sm font-light">
            ₹{p.price?.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
        {/* --- REVIEWS SECTION --- */}
        <section id="reviews-section" className="py-24 border-t border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex justify-center gap-1 mb-6 text-[#C8A253]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} fill="currentColor" size={18} />
              ))}
            </div>
            <h2 className="text-5xl md:text-7xl font-medium tracking-tighter mb-6 leading-tight">
              Sonic Perfection.
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-16">
              {fullProduct?.reviewsCount || "843"} Verified Audiophiles &nbsp;•&nbsp; 4.9 Rating
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryImages.slice(0, 3).map((img, i) => (
                <div key={i} className="aspect-square w-full rounded-[2rem] bg-gray-50 overflow-hidden shadow-sm border border-gray-100 group">
                  <img src={img} className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-opacity group-hover:opacity-100" alt="review" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- STICKY FOOTER --- */}
        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 z-[200] shadow-2xl h-[70px] md:h-[90px] flex items-center px-4 md:px-16 gap-4">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => scrollToSection('product-hero')}>
            <img src={galleryImages[0]} className="w-10 h-10 object-contain mix-blend-multiply" alt="prod"/>
            <div className="hidden sm:block">
              <span className="font-bold text-[10px] uppercase block leading-none mb-1">{fullProduct?.name}</span>
              <span className="text-[9px] font-bold text-[#C8A253]">₹{mainPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center gap-3 md:gap-8 text-[7px] md:text-[10px] font-grey uppercase overflow-x-auto scrollbar-hide">
            <button onClick={() => scrollToSection('curated-section')} className="hover:text-black whitespace-nowrap cursor-pointer">Recommended</button>
            <button onClick={() => scrollToSection('sidebar-features')} className="hover:text-black whitespace-nowrap cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('tech-specs-section')} className="hover:text-black whitespace-nowrap cursor-pointer">Tech Specs</button>
            <button onClick={() => scrollToSection('reviews-section')} className="hover:text-black whitespace-nowrap cursor-pointer">Reviews</button>
          </div>

          <button onClick={handleAddToCart} className="bg-black text-white px-4 py-2 md:px-10 md:py-4 text-[7px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl shrink-0 active:scale-95 hover:bg-[#222] transition-all whitespace-nowrap cursor-pointer">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}