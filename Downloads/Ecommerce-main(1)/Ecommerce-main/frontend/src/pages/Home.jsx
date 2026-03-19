import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Clock, History, ArrowRight, Star, User, LogOut } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext'; 

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  
  const [homeData, setHomeData] = useState({ 
    recentlyViewed: [], recommended: [], featured: [], trending: [], newArrivals: [] 
  });
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  const fetchHomeData = async () => {
    try {
      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('guestId', guestId);
      }

      const { data } = await axiosInstance.get(`/home?t=${Date.now()}`, {
        headers: { 
          'x-guest-id': guestId,
          'Cache-Control': 'no-cache' 
        }
      });
      
      setHomeData(data.data);
    } catch (error) {
      console.error("Failed to load home data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [user]);

  const handleLogout = () => {
    logout(); 
    setHomeData({ ...homeData, recentlyViewed: [], recommended: [] }); 
  };

  // 👇 SEO URL GENERATOR FUNCTION 👇
  const createProductUrl = (product) => {
    if (!product) return '#';
    const catSlug = product.category ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category';
    const brandSlug = product.brand ? product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'brand';
    const nameSlug = product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
    return `/${catSlug}/${brandSlug}/${nameSlug}/p/${product._id}`;
  };

  // 👇 YEH FUNCTION MISSING THA (For Extracting Images properly) 👇
  const getMainImage = (product) => {
    if (!product) return 'https://placehold.co/400x400/111/C8A253?text=Boutique';
    if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0 && product.variants[0].images[0].url) {
      return product.variants[0].images[0].url;
    } else if (product.images && product.images.length > 0 && product.images[0].url) {
      return product.images[0].url;
    } else if (product.image) {
      return product.image; 
    }
    return 'https://placehold.co/400x400/111/C8A253?text=Boutique';
  };

  // --- PRODUCT CARD COMPONENT ---
  const ProductCard = ({ product, compact = false }) => {
    // Safety Fallback: Agar data wrapped aaya ho (e.g. record.product ki tarah)
    const p = product?.product ? product.product : product;

    if (!p || !p._id) return null; // Agar valid product nahi hai toh crash hone se bachao

    const hasDiscount = p.discountPrice && p.discountPrice > 0;
    const finalPrice = hasDiscount ? p.price - p.discountPrice : p.price;

    return (
      <Link to={createProductUrl(p)} className={`group block bg-[#111] rounded-xl border border-zinc-800 hover:border-[#C8A253]/50 transition-all overflow-hidden ${compact ? 'min-w-[160px] md:min-w-[200px]' : ''}`}>
        <div className={`relative bg-[#1A1A1A] ${compact ? 'aspect-square' : 'aspect-[4/5]'}`}>
          <img src={getMainImage(p)} alt={p.name || 'Product'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-[#C8A253] text-black text-[10px] font-bold px-2 py-1 rounded">
              {Math.round((p.discountPrice / p.price) * 100)}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-[#C8A253] transition-colors">{p.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{p.brand || p.category}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#C8A253] font-bold">₹{finalPrice?.toLocaleString('en-IN')}</span>
            {hasDiscount && <span className="text-xs text-gray-500 line-through">₹{p.price?.toLocaleString('en-IN')}</span>}
          </div>
        </div>
      </Link>
    );
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-12 h-12 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20 relative">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif text-[#C8A253] font-bold tracking-wider">LUXE.</Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400 hidden sm:block">Welcome, {user.name}</span>
                <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#C8A253] transition-colors">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log In</Link>
                <Link to="/register" className="text-sm font-medium bg-[#C8A253] text-black px-4 py-1.5 rounded-full hover:bg-white transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO BANNER --- */}
      <div className="relative h-[60vh] md:h-[70vh] bg-zinc-900 overflow-hidden flex items-center justify-center mt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent z-10"></div>
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-[#C8A253] mb-4 drop-shadow-lg">Discover True Luxury</h1>
          <p className="text-gray-300 md:text-lg mb-8">Curated collection of premium products, exclusively for you.</p>
          <Link to="/shop" className="bg-[#C8A253] text-black px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors shadow-lg shadow-[#C8A253]/20">
            Shop the Collection
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 space-y-16">
        
        {/* RECENTLY VIEWED */}
        {homeData.recentlyViewed?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-[#C8A253]" />
              <h2 className="text-xl font-serif">Continue Exploring</h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
              {homeData.recentlyViewed.map((product, idx) => (
                <div key={`recent-${idx}`} className="snap-start"><ProductCard product={product} compact={true} /></div>
              ))}
            </div>
          </section>
        )}
        
        {/* RECOMMENDED */}
        {homeData.recommended?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#C8A253]" />
              <h2 className="text-xl font-serif">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {homeData.recommended.map((product, idx) => <ProductCard key={`rec-${idx}`} product={product} />)}
            </div>
          </section>
        )}

        {/* FEATURED */}
        {homeData.featured?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#C8A253] fill-[#C8A253]" />
                <h2 className="text-xl font-serif">Featured Collection</h2>
              </div>
              <Link to="/shop" className="text-sm text-[#C8A253] hover:text-white flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {homeData.featured.map((product, idx) => <ProductCard key={`feat-${idx}`} product={product} />)}
            </div>
          </section>
        )}

        {/* TRENDING */}
        {homeData.trending?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#C8A253]" />
              <h2 className="text-xl font-serif">Trending Now</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {homeData.trending.map((product, idx) => <ProductCard key={`trend-${idx}`} product={product} />)}
            </div>
          </section>
        )}

        {/* NEW ARRIVALS */}
        {homeData.newArrivals?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-[#C8A253]" />
              <h2 className="text-xl font-serif">Fresh Arrivals</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {homeData.newArrivals.map((product, idx) => <ProductCard key={`new-${idx}`} product={product} />)}
            </div>
          </section>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}