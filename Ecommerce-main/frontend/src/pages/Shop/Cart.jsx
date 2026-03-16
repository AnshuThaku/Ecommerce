// // import React, { useEffect, useState } from 'react';
// // import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
// // import axiosInstance from '../../utils/axiosInstance';
// // import { Link } from 'react-router-dom';
// // import Toast from '../../components/Toast';

// // export default function Cart() {
// //   const [cartItems, setCartItems] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [toastMessage, setToastMessage] = useState(null);

// //   const showToast = (type, message) => {
// //     setToastMessage({ type, message });
// //   };

// //   const fetchCart = async () => {
// //     try {
// //       const { data } = await axiosInstance.get('/cart');
// //       if (data && data.items) {
// //         // Fetch details for each product (since it's FakeStore for now)
// //         const detailedItems = await Promise.all(
// //           data.items.map(async (item) => {
// //             try {
// //               const res = await fetch(`https://fakestoreapi.com/products/${item.product}`);
// //               const productData = await res.json();
// //               return { ...item, productDetails: productData };
// //             } catch (err) {
// //               return { ...item, productDetails: { title: 'Unknown', price: 0, image: '' } };
// //             }
// //           })
// //         );
// //         setCartItems(detailedItems);
// //       } else {
// //         setCartItems([]);
// //       }
// //     } catch (error) {
// //       if (error.response?.status !== 404) {
// //         showToast('error', 'Failed to load cart');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCart();
// //   }, []);

// //   const updateQuantity = async (productId, currentQuantity, change) => {
// //     if (change === 1) { // Increase
// //       try {
// //         await axiosInstance.post('/cart/add', { productId, quantity: 1 });
// //         fetchCart(); // Refetch or ideally update local state
// //       } catch (error) {
// //         showToast('error', 'Failed to update quantity');
// //       }
// //     } else if (change === -1 && currentQuantity > 1) { // Decrease
// //       // Need a backend endpoint for decrease. Assuming a decrease endpoint or doing what we can. 
// //       // If we don't have a decrease endpoint, we might have to delete and re-add. Let's assume there is an update endpoint or we just simulate it for now.
// //       showToast('info', 'Quantity decrease is not fully supported in current mock backend api.');
// //     }
// //   };

// //   const removeItem = async (productId) => {
// //     // Assuming you will need an endpoint for `/cart/remove`
// //     showToast('info', 'Remove item from cart endpoint needs to be mapped to Backend');
// //   };

// //   const subtotal = cartItems.reduce(
// //     (acc, curr) => acc + (curr.productDetails?.price || 0) * curr.quantity,
// //     0
// //   );

// //   if (loading) return <div className="text-center py-20 animate-pulse text-[#C8A253]">Loading your cart...</div>;

// //   return (
// //     <div className="bg-black min-h-screen text-white pt-24 pb-12 px-6">
// //       <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
// //       <div className="max-w-6xl mx-auto">
// //         <h1 className="text-4xl font-serif text-[#C8A253] mb-8 flex items-center gap-3">
// //           <ShoppingBag className="w-8 h-8" /> Your Cart
// //         </h1>

// //         {cartItems.length === 0 ? (
// //           <div className="text-center py-16 bg-[#111] rounded-2xl border border-zinc-900">
// //             <ShoppingBag className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
// //             <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
// //             <p className="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
// //             <Link to="/shop" className="inline-block bg-[#C8A253] text-black px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors">
// //               Continue Shopping
// //             </Link>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
// //             <div className="lg:col-span-2 space-y-6">
// //               {cartItems.map((item) => (
// //                 <div key={item._id} className="flex gap-6 p-6 bg-[#111] rounded-2xl border border-zinc-900">
// //                   <div className="w-24 h-24 bg-white rounded-xl p-2 flex-shrink-0">
// //                     <img 
// //                       src={item.productDetails?.image} 
// //                       alt={item.productDetails?.title}
// //                       className="w-full h-full object-contain"
// //                     />
// //                   </div>
                  
