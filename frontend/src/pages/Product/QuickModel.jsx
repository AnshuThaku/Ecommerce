import React, { useState, useEffect } from 'react';
import { X, Battery, Droplets, Shield, Wifi, Bluetooth, Zap, Tag, Star, Plus, CheckCircle2, ShoppingBag } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance'; 

const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

// ⚡ Dynamic Icons Mapper for Highlights
const iconMap = { Battery, Droplets, Shield, Wifi, Bluetooth, Zap, Tag, Star };
const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName] || Tag;
  return <IconComponent size={24} />;
};

export default function QuickViewModal({ product: initialProduct, onClose }) {
  const [expand, setExpand] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [activeSpecTab, setActiveSpecTab] = useState('Audio'); // Tech Specs tabs
  const [fullProduct, setFullProduct] = useState(initialProduct);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  
  // ⚡ BOUGHT TOGETHER STATE
  const [selectedBoughtTogether, setSelectedBoughtTogether] = useState([]);

  useEffect(() => {
    if (initialProduct?._id) {
      const fetchDetails = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${initialProduct._id}`);
          if (data?.success && data?.product) {
            setFullProduct(data.product);
            // Pre-select all bought together items
            if (data.product.boughtTogether) {
              setSelectedBoughtTogether(data.product.boughtTogether.map(p => p._id));
            }
            // Set initial spec tab from first available category
            if (data.product.techSpecs?.length > 0) {
              setActiveSpecTab(data.product.techSpecs[0].category);
            }
          }
        } catch (e) { console.error(e); }
      };
      fetchDetails();
    }
  }, [initialProduct]);

  const hasVariants = fullProduct?.variants?.length > 0;
  
  let galleryImages = (hasVariants && fullProduct.variants[selectedVariantIdx]?.images?.length > 0)
    ? fullProduct.variants[selectedVariantIdx].images.map(img => img.url)
    : (fullProduct.images?.length > 0 ? fullProduct.images.map(img => img.url) : [fullProduct?.image || DEFAULT_IMG]);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 20) setExpand(true);
    else setExpand(false);
  };

  // ⚡ PRICING CALCULATIONS
  const mainPrice = fullProduct?.discountPrice > 0 ? (fullProduct.price - fullProduct.discountPrice) : fullProduct?.price || 0;
  const extraTotal = fullProduct?.boughtTogether?.reduce((total, p) => {
    if (selectedBoughtTogether.includes(p._id)) {
      const pPrice = p.discountPrice > 0 ? (p.price - p.discountPrice) : p.price;
      return total + pPrice;
    }
    return total;
  }, 0) || 0;
  const bundleTotal = mainPrice + extraTotal;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const itemsToAdd = [
      { product: fullProduct._id, variant: hasVariants ? fullProduct.variants[selectedVariantIdx] : null }
    ];

    if (fullProduct.boughtTogether) {
      const extras = fullProduct.boughtTogether
        .filter(p => selectedBoughtTogether.includes(p._id))
        .map(p => ({ product: p._id, variant: null }));
      itemsToAdd.push(...extras);
    }

    console.log("Adding to Cart:", itemsToAdd);
    alert(`${itemsToAdd.length} items added to cart!`);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-hidden p-2 md:p-0" onClick={onClose}>
      <div 
        onScroll={handleScroll}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white transition-all duration-700 ease-in-out overflow-y-auto ${
          expand ? 'w-full h-full rounded-none' : 'w-[95vw] md:w-[90vw] max-w-[1000px] h-[90vh] mt-[5vh] rounded-[24px] shadow-2xl'
        }`}
        style={{ scrollbarWidth: 'none' }}
      >
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="sticky top-6 left-[85%] md:left-[95%] z-[100] p-2 rounded-full hover:bg-gray-200 bg-gray-100/50 backdrop-blur">
          <X size={20}/>
        </button>

        {/* --- MAIN TOP SECTION --- */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-6 md:p-10 pt-16 items-start">
          {/* IMAGE GALLERY */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="rounded-2xl aspect-square flex items-center justify-center p-2 relative bg-gray-50">
              <img src={galleryImages[activeImgIdx]} alt="product" className="w-full h-full object-contain mix-blend-multiply transition-all duration-500" />
              {fullProduct?.discountPrice > 0 && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Sale</div>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {galleryImages.map((img, idx) => (
                <div key={idx} onMouseEnter={() => setActiveImgIdx(idx)} className={`flex-shrink-0 w-20 h-20 rounded-lg cursor-pointer border-2 transition-all ${activeImgIdx === idx ? 'border-black scale-105' : 'border-gray-200'}`}>
                  <img src={img} alt="thumb" className="w-full h-full object-cover rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCT ACTIONS */}
          <div className="w-full md:w-1/2 sticky top-0 self-start mt-5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{fullProduct?.brand}</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{fullProduct?.name}</h1>
            <div className="flex items-baseline gap-3 mb-6">
              <p className="text-2xl font-bold text-black">₹{mainPrice}</p>
              {fullProduct?.discountPrice > 0 && <p className="text-lg text-gray-400 line-through">₹{fullProduct.price}</p>}
            </div>
            
            {hasVariants && (
              <div className="mb-8">
                <p className="text-[10px] font-bold mb-3 uppercase tracking-widest text-gray-500">Available Colors</p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {fullProduct.variants.map((v, idx) => (
                    <button key={idx} onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); setActiveImgIdx(0); }} className={`px-6 py-2.5 border-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${selectedVariantIdx === idx ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} className="bg-black text-white w-full py-4 rounded-full font-bold mb-10 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]">
              <ShoppingBag size={18}/> Add to Cart
            </button>
            
            {/* TABS SECTION */}
            <div className="bg-gray-100 rounded-[2rem] p-4 md:p-6 h-[400px] overflow-y-auto scrollbar-hide border border-gray-200">
              <div className="bg-gray-200/50 p-1 rounded-full flex mb-8 sticky top-0 z-10 backdrop-blur">
                <button onClick={() => setActiveTab('features')} className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === 'features' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>Highlights</button>
                <button onClick={() => setActiveTab('details')} className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === 'details' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>Details</button>
              </div>

              {activeTab === 'features' ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  {fullProduct?.highlights?.map((f, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2 group">
                      <div className="text-gray-900 group-hover:scale-110 transition-transform">{getIcon(f.iconName)}</div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-800 leading-tight">{f.title}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  <div className="text-sm text-gray-600 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: fullProduct?.description }} />
                  {fullProduct?.inTheBox?.length > 0 && (
                    <div className="border-t pt-4">
                       <h4 className="font-bold text-sm mb-4">What's in the box</h4>
                       <ul className="space-y-3">
                         {fullProduct.inTheBox.map((item, idx) => (
                           <li key={idx} className="flex items-center gap-3 text-xs text-gray-600">
                             <CheckCircle2 size={14} className="text-black"/> {item}
                           </li>
                         ))}
                       </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- SCROLLABLE EXTENDED CONTENT --- */}
        <div className={`p-6 md:p-10 transition-all duration-1000 ${expand ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* BOUGHT TOGETHER */}
          {fullProduct?.boughtTogether?.length > 0 && (
            <section id="bundle" className="border-t pt-16 mb-20">
               <div className="max-w-4xl mx-auto bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 italic">Frequently Bought Together</h2>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-white rounded-2xl p-2 border shadow-sm flex items-center justify-center">
                        <img src={galleryImages[0]} alt="main" className="max-h-full mix-blend-multiply" />
                      </div>
                      {fullProduct.boughtTogether.map((item) => selectedBoughtTogether.includes(item._id) && (
                        <React.Fragment key={item._id}>
                          <Plus size={16} className="text-gray-400" />
                          <div className="w-24 h-24 bg-white rounded-2xl p-2 border shadow-sm flex items-center justify-center">
                            <img src={item.images?.[0]?.url || DEFAULT_IMG} alt="extra" className="max-h-full mix-blend-multiply" />
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="md:ml-auto text-center md:text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Bundle Total</p>
                      <p className="text-4xl font-black mb-5">₹{bundleTotal}</p>
                      <button onClick={handleAddToCart} className="bg-black text-white px-10 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">Add {selectedBoughtTogether.length + 1} Items</button>
                    </div>
                  </div>
                  <div className="mt-10 space-y-4 border-t pt-6">
                    {fullProduct.boughtTogether.map((item) => (
                      <label key={item._id} className="flex items-center gap-4 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedBoughtTogether.includes(item._id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedBoughtTogether([...selectedBoughtTogether, item._id]);
                            else setSelectedBoughtTogether(selectedBoughtTogether.filter(id => id !== item._id));
                          }}
                          className="w-5 h-5 rounded-full border-gray-300 text-black focus:ring-black" 
                        />
                        <span className="text-sm font-medium text-gray-600">{item.name} <span className="text-black font-bold ml-2">₹{item.price - (item.discountPrice || 0)}</span></span>
                      </label>
                    ))}
                  </div>
               </div>
            </section>
          )}

          {/* VIDEO SECTION */}
          {fullProduct?.promotionalVideo?.url && (
            <section id="video" className="mb-20">
              <div className="w-full h-64 md:h-[600px] bg-black rounded-[3rem] overflow-hidden shadow-2xl relative">
                <video className="w-full h-full object-cover" autoPlay muted loop playsInline controls poster={fullProduct.promotionalVideo.thumbnailUrl}>
                  <source src={fullProduct.promotionalVideo.url} type="video/mp4" />
                </video>
              </div>
            </section>
          )}

          {/* TECH SPECS TABS */}
          <section id="tech" className="border-t pt-20 mb-20">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-4xl font-bold mb-12 text-center tracking-tighter italic">Technical Specifications</h2>
              <div className="flex justify-center gap-8 text-gray-400 mb-16 text-[10px] font-bold uppercase tracking-widest overflow-x-auto scrollbar-hide border-b border-gray-100 pb-4">
                {fullProduct?.techSpecs?.map((spec) => (
                  <button 
                    key={spec.category}
                    onClick={() => setActiveSpecTab(spec.category)}
                    className={`pb-4 transition-all whitespace-nowrap ${activeSpecTab === spec.category ? 'text-black border-b-2 border-black' : 'hover:text-gray-600'}`}
                  >
                    {spec.category}
                  </button>
                ))}
              </div>
              <div className="max-w-3xl mx-auto min-h-[200px]">
                {fullProduct?.techSpecs?.filter(s => s.category === activeSpecTab).map((spec, i) => (
                  <div key={i} className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium">{spec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* REVIEWS & COMPARE (Placeholder style - kept for UI) */}
          <section id="reviews" className="border-t pt-20 mb-20 text-center">
              <h2 className="text-3xl font-bold mb-10">Sound Rated 4.7/5</h2>
              <div className="flex justify-center gap-4">
                {galleryImages.slice(0,3).map((img, i) => (
                  <img key={i} src={img} className="w-24 h-24 rounded-2xl object-cover border" alt="rev"/>
                ))}
              </div>
          </section>
        </div>

        {/* --- STICKY BOTTOM BAR --- */}
        {expand && (
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t py-4 px-6 md:px-10 flex justify-between items-center z-[100] animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3">
              <img src={galleryImages[0]} alt="p" className="w-10 h-10 object-contain mix-blend-multiply bg-gray-100 rounded-lg p-1" />
              <div>
                <span className="font-bold text-sm block">{fullProduct?.name}</span>
                <span className="text-[10px] font-bold text-[#C8A253]">₹{bundleTotal} Bundle</span>
              </div>
            </div>
            <div className="hidden lg:flex gap-8">
              {[['bundle', 'Bundle'], ['video', 'Visuals'], ['tech', 'Specs']].map(([id, label]) => (
                <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                  {label}
                </button>
              ))}
            </div>
            <button onClick={handleAddToCart} className="bg-black text-white px-8 py-3 rounded-full font-bold text-xs shadow-lg hover:shadow-black/20 transition-all active:scale-95">Add to Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}