import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/Toast';
import SearchBar from '../../components/SearchBar'; // Added for Navbar
import { ShoppingBag, Star, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';

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
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, message) => setToastMessage({ type, message });

  // --- 1. FETCH PRODUCT & SIMILAR PRODUCTS ---
  useEffect(() => {
    const fetchProductAndSimilar = async () => {
      try {
        setLoading(true);
        // Fetch Current Product
        const { data } = await axiosInstance.get(`/products/${id}`);
        
        if (data.success) {
          const fetchedProduct = data.product;
          setProduct(fetchedProduct);
          
          const defaultImage = fetchedProduct.variants?.[0]?.images?.[0]?.url 
                            || fetchedProduct.images?.[0]?.url 
                            || 'https://placehold.co/600x600/111/C8A253?text=Luxury+Item';
          setActiveImage(defaultImage);

          // Fetch Similar Products (Same Category)
          const allProductsRes = await axiosInstance.get('/products');
          if (allProductsRes.data.success) {
            const related = allProductsRes.data.products
              .filter(p => p.category === fetchedProduct.category && p._id !== fetchedProduct._id)
              .slice(0, 4); // Sirf 4 dikhayenge
            setSimilarProducts(related);
          }
        }
      } catch (error) {
        showToast('error', 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndSimilar();
    // Jab URL me ID change ho (e.g., similar product pe click kare), page top par scroll ho
    window.scrollTo(0, 0); 
  }, [id]);

  // --- 2. THE HISTORY TRACKING MAGIC ---
  useEffect(() => {
    if (product && product._id) {
      const trackProductView = async () => {
        try {
          let currentGuestId = localStorage.getItem('guestId');
          if (!user && !currentGuestId) {
            currentGuestId = 'guest_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('guestId', currentGuestId);
          }

          // Background API Call (Header aur Body dono me ID bhej rahe hain for safety)
          await axiosInstance.post('/history/add', {
            type: 'view',
            productId: product._id,
            guestId: currentGuestId
          }, {
            headers: { 'x-guest-id': currentGuestId }
          });
          
        } catch (error) {
          console.error("Failed to track history in background", error);
        }
      };

      trackProductView();
    }
  }, [product, user]);

  // --- 3. ADD TO CART LOGIC ---
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await axiosInstance.post('/cart/add', { productId: product._id, quantity });
      showToast('success', 'Added to your luxury cart!');
    } catch (error) {
      if(error.response?.status === 401) {
        showToast('info', 'Please login to add items to cart.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showToast('error', 'Failed to add to cart.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- UI HELPERS ---
  const getMainImage = (p) => {
    if (p.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
    if (p.images?.[0]?.url) return p.images[0].url;
    return 'https://placehold.co/400x400/111/C8A253?text=Boutique';
  };

  // 👇 SEO URL GENERATOR FUNCTION 👇
  const createProductUrl = (prod) => {
    const catSlug = prod.category ? prod.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category';
    const brandSlug = prod.brand ? prod.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'brand';
    const nameSlug = prod.name ? prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
    return `/${catSlug}/${brandSlug}/${nameSlug}/p/${prod._id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-[#C8A253] font-serif">
         <div className="w-10 h-10 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin mb-4"></div>
         Unveiling Details...
      </div>
    );
  }

  if (!product) return <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">Product not found.</div>;

  const hasDiscount = product.discountPrice && product.discountPrice > 0;
  const currentPrice = hasDiscount ? product.price - product.discountPrice : product.price;
  const discountPercent = hasDiscount ? Math.round((product.discountPrice / product.price) * 100) : 0;
  
  let allImages = [];
  if (product.images?.length > 0) allImages = [...product.images.map(img => img.url)];
  if (product.variants) {
    product.variants.forEach(variant => {
      if (variant.images) allImages = [...allImages, ...variant.images.map(img => img.url)];
    });
  }
  allImages = [...new Set(allImages)].slice(0, 5); // Allow up to 5 images in gallery

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-16">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
      {/* --- NAVBAR (Consistent with Shop/Home) --- */}
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
        {/* Back Navigation */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-[#C8A253] transition-colors mb-8 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-widest uppercase">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* --- LEFT: IMAGE GALLERY --- */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square bg-[#111] rounded-2xl border border-zinc-800 p-8 flex items-center justify-center relative overflow-hidden group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-700"
              />
              {hasDiscount && (
                <div className="absolute top-6 left-6 bg-[#C8A253] text-[#0A0A0A] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#111] rounded-xl border ${activeImage === img ? 'border-[#C8A253]' : 'border-zinc-800'} p-2 overflow-hidden hover:border-[#C8A253]/50 transition-colors`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
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

              <div className="flex items-end gap-4">
                <span className="text-4xl font-serif text-white">₹{currentPrice.toLocaleString('en-IN')}</span>
                {hasDiscount && <span className="text-xl text-zinc-500 line-through mb-1">₹{product.price.toLocaleString('en-IN')}</span>}
              </div>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-8 border-y border-zinc-800/50 py-6">
              {product.description || "Experience the pinnacle of craftsmanship and elegant design. This exclusive piece from LUXE redefines sophistication for the modern connoisseur."}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center justify-between bg-[#111] border border-zinc-800 rounded-xl px-4 py-1 w-full sm:w-32 h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-500 hover:text-[#C8A253] p-2 text-xl">−</button>
                <span className="font-medium text-lg">{quantity}</span>
                <button onClick={() => setQuantity(Math.max(1, quantity + 1))} className="text-zinc-500 hover:text-[#C8A253] p-2 text-xl">+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock < 1}
                className="flex-1 flex items-center justify-center gap-3 bg-[#C8A253] text-[#0A0A0A] h-14 rounded-xl font-bold tracking-widest uppercase hover:bg-[#d4af6b] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C8A253]/10"
              >
                {isAddingToCart ? (
                   <span className="flex items-center gap-2">Processing...</span>
                ) : product.stock < 1 ? (
                   'Sold Out'
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart
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

        {/* --- NAYA SECTION: YOU MAY ALSO LIKE --- */}
        {similarProducts.length > 0 && (
          <div className="border-t border-zinc-800/50 pt-16">
            <h2 className="text-2xl font-serif text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#C8A253]"></span> You May Also Like
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((simProduct) => {
                return (
                  <Link 
                    to={createProductUrl(simProduct)} 
                    key={simProduct._id} 
                    className="group bg-[#111] rounded-xl overflow-hidden border border-zinc-800 hover:border-[#C8A253]/50 transition-all duration-300 flex flex-col shadow-lg"
                  >
                    <div className="h-64 overflow-hidden bg-[#1A1A1A] relative flex items-center justify-center p-4">
                      <img 
                        src={getMainImage(simProduct)} 
                        alt={simProduct.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-[10px] text-zinc-500 mb-1 tracking-wider uppercase">{simProduct.category}</span>
                      <h3 className="text-sm font-medium mb-1 group-hover:text-[#C8A253] transition-colors line-clamp-1">{simProduct.name}</h3>
                      <div className="mt-auto pt-2">
                        <span className="text-sm font-semibold text-[#C8A253]">
                          ₹{simProduct.discountPrice > 0 ? (simProduct.price - simProduct.discountPrice).toLocaleString('en-IN') : simProduct.price?.toLocaleString('en-IN')}
                        </span>
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