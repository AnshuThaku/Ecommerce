import React, { useState, useRef, useEffect } from 'react';
import { X, Battery, Droplets, Shield, Wifi, Bluetooth, Zap, Tag, Star } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance'; 

const DEFAULT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600";

export default function QuickViewModal({ product: initialProduct, onClose }) {
  const [expand, setExpand] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [fullProduct, setFullProduct] = useState(initialProduct);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  useEffect(() => {
    if (initialProduct?._id) {
      const fetchDetails = async () => {
        try {
          const { data } = await axiosInstance.get(`/products/${initialProduct._id}`);
          if (data?.success && data?.product) setFullProduct(data.product);
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart internally");
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-hidden" onClick={onClose}>
      <div 
        onScroll={handleScroll}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white transition-all duration-700 ease-in-out overflow-y-auto ${
          expand ? 'w-full h-full rounded-none' : 'w-[90vw] max-w-[1000px] h-[85vh] mt-[5vh] rounded-[24px] shadow-2xl'
        }`}
        style={{ scrollbarWidth: 'none' }}
      >
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="sticky top-6 left-[95%] z-[100] p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <X size={20}/>
        </button>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-6 md:p-10 pt-16 items-start">
          {/* Main Image aur Thumbnails (Thumbnails ab niche hain) */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl aspect-square flex items-center justify-center p-4">
              <img src={galleryImages[activeImgIdx]} alt="product" className="max-h-[300px] max-w-full mix-blend-multiply" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {galleryImages.map((img, idx) => (
                <div key={idx} onMouseEnter={() => setActiveImgIdx(idx)} className={`flex-shrink-0 w-20 h-20 rounded-lg cursor-pointer border-2 ${activeImgIdx === idx ? 'border-black' : 'border-gray-200'}`}>
                  <img src={img} alt="thumb" className="w-full h-full object-cover rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Scrollable Details */}
          <div className="w-full md:w-1/2 sticky top-0 self-start">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{fullProduct?.name}</h1>
            <p className="text-xl md:text-2xl font-semibold mb-6">₹{fullProduct?.price}</p>
            
            {hasVariants && (
              <div className="mb-6">
                <p className="text-sm font-bold mb-2 uppercase tracking-widest text-gray-500">Color</p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {fullProduct.variants.map((v, idx) => (
                    <button key={idx} onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); setActiveImgIdx(0); }} className={`px-5 py-2 border-2 rounded-full font-medium flex-shrink-0 ${selectedVariantIdx === idx ? 'border-black bg-black text-white' : 'border-gray-200'}`}>
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} className="bg-black text-white w-full py-4 rounded-full font-bold mb-10 hover:opacity-90">Add to Cart</button>
            
            {/* Scrollable Features/Details Box */}
            <div className="bg-gray-300 rounded-2xl p-4 md:p-6 h-[400px] overflow-y-auto">
              <div className="bg-gray-100 p-1.5 rounded-full flex mb-8 sticky top-0 z-10">
                <button onClick={(e) => { e.stopPropagation(); setActiveTab('features'); }} className={`flex-1 py-3 rounded-full font-bold transition-all ${activeTab === 'features' ? 'bg-white shadow' : 'text-gray-500'}`}>Features</button>
                <button onClick={(e) => { e.stopPropagation(); setActiveTab('details'); }} className={`flex-1 py-3 rounded-full font-bold transition-all ${activeTab === 'details' ? 'bg-white shadow' : 'text-gray-500'}`}>Details</button>
              </div>

              {activeTab === 'features' ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  {[
                    { icon: <Battery />, title: "24-hour battery life" },
                    { icon: <Droplets />, title: "Waterproof (IP67)" },
                    { icon: <Shield />, title: "Drop resistant" },
                    { icon: <Wifi />, title: "WiFi" },
                    { icon: <Bluetooth />, title: "Bluetooth" },
                    { icon: <Zap />, title: "Charging Base" },
                    { icon: <Tag />, title: "Automatic Trueplay" },
                    { icon: <Star />, title: "Voice enabled" }
                  ].map((f, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2">
                      <div className="text-gray-900">{f.icon}</div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-800 leading-tight">
                        {f.title}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-6">What's in the box</h3>
                  <ul className="list-disc list-inside space-y-3 text-gray-700 text-sm">
                    <li>{fullProduct?.name || "Product"} Speaker</li>
                    <li>Charging Base</li>
                    <li>Quickstart Guide</li>
                    <li>Warranty Information</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Baki sections wahi purane jaise hain */}
        <div className={`p-6 md:p-10 transition-opacity duration-500 ${expand ? 'opacity-100' : 'opacity-0'}`}>
          
         <section id="video" className="mb-16">
  <div className="w-full h-100 bg-black rounded-3xl overflow-hidden shadow-lg">
    
    <video 
      className="w-full h-full object-cover" 
      autoPlay 
      muted 
      loop 
      controls
    >
      <source src="vi.mp4" type="video/mp4" />
    </video>

  </div>
</section>

      <section id="tech" className="border-t pt-12 mb-16 md:mb-20">

  <div className="max-w-6xl mx-auto px-4">

    <h2 className="text-5xl font-bold mb-12 text-center">Tech Specs</h2>

    {/* Tabs */}
    <div className="flex justify-center gap-10 text-gray-500 mb-12 text-lg">
      <span className="text-black border-b-2 border-black pb-1">Audio</span>
      <span>Details + Dimensions</span>
      <span>Power + Connectivity</span>
      <span>Box Contents</span>
      <span>Requirements</span>
    </div>

    {/* Grid */}
    <div className="grid md:grid-cols-3 gap-12 text-center">

      <div>
        <h4 className="font-semibold text-lg mb-2">Amplifiers</h4>
        <p className="text-gray-600">
          Two Class-H digital amplifiers have been perfectly tuned to the speaker's unique acoustic architecture.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Tweeters</h4>
        <p className="text-gray-600">
          One tweeter creates a crisp, high-frequency response.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Midwoofers</h4>
        <p className="text-gray-600">
          One midwoofer ensures faithful playback of mid-range frequencies and maximises low-end output.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Microphones</h4>
        <p className="text-gray-600">
          The far-field microphone array uses advanced beamforming and multi-channel echo cancellation.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Adjustable EQ</h4>
        <p className="text-gray-600">
          Use the app to adjust bass, treble, and loudness.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Automatic Trueplay</h4>
        <p className="text-gray-600">
          This software smartly optimises the sound for the environment and audio content.
        </p>
      </div>

    </div>

  </div>

</section>



{/* PLAY YOUR WAY SECTION */}
<section id="play-way" className="border-t pt-16 mb-16 text-center">
  <div className="max-w-3xl mx-auto mb-12">
    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
      Play your way, at home or away
    </h2>
    <p className="text-lg text-gray-700 leading-relaxed">
      Connect over WiFi to unlock the full experience and enjoy easy listening in every room.
      Switch to Bluetooth to keep the music going anywhere.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
    {[
      { title: "Everything works together", desc: "Connect over WiFi and enjoy listening in more rooms." },
      { title: "Home sound, anywhere", desc: "Take your system with you. Group for bigger sound." },
      { title: "Tunes itself like magic", desc: "Automatic Trueplay tunes clear, balanced sound." },
    ].map((item, i) => (
      <div key={i} className="flex flex-col items-center text-center">

        {/* IMAGE FIXED */}
        <div className="aspect-[4/5] w-[85%] max-w-[260px] bg-gray-100 rounded-[32px] overflow-hidden mb-4 shadow-sm mx-auto">
          <img
            src={galleryImages[i % galleryImages.length] || DEFAULT_IMG}
            alt="feat"
            className="w-full h-full object-cover"
          />
        </div>

        <h4 className="font-bold text-xl mb-2">{item.title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>

      </div>
    ))}
  </div>
</section>


<section id="lifestyle" className="border-t pt-16 mb-16 text-center">
  <h2 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">
    Big sound. Just the right size.
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-2">
    {[
      { title: "24-hour battery life", desc: "Leave the charger and your worries behind." },
      { title: "Stereo sound", desc: "Bring powerful sound to any room." },
      { title: "Waterproof", desc: "Weathers splashes, snow, and rain." },
    ].map((item, i) => (
      <div key={i} className="flex flex-col items-center  text-center">

        {/* IMAGE FIXED */}
        <div className="aspect-[4/5] w-[85%] max-w-[260px] bg-gray-400 rounded-[32px] overflow-hidden mb-4 shadow-sm mx-auto">
          <img
            src={galleryImages[i % galleryImages.length] || DEFAULT_IMG}
            alt="lifestyle"
            className="w-full h-full object-cover"
          />
        </div>

        <h4 className="font-bold text-xl mb-2">{item.title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>

      </div>
    ))}
  </div>
</section>
          
           
<section id="reviews" className="border-t pt-12 mb-16 flex justify-center">

  <div className="w-full max-w-6xl px-4">

    <h2 className="text-5xl font-bold mb-10 text-center">
      Reviews
    </h2>

    {/* Variant Images (DYNAMIC) */}
    <div className="flex justify-center gap-3 overflow-x-auto mb-8">
      {(galleryImages?.length ? galleryImages : [DEFAULT_IMG])
        .slice(0, 5)
        .map((img, i) => (
          <img
            key={i}
            src={img}
            alt="review-img"
            className="w-32 h-32 object-cover rounded-lg border hover:scale-105 transition"
          />
      ))}
    </div>

    {/* Rating Summary */}
    <div className="flex justify-center items-center gap-6 mb-10">
      <div className="text-5xl font-bold text-black">4.7</div>
      <div className="text-gray-600 text-lg">843 Reviews</div>
    </div>

    {/* Grid Section */}
    <div className="grid md:grid-cols-3 gap-8">

      {/* Rating Distribution */}
      <div className="bg-gray-50 p-6 rounded-2xl">
        <h3 className="font-semibold mb-4 text-center text-lg">
          Ratings Distribution
        </h3>

        {[5, 4, 3, 2, 1].map((star, i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <span className="w-12 font-medium">{star}★</span>

            <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-orange-400 h-3 rounded-full"
                style={{ width: `${[80, 40, 20, 10, 5][i]}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pros */}
      <div className="bg-gray-50 p-6 rounded-2xl">
        <h3 className="font-semibold mb-4 text-center text-lg">
          Pros
        </h3>

        {["Wireless", "Easy Setup", "Superior Sound", "Long Battery"].map(
          (item, i) => (
            <div key={i} className="flex justify-between mb-3">
              <span className="text-gray-700">{item}</span>
              <span className="bg-gray-200 px-2 rounded text-sm">
                {600 - i * 50}
              </span>
            </div>
          )
        )}
      </div>

      {/* Cons */}
      <div className="bg-gray-50 p-6 rounded-2xl">
        <h3 className="font-semibold mb-4 text-center text-lg">
          Cons
        </h3>

        {["Price High", "Heavy", "Limited Colors"].map((item, i) => (
          <div key={i} className="flex justify-between mb-3">
            <span className="text-gray-700">{item}</span>
            <span className="bg-gray-200 px-2 rounded text-sm">
              {50 - i * 10}
            </span>
          </div>
        ))}
      </div>

    </div>

  </div>
</section>

         <section id="compare" className="border-t pt-12 mb-16">

  <div className="max-w-6xl mx-auto px-4">

    <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center">
      Compare
    </h2>

    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

      {[
        { name: "Roam 2", price: "₹18,999" },
        { name: "Sonos Play", price: "₹31,999" },
        { name: "Move 2", price: "₹44,999" }
      ].map((item, i) => (
        
        <div 
          key={i} 
          className="bg-gray-100 p-6 rounded-2xl text-center hover:scale-105 transition duration-300"
        >
          <img 
            src={galleryImages[0]} 
            alt={item.name} 
            className="h-28 w-40 mx-auto mb-4 object-cover rounded-md mix-blend-multiply"
          />

          <h4 className="font-bold text-xl">{item.name}</h4>
          <p className="font-bold text-gray-700">{item.price}</p>
        </div>

      ))}

    </div>

  </div>

</section>
        </div>

        {expand && (
          <div className="sticky bottom-0 bg-white border-t py-4 px-6 md:px-10 flex flex-wrap gap-2 justify-between items-center shadow-2xl z-[50]">
            <div className="flex items-center gap-2">
               <img src={galleryImages[0]} alt={fullProduct?.name} className="w-8 h-8 object-cover rounded-md mix-blend-multiply" />
               <span className="font-bold text-sm truncate">{fullProduct?.name}</span>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {[['tech', 'Specs'], ['play-way', 'Play'], ['lifestyle', 'Lifestyle'], ['reviews', 'Reviews'], ['compare', 'Compare']].map(([id, label]) => (
                <button key={id} onClick={(e) => { e.stopPropagation(); document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }} className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black whitespace-nowrap">
                  {label}
                </button>
              ))}
            </div>
            <button onClick={handleAddToCart} className="bg-black text-white px-6 py-2 rounded-full font-bold text-xs">Add to Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}