

// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// import Toast from '../../components/Toast';
// import axios from 'axios';
// import { FaUserCircle } from "react-icons/fa";
// import { IoChevronDown } from "react-icons/io5";

// export default function ShopHome() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(false);

//   const dropdownRef = useRef(null);

//   const showToast = (type, message) => {
//     setToastMessage({ type, message });
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const fetchPublicProducts = async () => {
//     try {
//       const { data } = await axios.get('https://fakestoreapi.com/products');
//       setProducts(data);
//     } catch (error) {
//       showToast('error', 'Failed to load catalogue');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPublicProducts();
//   }, []);

//   /* CLOSE DROPDOWN WHEN CLICK OUTSIDE */
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     // Body background color changed to white. Initial color was bg-[#0A0A0A].
//     // Text color updated to inherit for more flexibility.
//     <div className="min-h-screen bg-white text-zinc-900">
//       <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

//       {/* NAVBAR */}
//       {/* Keeping navbar styles mostly same as requested, assuming it should remain dark */}
//       <nav className="border-b border-zinc-800 bg-[#111] px-6 py-4 flex justify-between items-center ">
//         <div>
//           <h1 className="text-2xl font-serif text-white">
//             Truee <span className="text-[#C8A253]">Luxury</span>
//           </h1>
//         </div>

//         {/* ACCOUNT DROPDOWN */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setOpenDropdown(!openDropdown)}
//             className="flex items-center gap-2 text-zinc-400 text-sm hover:text-[#C8A253] transition"
//           >
//             <FaUserCircle size={18} />
//             {user ? (
//               <span className="text-white font-medium">
//                 {user.name}
//               </span>
//             ) : (
//               <span>Account</span>
//             )}
//             <IoChevronDown size={16} />
//           </button>

//           {openDropdown && (
//             <div className="absolute right-0 mt-3 w-64 bg-[#111] border border-zinc-800 rounded-lg shadow-xl text-sm z-50">
//               {user ? (
//                 <>
//                   <div className="px-4 py-2 text-[#C8A253] font-semibold border-b border-zinc-800">
//                     My Orders
//                   </div>
//                   <Link to="/account" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800">
//                     Profile Information
//                   </Link>
//                   <Link to="/account" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800">
//                     Manage Addresses
//                   </Link>
//                   <div className="px-4 py-2 text-[#C8A253] font-semibold border-t border-zinc-800">
//                     Payments
//                   </div>
//                   <Link to="/account" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800">
//                     Gift Cards
//                   </Link>
//                   <Link to="/account" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800">
//                     Saved UPI
//                   </Link>
//                   <div className="px-4 py-2 text-[#C8A253] font-semibold border-t border-zinc-800">
//                     Personal Collection
//                   </div>
//                   <Link to="/account" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800">
//                     My Coupons
//                   </Link>
//                   <Link to="/account" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800">
//                     Reviews & Ratings
//                   </Link>
//                   <Link to="/account" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800">
//                     All Notifications
//                   </Link>
//                   <Link to="/account" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800">
//                     Wishlist
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 border-t border-zinc-800"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800"
//                   >
//                     Create Account
//                   </Link>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* PRODUCTS */}
//       <main className="p-8 max-w-7xl mx-auto">
//         <h2 className="text-3xl font-serif text-[#C8A253] mb-8">
//           Exclusive Collection
//         </h2>

//         {loading ? (
//           <div className="text-center text-[#C8A253] py-20 font-serif">
//             Curating the collection...
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center text-zinc-500 py-20">
//             Currently no items available in the shop.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//             {products.map((product) => {
//               const numOfReviews = product.reviews?.length || 0;
//               const ratings = numOfReviews > 0
//                 ? product.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / numOfReviews
//                 : 0;

//               const generateSlug = (text) =>
//                 text
//                   ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
//                   : 'item';

//               const nameSlug = generateSlug(product.title);
//               const productId = product.id;

//               return (
//                 <Link
//                   to={`/${nameSlug}/p/${productId}`}
//                   key={productId}
//                   className="group rounded-xl overflow-hidden border border-zinc-200 hover:border-[#C8A253]/50 transition-all duration-300 flex flex-col cursor-pointer bg-white shadow-sm"
//                 >
//                   {/* Product image section: background changed to black as requested. */}
//                   <div className="h-64 overflow-hidden bg-black relative p-4 flex items-center justify-center">
//                     <img
//                       src={product.image}
//                       alt={product.title}
//                       className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
//                     />
//                   </div>

//                   {/* Product details section: background remains white, text color is dark zinc. Initial bg was bg-[#111]. */}
//                   <div className="p-5 flex-1 flex flex-col bg-white">
//                     <span className="text-xs text-zinc-500 mb-1">
//                       {product.category}
//                     </span>

//                     {/* Title text is now zinc-900 (almost black). Initial was white. */}
//                     <h3 className="text-lg font-semibold mb-1 text-zinc-900 group-hover:text-[#C8A253] transition-colors line-clamp-2">
//                       {product.title}
//                     </h3>

//                     <div className="flex items-center gap-1.5 mb-3">
//                       <div className="flex text-yellow-500 text-sm">
//                         {[...Array(5)].map((_, i) => (
//                           <span
//                             key={i}
//                             className={i < Math.round(ratings || 0) ? "opacity-100" : "text-zinc-200"}
//                           >
//                             ★
//                           </span>
//                         ))}
//                       </div>
//                       <span className="text-xs text-blue-600 hover:underline">
//                         {numOfReviews} ratings
//                       </span>
//                     </div>

//                     <div className="mt-auto flex justify-between items-center">
//                       {/* Price text color changed to zinc-950 (darker). Initial was white. */}
//                       <span className="text-xl font-medium text-zinc-950">
//                         ₹{product.price}
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}
//       </main>
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