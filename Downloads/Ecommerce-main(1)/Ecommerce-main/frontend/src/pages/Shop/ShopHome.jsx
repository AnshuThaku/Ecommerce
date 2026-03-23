// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// import axiosInstance from '../../utils/axiosInstance';
// import Toast from '../../components/Toast';
// import SearchBar from '../../components/SearchBar'; 
// import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react'; // History hata diya, Sparkles add kiya

// export default function ShopHome() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [recommended, setRecommended] = useState([]); // Sirf recommendations ke liye
//   const [loading, setLoading] = useState(true);
  
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [sortOrder, setSortOrder] = useState('newest'); 
  
//   const [toastMessage, setToastMessage] = useState(null);
//   const showToast = (type, message) => setToastMessage({ type, message });

//   // 1. Fetch All Products
//   const fetchPublicProducts = async () => {
//     try {
//       const { data } = await axiosInstance.get('/products');
//       setProducts(data.products || []);
//     } catch (error) {
//       showToast('error', 'Failed to load catalogue');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Fetch Only Recommendations
//   const fetchRecommendations = async () => {
//     try {
//       let guestId = localStorage.getItem('guestId');
//       if (!guestId && !user) return; // Agar dono nahi hain toh skip

//       const { data } = await axiosInstance.get(`/home?t=${Date.now()}`, {
//         headers: { 
//           'x-guest-id': guestId,
//           'Cache-Control': 'no-cache' 
//         }
//       });
      
//       if (data.success && data.data.recommended) {
//         setRecommended(data.data.recommended);
//       }
//     } catch (error) {
//       console.error("Failed to load recommendations", error);
//     }
//   };

//   useEffect(() => {
//     fetchPublicProducts();
//     fetchRecommendations();
//   }, [user]);

//   // SEO URL GENERATOR
//   const createProductUrl = (product) => {
//     const catSlug = product.category ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category';
//     const brandSlug = product.brand ? product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'brand';
//     const nameSlug = product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
//     return `/${catSlug}/${brandSlug}/${nameSlug}/p/${product._id}`;
//   };

//   const getMainImage = (product) => {
//     if (product.variants?.[0]?.images?.[0]?.url) return product.variants[0].images[0].url;
//     if (product.images?.[0]?.url) return product.images[0].url;
//     return 'https://placehold.co/400x400/111/C8A253?text=Boutique';
//   };

//   const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

//   const processedProducts = products
//     .filter(p => selectedCategory === 'All' ? true : p.category === selectedCategory)
//     .sort((a, b) => {
//       const priceA = a.discountPrice > 0 ? a.price - a.discountPrice : a.price;
//       const priceB = b.discountPrice > 0 ? b.price - b.discountPrice : b.price;
//       if (sortOrder === 'price-asc') return priceA - priceB;
//       if (sortOrder === 'price-desc') return priceB - priceA;
//       return 0; 
//     });

//   return (
//     <div className="min-h-screen bg-[#0A0A0A] text-white">
//       <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      
//       <nav className="border-b border-zinc-800 bg-[#111] px-6 py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4 sticky top-0 z-40 shadow-xl">
//         <div className="flex-shrink-0">
//           <Link to="/">
//             <h1 className="text-2xl font-serif">LUXE<span className="text-[#C8A253]">.</span></h1>
//           </Link>
//         </div>
//         <div className="w-full md:flex-1 md:max-w-xl order-last md:order-none mt-2 md:mt-0 px-0 md:px-8">
//           <SearchBar />
//         </div>
//         <div className="flex items-center gap-4 flex-shrink-0">
//           <Link to="/" className="text-sm font-medium text-white hover:text-[#C8A253] transition-colors px-3 py-2">
//             Back to Home
//           </Link>
//         </div>
//       </nav>

//       <main className="p-8 max-w-7xl mx-auto">
        
