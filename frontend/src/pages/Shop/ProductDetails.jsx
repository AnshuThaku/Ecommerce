// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import axiosInstance from '../../utils/axiosInstance';
// import Toast from '../../components/Toast';
// import SearchBar from '../../components/searchbar';
// import { ShoppingBag, Star, ArrowLeft, Truck, ShieldCheck, Zap, Clock, Package, CheckCircle } from 'lucide-react';
// import Footer from '../../pages/Home/Footer';

// // Upar banaye gaye ProductCard ko reuse karenge Recommendations ke liye
// import ProductCard from '../../pages/Home/Productcard'; 

// export default function ProductDetails() {
//   const { id } = useParams(); 
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [similarProducts, setSimilarProducts] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
  
//   const [isDealActiveBackend, setIsDealActiveBackend] = useState(false);
//   const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
//   const [isExpired, setIsExpired] = useState(false);

//   const [toastMessage, setToastMessage] = useState(null);
//   const showToast = (type, message) => setToastMessage({ type, message });

//   // 1. FETCH DETAILS
//   useEffect(() => {
//     const fetchProductAndSimilar = async () => {
//       try {
//         setLoading(true);
//         setIsExpired(false); 
//         const { data } = await axiosInstance.get(`/products/${id}`);
        
//         if (data.success) {
//           setProduct(data.product);
//           setIsDealActiveBackend(data.isDealActive); 
          
//           // Duplicate related products remove karo
//           const uniqueSimilar = data.relatedProducts?.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i) || [];
//           setSimilarProducts(uniqueSimilar); 
          
//           const defaultImage = data.product.variants?.[0]?.images?.[0]?.url || data.product.images?.[0]?.url || 'https://placehold.co/600x600/111/C8A253';
//           setActiveImage(defaultImage);
//         }
//       } catch (error) {
//         showToast('error', 'Failed to load details.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchProductAndSimilar();
//     window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top jab naya product khule
//   }, [id]);

//   // 2. TRACK HISTORY (Sikhaate hain engine ko!)
//   useEffect(() => {
//     if (product && product._id) {
//       const trackProductView = async () => {
//         try {
//           let currentGuestId = localStorage.getItem('guestId');
//           if (!user && !currentGuestId) {
//             currentGuestId = 'guest_' + Math.random().toString(36).substr(2, 9);
//             localStorage.setItem('guestId', currentGuestId);
//           }
//           await axiosInstance.post('/history/add', {
//             type: 'view', productId: product._id, guestId: currentGuestId
//           }, { headers: { 'x-guest-id': currentGuestId } });
//         } catch (error) {}
//       };
//       trackProductView();
//     }
//   }, [product, user]);

//   // 3. TIMER
//   useEffect(() => {
//     if (!product?.flashDeal?.endTime || !isDealActiveBackend) return;
//     const timer = setInterval(() => {
//       const distance = new Date(product.flashDeal.endTime).getTime() - Date.now();
//       if (distance < 0) {
//         clearInterval(timer);
//         setIsExpired(true);
//       } else {
//         setTimeLeft({
//           hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
//           minutes: Math.floor((distance / 1000 / 60) % 60),
//           seconds: Math.floor((distance / 1000) % 60)
//         });
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [product, isDealActiveBackend]);

