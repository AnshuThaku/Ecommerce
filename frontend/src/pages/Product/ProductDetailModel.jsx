import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, ShoppingBag, CheckCircle2, Battery, Droplets, Wifi, Bluetooth, Zap, Shield, Tv, Volume, Smartphone, Mic } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

// ⚡ Dynamic Icon Mapper for Marshall/Sonos
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

export default function QuickViewModal({ product: initialProduct, onClose }) {
  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);
  const [activeTab, setActiveTab] = useState('Features'); 
  const [fullProduct, setFullProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [activeSpecTab, setActiveSpecTab] = useState('');
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
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
  }, [initialProduct]);

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

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex items-start justify-center overflow-hidden font-sans text-[#1a1a1a]" onClick={onClose}>
      <div ref={modalRef} onScroll={(e) => setExpand(e.target.scrollTop > 100)} onClick={(e) => e.stopPropagation()} className="w-full h-full overflow-y-auto scroll-smooth scrollbar-hide">
        
        {/* --- TOP NAV --- */}
        <nav id="product-hero" className={`sticky top-0 z-[150] w-full bg-white transition-all duration-300 border-b border-gray-50 ${expand ? 'py-4' : 'py-7'}`}>
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => navigate('/')}>
               <img src="/Truee_Luxury_Logo.png" alt="Truee" className="h-10 md:h-12 w-auto object-contain brightness-0" />    
               <span className="text-[9px] font-bold tracking-[0.4em] uppercase mt-1 text-black opacity-80">TRUEE</span>
            </div>
            {expand && (
               <div className="hidden md:flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                 <img src={galleryImages[0]} className="w-8 h-8 object-contain" alt="p"/>
                 <span className="font-bold text-[10px] uppercase tracking-widest text-gray-500">{fullProduct?.name}</span>
               </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all"><X size={22} /></button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
          <div className="w-full lg:w-[65%] lg:sticky lg:top-32 self-start">
             <div className="bg-[#f7f7f7] aspect-[16/10] rounded-sm flex items-center justify-center p-8 md:p-16 relative overflow-hidden group">
                <img src={galleryImages[activeImgIdx]} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" alt="main" />
             </div>
             <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
                {galleryImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImgIdx(i)} className={`w-24 h-24 bg-[#f7f7f7] p-2 border-b-2 transition-all flex-shrink-0 ${activeImgIdx === i ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}>
                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="t" />
                  </button>
                ))}
             </div>
          </div>

          <div className="w-full lg:w-[30%] flex flex-col pt-4">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 leading-tight">{fullProduct?.name}</h1>
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-6 mb-6">
                <p className="text-3xl font-light text-black">₹{mainPrice.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#C8A253] uppercase tracking-widest"><Star size={12} fill="#C8A253"/> 4.9/5</div>
              </div>

              {hasVariants && (
                <div className="mb-6">
                  <p className="text-[11px] font-black uppercase tracking-widest mb-4 text-gray-400">Finish: {fullProduct.variants[selectedVariantIdx].color}</p>
                  <div className="flex gap-4">
                    {fullProduct.variants.map((v, i) => (
                      <button key={i} onClick={() => {setSelectedVariantIdx(i); setActiveImgIdx(0);}} className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${selectedVariantIdx === i ? 'border-black scale-110' : 'border-gray-200'}`}>
                        <div className="w-full h-full rounded-full" style={{ backgroundColor: v.color.toLowerCase().includes('cream') ? '#f5f5dc' : (v.color.toLowerCase().includes('white') ? '#fff' : '#000') }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full py-5 bg-black text-white rounded-full font-bold text-[10px] tracking-[0.3em] uppercase mb-10 hover:bg-[#333] transition-all active:scale-95 shadow-lg">Add to Cart</button>

              <div id="sidebar-features" className="bg-[#f2f2f2] rounded-[2.5rem] p-1.5 flex flex-col min-h-[450px] border border-gray-100">
                <div className="flex p-1">
                   <button onClick={() => setActiveTab('Features')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'Features' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-black'}`}>Features</button>
                   <button onClick={() => setActiveTab('Included')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'Included' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-black'}`}>Included</button>
                </div>
                <div className="px-6 py-8 overflow-y-auto scrollbar-hide h-full">
                  {activeTab === 'Features' ? (
                    <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                      {(fullProduct?.highlights || []).map((h, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-3 group">
                          <div className="text-gray-800 opacity-70 group-hover:scale-110 transition-transform">{iconMap[h.iconName] || <Zap size={24}/>}</div>
                          <p className="text-[11px] font-bold uppercase tracking-tight text-gray-800 leading-tight">{h.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                      {(fullProduct?.inTheBox && fullProduct.inTheBox.length > 0 ? fullProduct.inTheBox : ['Authentic Speaker', 'Premium Cable', 'Quick Start Guide']).map((item, i) => (
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

        {/* --- DYNAMIC TECH SPECS (FIXED FOR ARRAY) --- */}
        <section id="tech-specs-section" className="py-32 bg-white border-t border-gray-50">
           <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
              <h2 className="text-6xl md:text-8xl font-medium tracking-tighter mb-20 uppercase italic">Tech Specs.</h2>
              
              <div className="flex justify-center gap-8 md:gap-16 border-b border-gray-100 mb-20 overflow-x-auto scrollbar-hide px-4">
                 {fullProduct?.techSpecs?.map((spec, idx) => (
                   <button 
                    key={spec.category || idx} 
                    onClick={() => setActiveSpecTab(spec.category)} 
                    className={`pb-8 text-xl md:text-2xl font-light transition-all relative whitespace-nowrap ${activeSpecTab === spec.category ? 'text-black opacity-100 font-normal scale-110' : 'text-gray-300 hover:text-gray-500'}`}
                   >
                     {spec.category}
                     {activeSpecTab === spec.category && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black rounded-full animate-in slide-in-from-left duration-500"/>}
                   </button>
                 ))}
              </div>

              {/* ⚡ Content Grid - Correctly mapping the "details" array from your data */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 text-left max-w-6xl mx-auto min-h-[300px]">
                 {fullProduct?.techSpecs?.filter(s => s.category === activeSpecTab).map((spec) => (
                    spec.details?.map((detail, idx) => (
                      <div key={`${spec.category}-${idx}`} className="animate-in fade-in slide-in-from-bottom-5 duration-700 border-l border-gray-100 pl-6 group">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A253] mb-3 group-hover:translate-x-2 transition-transform">
                          {spec.category} Specification {idx+1}
                        </h4>
                        <p className="text-[16px] md:text-[18px] text-gray-700 leading-relaxed font-light">{detail}</p>
                      </div>
                    ))
                 ))}
                 {!fullProduct?.techSpecs?.some(s => s.category === activeSpecTab) && (
                   <div className="col-span-3 py-20 text-gray-300 italic uppercase tracking-widest">No details available for this section</div>
                 )}
              </div>
           </div>
        </section>

        {/* --- CURATED FOR YOU (RECOMMENDED) --- */}
        <section id="curated-section" className="py-32 bg-white border-t border-gray-50">
           <div className="max-w-[1440px] mx-auto px-6 md:px-12">
              <h2 className="text-5xl font-medium tracking-tighter mb-16 italic text-center md:text-left">Curated for you.</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                 {relatedProducts.slice(0,4).map((p) => (
                    <div key={p._id} className="group cursor-pointer" onClick={() => { window.location.href = `/product/${p._id}` }}>
                       <div className="aspect-square bg-[#f8f8f8] rounded-[2.5rem] p-10 mb-6 overflow-hidden flex items-center justify-center relative">
                          <img src={p.images?.[0]?.url || DEFAULT_IMG} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" alt="rel" />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">Quick View</span>
                          </div>
                       </div>
                       <h4 className="font-bold text-[13px] uppercase tracking-widest mb-2 group-hover:text-[#C8A253] transition-colors">{p.name}</h4>
                       <p className="text-gray-400 text-sm font-light">₹{p.price?.toLocaleString()}</p>
                    </div>
                 ))}
                 {relatedProducts.length === 0 && (
                   <div className="col-span-4 text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 uppercase tracking-widest text-xs">Discovering more luxury...</div>
                 )}
              </div>
           </div>
        </section>

        {/* --- REVIEWS SECTION --- */}
        <section id="reviews-section" className="py-32 bg-[#f9f9f9] text-center border-t border-gray-100">
            <div className="mb-20 px-6">
                <div className="flex justify-center gap-1 mb-6 text-[#C8A253]">
                  {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={20}/>)}
                </div>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 italic leading-none">Sonic Perfection.</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[11px]">843 Verified Audiophiles &nbsp;•&nbsp; 4.9 Rating</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 px-6 pb-20">
              {galleryImages.slice(0,3).map((img, i) => (
                <div key={i} className="w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-white overflow-hidden shadow-2xl border-4 border-gray-50 group hover:rotate-2 transition-all duration-500">
                  <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt="rev"/>
                </div>
              ))}
            </div>
        </section>

        {/* --- STICKY FOOTER --- */}
        {expand && (
          <div className="sticky bottom-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 py-6 px-6 md:px-16 z-[200] flex justify-between items-center animate-in slide-in-from-bottom duration-700 shadow-2xl">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollToSection('product-hero')}>
               <img src={galleryImages[0]} className="w-12 h-12 object-contain mix-blend-multiply border rounded-lg p-1 bg-gray-50 hover:scale-110 transition-transform" alt="m"/>
               <div className="hidden sm:block">
                  <span className="font-bold text-xs uppercase tracking-widest block leading-none mb-1">{fullProduct?.name}</span>
                  <span className="text-[9px] font-bold text-[#C8A253] uppercase tracking-widest">₹{mainPrice.toLocaleString()}</span>
               </div>
            </div>
            
            <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
               <button onClick={() => scrollToSection('curated-section')} className="hover:text-black transition-all hover:scale-110">Recommended</button>
               <button onClick={() => scrollToSection('sidebar-features')} className="hover:text-black transition-all hover:scale-110">Features</button>
               <button onClick={() => scrollToSection('tech-specs-section')} className="hover:text-black transition-all hover:scale-110">Tech Specs</button>
               <button onClick={() => scrollToSection('reviews-section')} className="hover:text-black transition-all hover:scale-110">Reviews</button>
            </div>

            <button className="bg-black text-white px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl active:scale-95 hover:bg-[#222] transition-all">Add to Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}