// //                   <div className="flex-1 flex flex-col justify-between">
// //                     <div className="flex justify-between items-start gap-4">
// //                       <h3 className="font-serif text-lg">{item.productDetails?.title}</h3>
// //                       <button 
// //                         onClick={() => removeItem(item.product)} 
// //                         className="text-zinc-600 hover:text-red-500 transition-colors"
// //                       >
// //                         <Trash2 className="w-5 h-5" />
// //                       </button>
// //                     </div>
                    
// //                     <div className="flex justify-between items-end">
// //                       <div className="text-[#C8A253] text-xl font-medium">
// //                         ${(item.productDetails?.price * item.quantity).toFixed(2)}
// //                       </div>
                      
// //                       <div className="flex items-center gap-4 bg-black border border-zinc-800 rounded-full px-4 py-2">
// //                         <button 
// //                           onClick={() => updateQuantity(item.product, item.quantity, -1)}
// //                           className="text-gray-400 hover:text-white"
// //                         >
// //                           <Minus className="w-4 h-4" />
// //                         </button>
// //                         <span className="w-8 text-center">{item.quantity}</span>
// //                         <button 
// //                           onClick={() => updateQuantity(item.product, item.quantity, 1)}
// //                           className="text-gray-400 hover:text-white"
// //                         >
// //                           <Plus className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             <div className="lg:col-span-1">
// //               <div className="bg-[#111] p-8 rounded-2xl border border-zinc-900 sticky top-24">
// //                 <h3 className="text-xl font-serif text-[#C8A253] mb-6">Order Summary</h3>
                
// //                 <div className="space-y-4 text-gray-400 mb-8">
// //                   <div className="flex justify-between">
// //                     <span>Subtotal ({cartItems.length} items)</span>
// //                     <span className="text-white">${subtotal.toFixed(2)}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>Shipping</span>
// //                     <span className="text-white">Calculated at checkout</span>
// //                   </div>
// //                 </div>
                
// //                 <div className="border-t border-zinc-800 pt-6 mb-8 flex justify-between items-center">
// //                   <span className="text-lg">Total</span>
// //                   <span className="text-2xl font-serif text-[#C8A253]">${subtotal.toFixed(2)}</span>
// //                 </div>
                
// //                 <button className="w-full py-4 bg-[#C8A253] text-black rounded-full font-semibold hover:bg-white transition-colors">
// //                   Proceed to Checkout
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from 'react';
// import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
// import axiosInstance from '../../utils/axiosInstance';
// import { Link } from 'react-router-dom';
// import Toast from '../../components/Toast';

// export default function Cart() {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toastMessage, setToastMessage] = useState(null);

//   const showToast = (type, message) => {
//     setToastMessage({ type, message });
//   };

//   const fetchCart = async () => {
//     try {
//       const { data } = await axiosInstance.get('/cart');
//       if (data && data.items) {

//         const detailedItems = await Promise.all(
//           data.items.map(async (item) => {
//             try {
//               const res = await fetch(`https://fakestoreapi.com/products/${item.product}`);
//               const productData = await res.json();
//               return { ...item, productDetails: productData };
//             } catch (err) {
//               return { ...item, productDetails: { title: 'Unknown', price: 0, image: '' } };
//             }
//           })
//         );

//         setCartItems(detailedItems);

//       } else {
//         setCartItems([]);
//       }

//     } catch (error) {

