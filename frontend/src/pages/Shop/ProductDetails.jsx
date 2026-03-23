import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/Toast';
import SearchBar from '../../components/SearchBar';
import { ShoppingBag, Star, ArrowLeft, Truck, ShieldCheck, Zap, Clock } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams(); 
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // ⚡ FLASH DEAL STATES ⚡
  const [isDealActiveBackend, setIsDealActiveBackend] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (type, message) => setToastMessage({ type, message });

  // --- FETCH PRODUCT LOGIC ---
  useEffect(() => {
    const fetchProductAndSimilar = async () => {
      try {
        setLoading(true);
        setIsExpired(false); // Reset expire state on new product load
        
        const { data } = await axiosInstance.get(`/products/${id}`);
        
        if (data.success) {
          const fetchedProduct = data.product;
          setProduct(fetchedProduct);
          setIsDealActiveBackend(data.isDealActive); // ⚡ Backend ne bataya deal hai ya nahi
          setSimilarProducts(data.relatedProducts || []); // ⚡ Backend ne directly isolation ke sath list bhej di
          
          const defaultImage = fetchedProduct.variants?.[0]?.images?.[0]?.url 
                             || fetchedProduct.images?.[0]?.url 
                             || 'https://placehold.co/600x600/111/C8A253?text=Luxury+Item';
          setActiveImage(defaultImage);
        }
      } catch (error) {
        showToast('error', 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndSimilar();
    window.scrollTo(0, 0); 
  }, [id]);

  // --- ⚡ TIMER LOGIC ⚡ ---
  useEffect(() => {
    if (!product?.flashDeal?.endTime || !isDealActiveBackend) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(product.flashDeal.endTime).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsExpired(true); // Boom! Time's up.
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

  // --- HISTORY TRACKING LOGIC ---
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
            type: 'view',
            productId: product._id,
            guestId: currentGuestId
          }, {
            headers: { 'x-guest-id': currentGuestId }
          });
        } catch (error) {
          console.error("History tracking failed", error);
        }
      };
      trackProductView();
    }
  }, [product, user]);

  // --- ADD TO CART ---
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await axiosInstance.post('/cart/add', { productId: product._id, quantity });
      showToast('success', 'Securing your item...');
      setTimeout(() => navigate('/cart'), 1000);
    } catch (error) {
      if(error.response?.status === 401) {
        showToast('info', 'Please login to secure your purchase.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showToast('error', 'Failed to secure item in cart.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- HELPERS ---
  const getMainImage = (p) => {
    if (p.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
    if (p.images?.[0]?.url) return p.images[0].url;
    return 'https://placehold.co/400x400/111/C8A253?text=Boutique';
  };

  const createProductUrl = (prod) => {
    const catSlug = prod.category ? prod.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category';
    const brandSlug = prod.brand ? prod.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'brand';
    const nameSlug = prod.name ? prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
    return `/${catSlug}/${brandSlug}/${nameSlug}/p/${prod._id}`;
  };

  // --- RENDERS ---
  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-[#C8A253] font-serif">
       <div className="w-10 h-10 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin mb-4"></div>
       Unveiling Details...
    </div>
  );

  if (!product) return <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">Product not found.</div>;

  // ⚡ DYNAMIC PRICE CALCULATION LOGIC ⚡
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
  
  let allImages = [];
  if (product.images?.length > 0) allImages = [...product.images.map(img => img.url)];
  if (product.variants) {
    product.variants.forEach(variant => {
      if (variant.images) allImages = [...allImages, ...variant.images.map(img => img.url)];
    });
  }
  allImages = [...new Set(allImages)].slice(0, 5); 

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-16">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 bg-[#111] px-6 py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 sticky top-0 z-40 shadow-xl mb-8">
        <div className="flex-shrink-0">
          <Link to="/">
            <h1 className="text-2xl font-serif">LUXE<span className="text-[#C8A253]">.</span></h1>
          </Link>
        </div>
        <div className="w-full md:flex-1 md:max-w-xl order-last md:order-none mt-2 md:mt-0 px-0 md:px-8">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {user ? (
            <>
              <span className="text-zinc-400 text-sm hidden sm:block">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="text-xs font-semibold tracking-widest uppercase border border-[#C8A253] text-[#C8A253] px-4 py-2 rounded hover:bg-[#C8A253] hover:text-black transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium text-white hover:text-[#C8A253] transition-colors px-3 py-2">Log In</Link>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-[#C8A253] transition-colors mb-8 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-widest uppercase">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-6">
            <div className={`aspect-square bg-[#111] rounded-2xl border ${activeFlashDeal ? 'border-red-900/40 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-zinc-800'} p-8 flex items-center justify-center relative overflow-hidden group transition-all duration-500`}>
              <img src={activeImage} alt={product.name} className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-700"/>
              
              {/* Dynamic Badge: Deal vs Normal Discount */}
              {hasDiscount && (
                <div className={`absolute top-6 left-6 text-[#0A0A0A] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-lg flex items-center gap-1 ${activeFlashDeal ? 'bg-red-500 text-white' : 'bg-[#C8A253]'}`}>
                  {activeFlashDeal && <Zap size={12} className="fill-current" />}
                  {discountPercent}% OFF
                </div>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {allImages.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(img)} className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#111] rounded-xl border ${activeImage === img ? (activeFlashDeal ? 'border-red-500' : 'border-[#C8A253]') : 'border-zinc-800'} p-2 overflow-hidden hover:border-[#C8A253]/50 transition-colors`}>
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-[#C8A253] text-sm tracking-[0.2em] uppercase mb-3 font-semibold">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-[#C8A253]">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 text-zinc-700" />
                </div>
                <span className="text-zinc-500 text-sm">{product.reviews?.length || 0} Reviews</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-500 text-sm">{product.soldCount || 0} Sold</span>
              </div>

              {/* ⚡ FLASH DEAL TIMER UI ⚡ */}
              {activeFlashDeal && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={20} className="text-red-500 fill-red-500" />
                      <span className="font-bold text-red-400 uppercase tracking-widest text-sm">Lightning Deal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-red-500" />
                      <div className="flex gap-1 text-white font-mono font-bold">
                        <span className="bg-red-950 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
                        <span className="bg-red-950 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
                        <span className="bg-red-500 text-white px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-4">
                <span className={`text-4xl font-serif ${activeFlashDeal ? 'text-red-500 font-bold' : 'text-white'}`}>
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && <span className="text-xl text-zinc-500 line-through mb-1">₹{originalPrice.toLocaleString('en-IN')}</span>}
              </div>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-8 border-y border-zinc-800/50 py-6">
              {product.description || "Experience the pinnacle of craftsmanship and elegant design. This exclusive piece from LUXE redefines sophistication for the modern connoisseur."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center justify-between bg-[#111] border border-zinc-800 rounded-xl px-4 py-1 w-full sm:w-32 h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-500 hover:text-[#C8A253] p-2 text-xl">−</button>
                <span className="font-medium text-lg">{quantity}</span>
                <button onClick={() => setQuantity(Math.max(1, quantity + 1))} className="text-zinc-500 hover:text-[#C8A253] p-2 text-xl">+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock < 1}
                className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-xl font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                  activeFlashDeal 
                    ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-500/20' 
                    : 'bg-[#C8A253] text-[#0A0A0A] hover:bg-[#d4af6b] shadow-[#C8A253]/10'
                }`}
              >
                {isAddingToCart ? (
                   <span className="flex items-center gap-2">Securing...</span>
                ) : product.stock < 1 ? (
                   'Sold Out'
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />  {activeFlashDeal ? 'Claim Deal' : 'Buy Now'}
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111] border border-zinc-800">
                <Truck className="w-6 h-6 text-[#C8A253]" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Complimentary Shipping</h4>
                  <p className="text-xs text-zinc-500">On all premium orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#111] border border-zinc-800">
                <ShieldCheck className="w-6 h-6 text-[#C8A253]" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Authenticity Guaranteed</h4>
                  <p className="text-xs text-zinc-500">Certificate included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ⚡ SMART RELATED PRODUCTS SECTION ⚡ */}
        {similarProducts.length > 0 && (
          <div className="border-t border-zinc-800/50 pt-16">
            <h2 className="text-2xl font-serif text-white mb-8 flex items-center gap-3">
              {isDealActiveBackend ? (
                <><Zap className="w-6 h-6 text-red-500 fill-red-500" /> <span className="text-red-500">More Lightning Deals</span></>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-[#C8A253]"></span> You May Also Like</>
              )}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((simProduct) => {
                // Calculate price for related cards (They might be deals too!)
                const isSimDealActive = simProduct.flashDeal?.isActive && new Date(simProduct.flashDeal.startTime) <= new Date() && new Date(simProduct.flashDeal.endTime) > new Date();
                const simPrice = isSimDealActive ? simProduct.flashDeal.dealPrice : (simProduct.discountPrice > 0 ? simProduct.price - simProduct.discountPrice : simProduct.price);
                const simHasDiscount = isSimDealActive || simProduct.discountPrice > 0;

                return (
                  <Link to={createProductUrl(simProduct)} key={simProduct._id} className={`group bg-[#111] rounded-xl overflow-hidden border ${isSimDealActive ? 'border-red-900/30 hover:border-red-500/50' : 'border-zinc-800 hover:border-[#C8A253]/50'} transition-all duration-300 flex flex-col shadow-lg relative`}>
                    
                    {isSimDealActive && (
                       <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-widest shadow-md">
                         <Zap size={10} className="fill-current" /> Deal
                       </div>
                    )}

                    <div className="h-64 overflow-hidden bg-[#1A1A1A] relative flex items-center justify-center p-4">
                      <img src={getMainImage(simProduct)} alt={simProduct.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"/>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-[10px] text-zinc-500 mb-1 tracking-wider uppercase">{simProduct.category}</span>
                      <h3 className={`text-sm font-medium mb-1 transition-colors line-clamp-1 ${isSimDealActive ? 'group-hover:text-red-400' : 'group-hover:text-[#C8A253]'}`}>{simProduct.name}</h3>
                      <div className="mt-auto pt-2 flex items-baseline gap-2">
                        <span className={`text-sm font-semibold ${isSimDealActive ? 'text-red-500' : 'text-[#C8A253]'}`}>
                          ₹{simPrice?.toLocaleString('en-IN')}
                        </span>
                        {simHasDiscount && (
                          <span className="text-xs text-zinc-500 line-through">₹{simProduct.price?.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}