//   const handleAddToCart = async () => {
//     setIsAddingToCart(true);
//     try {
//       await axiosInstance.post('/cart/add', { productId: product._id, quantity });
//       window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { increase: quantity } }));
//       showToast('success', 'Securing your item...');
//       setTimeout(() => navigate('/cart'), 1000);
//     } catch (error) {
//       showToast('error', 'Failed to secure item in cart.');
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-[#C8A253] font-serif">
//        <div className="w-10 h-10 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin mb-4"></div>
//        Unveiling Details...
//     </div>
//   );

//   if (!product) return <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">Product not found.</div>;

//   const activeFlashDeal = isDealActiveBackend && !isExpired && product.flashDeal?.isActive;
//   let currentPrice = product.price;
//   let originalPrice = product.price;
//   let hasDiscount = false;
//   let discountPercent = 0;

//   if (activeFlashDeal) {
//       currentPrice = product.flashDeal.dealPrice;
//       originalPrice = product.price;
//       hasDiscount = true;
//       discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
//   } else if (product.discountPrice > 0) {
//       currentPrice = product.price - product.discountPrice;
//       originalPrice = product.price;
//       hasDiscount = true;
//       discountPercent = Math.round((product.discountPrice / product.price) * 100);
//   }
  
//   let allImages = [...(product.images || []).map(i => i.url)];
//   product.variants?.forEach(v => { if (v.images) allImages = [...allImages, ...v.images.map(i => i.url)]; });
//   allImages = [...new Set(allImages)].slice(0, 5);

//   const story = product.description || "Experience the pinnacle of craftsmanship and elegant design.";
//   const specs = product.details?.specs || [{ label: "Brand", value: product.brand }, { label: "Category", value: product.category }];
//   const boxItems = product.details?.boxItems || [product.name, "Authenticity Card", "Premium Packaging"];

//   return (
//     <div className="min-h-screen bg-[#0A0A0A] text-white">
//       <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
//       {/* NAVBAR */}
//       <nav className="border-b border-zinc-800 bg-[#111] px-6 py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 sticky top-0 z-40 shadow-xl mb-8">
//         <Link to="/"><h1 className="text-2xl font-serif">LUXE<span className="text-[#C8A253]">.</span></h1></Link>
//         <div className="w-full md:flex-1 md:max-w-xl px-0 md:px-8"><SearchBar /></div>
//         <Link to="/shop" className="text-sm font-medium text-white hover:text-[#C8A253] px-3 py-2">Back to Shop</Link>
//       </nav>

//       <div className="max-w-7xl mx-auto px-6 pb-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
//           {/* IMAGE GALLERY */}
//           <div className="space-y-6">
//             <div className={`aspect-square bg-[#111] rounded-2xl border ${activeFlashDeal ? 'border-red-900/40 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-zinc-800'} p-8 flex items-center justify-center relative overflow-hidden group`}>
//               <img src={activeImage} alt={product.name} className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-700"/>
//               {hasDiscount && (
//                 <div className={`absolute top-6 left-6 text-[#0A0A0A] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-lg flex items-center gap-1 ${activeFlashDeal ? 'bg-red-500 text-white' : 'bg-[#C8A253]'}`}>
//                   {activeFlashDeal && <Zap size={12} className="fill-current" />} {discountPercent}% OFF
//                 </div>
//               )}
//             </div>
            
//             {allImages.length > 1 && (
//               <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
//                 {allImages.map((img, idx) => (
//                   <button key={idx} onClick={() => setActiveImage(img)} className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#111] rounded-xl border ${activeImage === img ? (activeFlashDeal ? 'border-red-500' : 'border-[#C8A253]') : 'border-zinc-800'} p-2 overflow-hidden hover:border-[#C8A253]/50 transition-colors`}>
//                     <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* PRODUCT INFO */}
//           <div className="flex flex-col">
//             <div className="mb-6">
//               <p className="text-[#C8A253] text-sm tracking-[0.2em] uppercase mb-3 font-semibold">{product.category}</p>
//               <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4">{product.name}</h1>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="flex items-center gap-1 text-[#C8A253]">
//                   <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 text-zinc-700" />
//                 </div>
//                 <span className="text-zinc-500 text-sm">{product.reviews?.length || 0} Reviews | {product.soldCount || 0} Sold</span>
//               </div>

//               {activeFlashDeal && (
//                 <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2"><Zap size={20} className="text-red-500 fill-red-500" /><span className="font-bold text-red-400 uppercase tracking-widest text-sm">Lightning Deal</span></div>
//                     <div className="flex items-center gap-2">
//                       <Clock size={16} className="text-red-500" />
//                       <div className="flex gap-1 text-white font-mono font-bold">
//                         <span className="bg-red-950 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
//                         <span className="bg-red-950 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
//                         <span className="bg-red-500 text-white px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="flex items-end gap-4">
//                 <span className={`text-4xl font-serif ${activeFlashDeal ? 'text-red-500 font-bold' : 'text-white'}`}>₹{currentPrice.toLocaleString('en-IN')}</span>
//                 {hasDiscount && <span className="text-xl text-zinc-500 line-through mb-1">₹{originalPrice.toLocaleString('en-IN')}</span>}
//               </div>
//             </div>

//             <p className="text-zinc-400 text-sm leading-relaxed mb-8 border-y border-zinc-800/50 py-6">{story}</p>

//             <div className="flex flex-col sm:flex-row gap-4 mb-10">
//               <div className="flex items-center justify-between bg-[#111] border border-zinc-800 rounded-xl px-4 py-1 w-full sm:w-32 h-14">
//                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-500 hover:text-[#C8A253] p-2 text-xl">−</button>
//                 <span className="font-medium text-lg">{quantity}</span>
//                 <button onClick={() => setQuantity(Math.max(1, quantity + 1))} className="text-zinc-500 hover:text-[#C8A253] p-2 text-xl">+</button>
//               </div>
//               <button 
//                 onClick={handleAddToCart} disabled={isAddingToCart || product.stock < 1}
//                 className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-xl font-bold tracking-widest uppercase transition-all disabled:opacity-50 shadow-lg ${activeFlashDeal ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-[#C8A253] text-[#0A0A0A] hover:bg-[#d4af6b]'}`}
//               >
//                 {isAddingToCart ? 'Securing...' : product.stock < 1 ? 'Sold Out' : <><ShoppingBag className="w-5 h-5" /> {activeFlashDeal ? 'Claim Deal' : 'Buy Now'}</>}
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
//               <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111] border border-zinc-800"><Truck className="w-6 h-6 text-[#C8A253]" /><div><h4 className="text-sm font-semibold text-white">Complimentary Shipping</h4><p className="text-xs text-zinc-500">On all premium orders</p></div></div>
//               <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111] border border-zinc-800"><ShieldCheck className="w-6 h-6 text-[#C8A253]" /><div><h4 className="text-sm font-semibold text-white">Authenticity Guaranteed</h4><p className="text-xs text-zinc-500">Certificate included</p></div></div>
//             </div>
//           </div>
//         </div>

//         {/* OVERVIEW & SPECS */}
//         <div className="border-t border-zinc-800/80 pt-16 mb-24">
//           <h3 className="font-serif italic text-[#C8A253] text-center text-3xl mb-12 flex items-center justify-center gap-3"><Package /> Overview & Specs</h3>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div>
//               <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#111]">
//                 {specs.map((s, i) => (
//                   <div key={i} className={`flex flex-row ${i !== specs.length - 1 ? 'border-b border-zinc-800' : ''}`} style={{ padding: "16px" }}>
//                     <div className="w-[40%] font-black text-zinc-500 uppercase tracking-widest text-[10px]">{s.label}</div>
//                     <div className="w-[60%] text-gray-200 font-bold text-[12px]">{s.value}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-[#111] rounded-xl border border-zinc-800 p-8">
//               <ul className="space-y-4 flex flex-col gap-4">
//                 {boxItems.map((item, i) => (
//                   <li key={i} className="flex items-center text-gray-300 font-medium text-[13px] gap-3"><CheckCircle className="w-5 h-5 text-[#C8A253]" /> {item}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* ⚡ THE RECOMMENDATION ENGINE WIDGET ⚡ */}
//         {similarProducts.length > 0 && (
//           <div className="border-t border-zinc-800/80 pt-16">
//             <h2 className="text-3xl font-serif text-white mb-10 flex items-center gap-3">
//               {isDealActiveBackend ? (
//                 <><Zap className="w-8 h-8 text-red-500 fill-red-500" /> <span className="text-red-500">More Lightning Deals</span></>
//               ) : (
//                 <><span className="w-2 h-2 rounded-full bg-[#C8A253]"></span> You May Also Like</>
//               )}
//             </h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {similarProducts.map((simProduct) => (
//                 // YE REUSE KAREGA SMART CARD KO
//                 <ProductCard key={simProduct._id} product={simProduct} />
//               ))}
//             </div>
//           </div>
//         )}

//       </div>
//       <Footer />
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/Toast';
import SearchBar from '../../components/searchbar';
import { ShoppingBag, Star, ArrowLeft, Truck, ShieldCheck, Zap, Clock, Package, CheckCircle } from 'lucide-react';
import Footer from '../../pages/Home/Footer';

// Upar banaye gaye ProductCard ko reuse karenge Recommendations ke liye
import ProductCard from '../../pages/Home/Productcard'; 

export default function ProductDetails() {
  const { id } = useParams(); 
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const [isDealActiveBackend, setIsDealActiveBackend] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (type, message) => setToastMessage({ type, message });

  // 1. FETCH DETAILS
  useEffect(() => {
    const fetchProductAndSimilar = async () => {
      try {
        setLoading(true);
        setIsExpired(false); 
        const { data } = await axiosInstance.get(`/products/${id}`);
        
        if (data.success) {
          setProduct(data.product);
          setIsDealActiveBackend(data.isDealActive); 
          
          // Duplicate related products remove karo
          const uniqueSimilar = data.relatedProducts?.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i) || [];
          setSimilarProducts(uniqueSimilar); 
          
          const defaultImage = data.product.variants?.[0]?.images?.[0]?.url || data.product.images?.[0]?.url || 'https://placehold.co/600x600/111/C8A253';
          setActiveImage(defaultImage);
        }
      } catch (error) {
        showToast('error', 'Failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndSimilar();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top jab naya product khule
  }, [id]);

  // 2. TRACK HISTORY (Sikhaate hain engine ko!)
  useEffect(() => {
    if (product && product._id) {
      const trackProductView = async () => {
        try {
          let currentGuestId = localStorage.getItem('guestId');
          if (!user && !currentGuestId) {
            currentGuestId = 'guest_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('guestId', currentGuestId);
          }
          await axiosInstance.post('/history/add', {
            type: 'view', productId: product._id, guestId: currentGuestId
          }, { headers: { 'x-guest-id': currentGuestId } });
        } catch (error) {}
      };
      trackProductView();
    }
  }, [product, user]);

  // 3. TIMER
  useEffect(() => {
    if (!product?.flashDeal?.endTime || !isDealActiveBackend) return;
    const timer = setInterval(() => {
      const distance = new Date(product.flashDeal.endTime).getTime() - Date.now();
      if (distance < 0) {
        clearInterval(timer);
        setIsExpired(true);
      } else {
        setTimeLeft({
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [product, isDealActiveBackend]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await axiosInstance.post('/cart/add', { productId: product._id, quantity });
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { increase: quantity } }));
      showToast('success', 'Securing your item...');
      setTimeout(() => navigate('/cart'), 1000);
    } catch (error) {
      showToast('error', 'Failed to secure item in cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#C8A253] font-serif">
       <div className="w-10 h-10 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin mb-4"></div>
       Unveiling Details...
    </div>
  );

  if (!product) return <div className="min-h-screen bg-white text-black flex items-center justify-center">Product not found.</div>;

  const activeFlashDeal = isDealActiveBackend && !isExpired && product.flashDeal?.isActive;
  let currentPrice = product.price;
  let originalPrice = product.price;
  let hasDiscount = false;
  let discountPercent = 0;

  if (activeFlashDeal) {
      currentPrice = product.flashDeal.dealPrice;
      originalPrice = product.price;
      hasDiscount = true;
      discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  } else if (product.discountPrice > 0) {
      currentPrice = product.price - product.discountPrice;
      originalPrice = product.price;
      hasDiscount = true;
      discountPercent = Math.round((product.discountPrice / product.price) * 100);
  }
  
  let allImages = [...(product.images || []).map(i => i.url)];
  product.variants?.forEach(v => { if (v.images) allImages = [...allImages, ...v.images.map(i => i.url)]; });
  allImages = [...new Set(allImages)].slice(0, 5);

  const story = product.description || "Experience the pinnacle of craftsmanship and elegant design.";
  const specs = product.details?.specs || [{ label: "Brand", value: product.brand }, { label: "Category", value: product.category }];
  const boxItems = product.details?.boxItems || [product.name, "Authenticity Card", "Premium Packaging"];

  return (
    <div className="min-h-screen bg-white text-black">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      {/* NAVBAR */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 sticky top-0 z-40 shadow-sm mb-8">
        <Link to="/"><h1 className="text-2xl font-serif">LUXE<span className="text-[#C8A253]">.</span></h1></Link>
        <div className="w-full md:flex-1 md:max-w-xl px-0 md:px-8"><SearchBar /></div>
        <Link to="/shop" className="text-sm font-medium text-black hover:text-[#C8A253] px-3 py-2">Back to Shop</Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* IMAGE GALLERY */}
          <div className="space-y-6">
            <div className={`aspect-square bg-gray-50 rounded-2xl border ${activeFlashDeal ? 'border-red-200 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-gray-200'} p-8 flex items-center justify-center relative overflow-hidden group`}>
              <img src={activeImage} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"/>
              {hasDiscount && (
                <div className={`absolute top-6 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-lg flex items-center gap-1 ${activeFlashDeal ? 'bg-red-500 text-white' : 'bg-[#C8A253] text-white'}`}>
                  {activeFlashDeal && <Zap size={12} className="fill-current" />} {discountPercent}% OFF
                </div>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {allImages.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(img)} className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-50 rounded-xl border ${activeImage === img ? (activeFlashDeal ? 'border-red-500' : 'border-[#C8A253]') : 'border-gray-200'} p-2 overflow-hidden hover:border-[#C8A253]/50 transition-colors`}>
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-[#C8A253] text-sm tracking-[0.2em] uppercase mb-3 font-semibold">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4 text-black">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-[#C8A253]">
                  <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-gray-500 text-sm">{product.reviews?.length || 0} Reviews | {product.soldCount || 0} Sold</span>
              </div>

              {activeFlashDeal && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Zap size={20} className="text-red-500 fill-red-500" /><span className="font-bold text-red-600 uppercase tracking-widest text-sm">Lightning Deal</span></div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-red-500" />
                      <div className="flex gap-1 text-red-700 font-mono font-bold">
                        <span className="bg-red-100 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
                        <span className="bg-red-100 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
                        <span className="bg-red-500 text-white px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-4">
                <span className={`text-4xl font-serif ${activeFlashDeal ? 'text-red-600 font-bold' : 'text-black'}`}>₹{currentPrice.toLocaleString('en-IN')}</span>
                {hasDiscount && <span className="text-xl text-gray-500 line-through mb-1">₹{originalPrice.toLocaleString('en-IN')}</span>}
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-8 border-y border-gray-200 py-6">{story}</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-1 w-full sm:w-32 h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-[#C8A253] p-2 text-xl">−</button>
                <span className="font-medium text-lg text-black">{quantity}</span>
                <button onClick={() => setQuantity(Math.max(1, quantity + 1))} className="text-gray-500 hover:text-[#C8A253] p-2 text-xl">+</button>
              </div>
              <button 
                onClick={handleAddToCart} disabled={isAddingToCart || product.stock < 1}
                className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-xl font-bold tracking-widest uppercase transition-all disabled:opacity-50 shadow-md ${activeFlashDeal ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-[#C8A253] text-white hover:bg-[#d4af6b]'}`}
              >
                {isAddingToCart ? 'Securing...' : product.stock < 1 ? 'Sold Out' : <><ShoppingBag className="w-5 h-5" /> {activeFlashDeal ? 'Claim Deal' : 'Buy Now'}</>}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200"><Truck className="w-6 h-6 text-[#C8A253]" /><div><h4 className="text-sm font-semibold text-black">Complimentary Shipping</h4><p className="text-xs text-gray-500">On all premium orders</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200"><ShieldCheck className="w-6 h-6 text-[#C8A253]" /><div><h4 className="text-sm font-semibold text-black">Authenticity Guaranteed</h4><p className="text-xs text-gray-500">Certificate included</p></div></div>
            </div>
          </div>
        </div>

        {/* OVERVIEW & SPECS */}
        <div className="border-t border-gray-200 pt-16 mb-24">
          <h3 className="font-serif italic text-[#C8A253] text-center text-3xl mb-12 flex items-center justify-center gap-3"><Package /> Overview & Specs</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                {specs.map((s, i) => (
                  <div key={i} className={`flex flex-row ${i !== specs.length - 1 ? 'border-b border-gray-200' : ''}`} style={{ padding: "16px" }}>
                    <div className="w-[40%] font-black text-gray-500 uppercase tracking-widest text-[10px]">{s.label}</div>
                    <div className="w-[60%] text-gray-800 font-bold text-[12px]">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
              <ul className="space-y-4 flex flex-col gap-4">
                {boxItems.map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium text-[13px] gap-3"><CheckCircle className="w-5 h-5 text-[#C8A253]" /> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ⚡ THE RECOMMENDATION ENGINE WIDGET ⚡ */}
        {similarProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-serif text-black mb-10 flex items-center gap-3">
              {isDealActiveBackend ? (
                <><Zap className="w-8 h-8 text-red-500 fill-red-500" /> <span className="text-red-600">More Lightning Deals</span></>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-[#C8A253]"></span> You May Also Like</>
              )}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((simProduct) => (
                <ProductCard key={simProduct._id} product={simProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}