//       if (error.response?.status !== 404) {
//         showToast('error', 'Failed to load cart');
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const updateQuantity = async (productId, currentQuantity, change) => {

//     if (change === 1) {

//       try {
//         await axiosInstance.post('/cart/add', { productId, quantity: 1 });
//         fetchCart();
//       } catch (error) {
//         showToast('error', 'Failed to update quantity');
//       }

//     } else if (change === -1 && currentQuantity > 1) {

//       showToast('info', 'Quantity decrease is not fully supported in current mock backend api.');

//     }
//   };

//   const removeItem = async (productId) => {
//     showToast('info', 'Remove item from cart endpoint needs to be mapped to Backend');
//   };

//   const subtotal = cartItems.reduce(
//     (acc, curr) => acc + (curr.productDetails?.price || 0) * curr.quantity,
//     0
//   );

//   if (loading)
//     return (
//       <div className="text-center py-20 animate-pulse text-gray-600">
//         Loading your cart...
//       </div>
//     );

//   return (

//     <div className="bg-gray-50 min-h-screen text-black pt-24 pb-12 px-6">

//       <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

//       <div className="max-w-6xl mx-auto">

//         <h1 className="text-4xl font-serif text-black mb-8 flex items-center gap-3">
//           <ShoppingBag className="w-8 h-8" /> Your Cart
//         </h1>

//         {cartItems.length === 0 ? (

//           <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">

//             <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />

//             <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>

//             <p className="text-gray-600 mb-6">
//               Looks like you haven't added anything yet.
//             </p>

//             <Link
//               to="/shop"
//               className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
//             >
//               Continue Shopping
//             </Link>

//           </div>

//         ) : (

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

//             <div className="lg:col-span-2 space-y-6">

//               {cartItems.map((item) => (

//                 <div
//                   key={item._id}
//                   className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-200"
//                 >

//                   <div className="w-24 h-24 bg-white rounded-xl p-2 flex-shrink-0 border border-gray-200">

//                     <img
//                       src={item.productDetails?.image}
//                       alt={item.productDetails?.title}
//                       className="w-full h-full object-contain"
//                     />

//                   </div>

//                   <div className="flex-1 flex flex-col justify-between">

//                     <div className="flex justify-between items-start gap-4">

//                       <h3 className="font-serif text-lg">
//                         {item.productDetails?.title}
//                       </h3>

//                       <button
//                         onClick={() => removeItem(item.product)}
//                         className="text-gray-400 hover:text-red-500 transition-colors"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>

//                     </div>

//                     <div className="flex justify-between items-end">

//                       <div className="text-black text-xl font-medium">
//                         ${(item.productDetails?.price * item.quantity).toFixed(2)}
//                       </div>

//                       <div className="flex items-center gap-4 bg-gray-100 border border-gray-200 rounded-full px-4 py-2">

//                         <button
//                           onClick={() =>
//                             updateQuantity(item.product, item.quantity, -1)
//                           }
//                           className="text-gray-600 hover:text-black"
//                         >
//                           <Minus className="w-4 h-4" />
//                         </button>

//                         <span className="w-8 text-center">
//                           {item.quantity}
//                         </span>

//                         <button
//                           onClick={() =>
//                             updateQuantity(item.product, item.quantity, 1)
//                           }
//                           className="text-gray-600 hover:text-black"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>

//                       </div>

//                     </div>

//                   </div>

//                 </div>

//               ))}

//             </div>

//             <div className="lg:col-span-1">

//               <div className="bg-white p-8 rounded-2xl border border-gray-200 sticky top-24">

//                 <h3 className="text-xl font-serif text-black mb-6">
//                   Order Summary
//                 </h3>

//                 <div className="space-y-4 text-gray-600 mb-8">

//                   <div className="flex justify-between">
//                     <span>Subtotal ({cartItems.length} items)</span>
//                     <span className="text-black">${subtotal.toFixed(2)}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span className="text-black">Calculated at checkout</span>
//                   </div>

//                 </div>

//                 <div className="border-t border-gray-200 pt-6 mb-8 flex justify-between items-center">

//                   <span className="text-lg">Total</span>

//                   <span className="text-2xl font-serif text-black">
//                     ${subtotal.toFixed(2)}
//                   </span>

//                 </div>

//                 <button className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
//                   Proceed to Checkout
//                 </button>

//               </div>

//             </div>

//           </div>

//         )}

//       </div>

//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { 
  Heart, Eye, ShoppingCart, ArrowRight, X, ShieldCheck, Star, Award 
} from 'lucide-react';

/**
 * MOCK DATA - Aapki original images ke saath
 */