//         {/* --- RECOMMENDED SECTION (No History Here) --- */}
//         {recommended.length > 0 && (
//           <div className="mb-12 border-b border-zinc-800/50 pb-12">
//             <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
//               <Sparkles className="w-5 h-5 text-[#C8A253]" /> Recommended For You
//             </h2>
//             <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x">
//               {recommended.map((product, index) => (
//                 <Link 
//                   to={createProductUrl(product)} 
//                   key={`rec-${product._id}-${index}`} 
//                   className="group bg-[#111] rounded-xl overflow-hidden border border-zinc-800 hover:border-[#C8A253]/50 transition-all duration-300 flex-shrink-0 w-64 snap-start shadow-lg"
//                 >
//                   <div className="h-48 overflow-hidden bg-[#1A1A1A] relative p-4 flex items-center justify-center">
//                     <img 
//                       src={getMainImage(product)} 
//                       alt={product.name} 
//                       className="max-w-full max-h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
//                     />
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-sm font-medium group-hover:text-[#C8A253] transition-colors line-clamp-1 mb-1">{product.name}</h3>
//                     <span className="text-sm font-semibold text-[#C8A253]">
//                       ₹{product.discountPrice > 0 ? (product.price - product.discountPrice).toLocaleString('en-IN') : product.price?.toLocaleString('en-IN')}
//                     </span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* --- THE COLLECTION (ALL PRODUCTS) --- */}
//         <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
//             <h2 className="text-3xl font-serif text-[#C8A253]">The Collection</h2>
            
//             <div className="flex flex-wrap items-center gap-4">
//                 <div className="flex items-center gap-2 bg-[#111] border border-zinc-800 rounded-lg px-3 py-2">
//                     <Filter className="w-4 h-4 text-[#C8A253]" />
//                     <select 
//                         value={selectedCategory} 
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="bg-transparent text-sm text-gray-300 focus:outline-none cursor-pointer"
//                     >
//                         {categories.map(cat => (
//                             <option key={cat} value={cat} className="bg-[#111]">{cat}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="flex items-center gap-2 bg-[#111] border border-zinc-800 rounded-lg px-3 py-2">
//                     <SlidersHorizontal className="w-4 h-4 text-[#C8A253]" />
//                     <select 
//                         value={sortOrder} 
//                         onChange={(e) => setSortOrder(e.target.value)}
//                         className="bg-transparent text-sm text-gray-300 focus:outline-none cursor-pointer"
//                     >
//                         <option value="newest" className="bg-[#111]">Latest</option>
//                         <option value="price-asc" className="bg-[#111]">Price: Low to High</option>
//                         <option value="price-desc" className="bg-[#111]">Price: High to Low</option>
//                     </select>
//                 </div>
//             </div>
//         </div>
        
//         {loading ? (
//           <div className="text-center text-[#C8A253] py-20 font-serif flex flex-col items-center gap-4">
//              <div className="w-8 h-8 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin"></div>
//              Curating the collection...
//           </div>
//         ) : processedProducts.length === 0 ? (
//           <div className="text-center text-zinc-500 py-20 bg-[#111] rounded-2xl border border-zinc-800">
//              No items found matching your filters.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//             {processedProducts.map((product) => {
//               const numOfReviews = product.reviews?.length || 0;
//               const ratings = numOfReviews > 0 ? product.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / numOfReviews : 0;
              
//               return (
//               <Link to={createProductUrl(product)} key={product._id} className="group bg-[#111] rounded-xl overflow-hidden border border-zinc-800 hover:border-[#C8A253]/50 transition-all duration-300 flex flex-col shadow-lg hover:shadow-[#C8A253]/10">
//                 <div className="h-72 overflow-hidden bg-[#1A1A1A] relative flex items-center justify-center">
//                   <img src={getMainImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
//                 </div>
//                 <div className="p-5 flex-1 flex flex-col">
//                   <span className="text-xs text-zinc-500 mb-1 tracking-wider uppercase">{product.category}</span>
//                   <h3 className="text-lg font-semibold mb-1 group-hover:text-[#C8A253] transition-colors line-clamp-2 leading-tight">{product.name}</h3>
//                   <div className="flex items-center gap-1.5 mb-3">
//                     <div className="flex text-[#C8A253] text-sm drop-shadow-sm">
//                       {[...Array(5)].map((_, i) => (
//                          <span key={i} className={i < Math.round(ratings || 0) ? "opacity-100" : "text-zinc-700"}>★</span>
//                       ))}
//                     </div>
//                     <span className="text-xs text-zinc-500">({numOfReviews})</span>
//                   </div>
//                   <div className="mt-auto pt-4 border-t border-zinc-800/50">
//                     {product.discountPrice && product.discountPrice > 0 ? (
//                       <div className="flex items-baseline gap-2 flex-wrap">
//                         <span className="text-xl font-semibold text-white">₹{(product.price - product.discountPrice).toLocaleString('en-IN')}</span>
//                         <span className="text-sm text-zinc-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>
//                       </div>
//                     ) : (
//                       <span className="text-xl font-semibold text-white">₹{product.price?.toLocaleString('en-IN')}</span>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             )})}
//           </div>
//         )}
//       </main>

//       <style dangerouslySetInnerHTML={{__html: `
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}} />
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