const trendingProducts = [
  {
    id: 1,
    brand: "Marshall",
    name: "Stanmore III Bluetooth",
    price: 41999,
    originalPrice: 49999,
    discount: "16% off",
    rating: 4.8,
    ratingCount: "2,450",
    description: "Experience the legend with Stanmore III. Re-engineered for a wider soundstage, delivering home-filling Marshall signature sound with a more immersive experience.",
    image: "images.jpg",
    hoverImage: "images.jpg",
    tag: "Bestseller",
    colors: [
      { code: "#1a1a1a", img: "images.jpg" }, 
      { code: "#e5d1b1", img: "downl.jpg" }, 
      { code: "#4a3728", img: "download.jpg" }  
    ]
  },
  {
    id: 2,
    brand: "Devialet",
    name: "Phantom I 108 dB",
    price: 288000, 
    originalPrice: 320000,
    discount: "10% off",
    rating: 4.9,
    ratingCount: "842",
    description: "The ultimate connected speaker. Hear every detail brought to life with unthinkable clarity by a Grade I Titanium tweeter. Ultra-deep bass in its purest form.",
    image: "img1.jpg",
    hoverImage: "img1.jpg",
    tag: "Iconic",
    colors: [
      { code: "#ffffff", img: "img3.jpg" }, 
      { code: "#222222", img: "img2.jpg" }, 
      { code: "#d4af37", img: "img1.jpg" }  
    ]
  },
  {
    id: 3,
    brand: "Dyson",
    name: "Airwrap™ Multi-styler",
    price: 45908,
    originalPrice: 49900,
    discount: "8% off",
    rating: 4.7,
    ratingCount: "5,120",
    description: "Dry. Curl. Shape. Smooth and hide flyaways. With no extreme heat. Re-engineered attachments harness Enhanced Coanda airflow to create your styles.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600",
    tag: "New",
    colors: [
      { code: "#b31b3e", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600" }, 
      { code: "#1e3a5f", img: "https://images.unsplash.com/photo-1595475241949-0d021200d5c7?auto=format&fit=crop&q=80&w=600" }, 
      { code: "#555555", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600" }  
    ]
  },
  {
    id: 4,
    brand: "Withings",
    name: "ScanWatch Horizon",
    price: 50399,
    originalPrice: 59999,
    discount: "16% off",
    rating: 4.6,
    ratingCount: "324",
    description: "The world's most advanced health-tracking hybrid smartwatch. Features a rotating bezel, stainless steel case, and sapphire glass.",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    tag: "",
    colors: [
      { code: "#122836", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600" }, 
      { code: "#2d5a27", img: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600" }, 
      { code: "#e0e0e0", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600" }  
    ]
  }
];

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row gap-6 animate-in fade-in zoom-in duration-300">

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="md:w-1/2 bg-[#f9f9f9] p-8 md:p-12 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto max-h-[420px] min-w-[260px] max-w-[420px] object-contain mix-blend-multiply transition-all duration-500 hover:scale-105"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600" }}
          />
        </div>

<div className="md:w-1/2 p-8 md:p-14 md:pl-20 flex flex-col justify-center">
  {/* Brand */}
  <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-[#d3b574] mb-3">
    {product.brand}
  </p>

  {/* Product Name */}
  <h2 className="text-4xl font-serif italic text-black mb-4 leading-snug">
    {product.name}
  </h2>

  {/* Rating */}
  <div className="flex items-center gap-3 mb-6">
    <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-[12px] font-bold">
      {product.rating}
      <Star className="w-3 h-3 ml-1 fill-white" />
    </div>

    <span className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">
      ({product.ratingCount} Ratings)
    </span>
  </div>

  {/* Price Section */}
  <div className="flex items-center gap-3 mb-6 flex-wrap">

    <span className="text-2xl font-extrabold text-black">
      {formatPrice(product.price)}
    </span>

    <span className="text-lg text-gray-400 line-through">
      {formatPrice(product.originalPrice)}
    </span>

    <span className="text-lg font-bold text-green-600">
      {product.discount}
    </span>

  </div>

  {/* Description */}
  <p className="text-[12px] text-gray-500 leading-relaxed mb-8 font-medium">
    {product.description}
  </p>

  {/* Button + Features */}
  <div className="space-y-6">

    <button className="group relative w-full max-w-[200px] h-10 rounded-full bg-black px-6 text-[10px] align-baseline  font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#d3b574] hover:text-black shadow-lg active:scale-95">
      <span className="relative z-10 flex items-center justify-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        <span>Add To Bag</span>
      </span>
    </button>

  </div>

</div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-24 pb-20 px-6 md:px-12 bg-white">
        <div className="max-w-[1440px] mx-auto">
          {selectedProduct && (
            <QuickViewModal 
              product={selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
            />
          )}
        </div>
      </section>
    </div>
  );
}