export default function ShopHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchPublicProducts = async () => {
    try {
      const { data } = await axios.get('https://fakestoreapi.com/products');
      setProducts(data);
    } catch (error) {
      showToast('error', 'Failed to load catalogue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 bg-[#111] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-white">
            Truee <span className="text-[#C8A253]">Luxury</span>
          </h1>
        </div>

        {/* ACCOUNT DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 text-zinc-400 text-sm hover:text-[#C8A253] transition"
          >
            <FaUserCircle size={18} />
            {user ? (
              <span className="text-white font-medium">
                {user.name}
              </span>
            ) : (
              <span>Account</span>
            )}
            <IoChevronDown size={16} />
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl text-sm z-50">

              {user ? (
                <>
                  <div className="px-4 py-2 text-black font-semibold border-b border-gray-200">
                    My Orders
                  </div>

                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile Information
                  </Link>

                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Manage Addresses
                  </Link>

                  <div className="px-4 py-2 text-black font-semibold border-t border-gray-200">
                    Payments
                  </div>

                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Gift Cards
                  </Link>

                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Saved UPI
                  </Link>

                  <div className="px-4 py-2 text-black font-semibold border-t border-gray-200">
                    Personal Collection
                  </div>

                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Coupons
                  </Link>

                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Reviews & Ratings
                  </Link>

                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    All Notifications
                  </Link>

                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Wishlist
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t border-gray-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Create Account
                  </Link>
                </>
              )}

            </div>
          )}
        </div>
      </nav>

      {/* PRODUCTS */}
      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-[#C8A253] mb-8">
          Exclusive Collection
        </h2>

        {loading ? (
          <div className="text-center text-[#C8A253] py-20 font-serif">
            Curating the collection...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-zinc-500 py-20">
            Currently no items available in the shop.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

            {products.map((product) => {

              const numOfReviews = product.reviews?.length || 0;

              const ratings = numOfReviews > 0
                ? product.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / numOfReviews
                : 0;

              const generateSlug = (text) =>
                text
                  ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                  : 'item';

              const nameSlug = generateSlug(product.title);
              const productId = product.id;

              return (
                <Link
                  to={`/${nameSlug}/p/${productId}`}
                  key={productId}
                  className="group rounded-xl overflow-hidden border border-zinc-200 hover:border-[#C8A253]/50 transition-all duration-300 flex flex-col cursor-pointer bg-white shadow-sm"
                >

                  <div className="h-64 overflow-hidden bg-black relative p-4 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col bg-white">

                    <span className="text-xs text-zinc-500 mb-1">
                      {product.category}
                    </span>

                    <h3 className="text-lg font-semibold mb-1 text-zinc-900 group-hover:text-[#C8A253] transition-colors line-clamp-2">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-1.5 mb-3">

                      <div className="flex text-yellow-500 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < Math.round(ratings || 0) ? "opacity-100" : "text-zinc-200"}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <span className="text-xs text-blue-600 hover:underline">
                        {numOfReviews} ratings
                      </span>

                    </div>

                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xl font-medium text-zinc-950">
                        ₹{product.price}
                      </span>
                    </div>

                  </div>

                </Link>
              );
            })}

          </div>
        )}
      </main>
    </div>
  );
}