import React, { useEffect, useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate add kiya
import Toast from '../../components/Toast';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false); // Checkout loading spinner ke liye
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate(); // Redirect karne ke liye

  const showToast = (type, message) => {
    setToastMessage({ type, message });
  };

  const fetchCart = async () => {
    try {
      const { data } = await axiosInstance.get('/cart');
      if (data && data.items) {
        const detailedItems = await Promise.all(
          data.items.map(async (item) => {
            try {
              const res = await axiosInstance.get(`/products/${item.product}`);
              return { ...item, productDetails: res.data.product };
            } catch (err) {
              return { ...item, productDetails: { name: 'Unknown', price: 0, images: [] } };
            }
          })
        );
        setCartItems(detailedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        showToast('error', 'Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, currentQuantity, change) => {
    if (change === 1) { 
      try {
        await axiosInstance.post('/cart/add', { productId, quantity: 1 });
        fetchCart(); 
      } catch (error) {
        showToast('error', 'Failed to update quantity');
      }
    } else if (change === -1 && currentQuantity > 1) { 
      showToast('info', 'Quantity decrease endpoint needed in backend.');
    }
  };

  const removeItem = async (productId) => {
    showToast('info', 'Remove item endpoint needs to be mapped in backend');
  };

  const getItemPrice = (item) => {
    const product = item.productDetails;
    if (product?.discountPrice && product.discountPrice > 0) {
      return product.price - product.discountPrice;
    }
    return product?.price || 0;
  };

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + getItemPrice(curr) * curr.quantity,
    0
  );

  const totalSavings = cartItems.reduce((acc, curr) => {
    const product = curr.productDetails;
    if (product?.discountPrice && product.discountPrice > 0) {
      return acc + product.discountPrice * curr.quantity;
    }
    return acc;
  }, 0);

  // --- INSTANT CHECKOUT LOGIC ---
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Backend ko order create karne ke liye exact waisa data bhejenge jaisa Order Model ko chahiye
      const checkoutItems = cartItems.map(item => ({
        product: item.product, 
        productId: item.product, 
        name: item.productDetails?.name || 'Luxury Item',
        image: item.productDetails?.variants?.[0]?.images?.[0]?.url || item.productDetails?.images?.[0]?.url || '',
        price: getItemPrice(item),
        quantity: item.quantity
      }));

      const payload = {
        cartItems: checkoutItems,
        totalAmount: subtotal
      };

      // API Call to create dummy order
      const response = await axiosInstance.post('/orders/instant-checkout', payload);
      
      if (response.data.success) {
        // Agar success hua toh sidha Order Success page par bhejo ID ke sath
        navigate('/order-success', { state: { orderId: response.data.orderId } });
      }
    } catch (error) {
      showToast('error', error.response?.data?.error || 'Checkout Failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-xl animate-pulse text-[#C8A253] font-serif">Curating your cart...</div>;

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white pt-24 pb-12 px-6">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-[#C8A253] mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8" /> Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-[#111] rounded-2xl border border-zinc-800 shadow-2xl">
            <ShoppingBag className="w-16 h-16 mx-auto text-[#C8A253] mb-4 opacity-50" />
            <h2 className="text-2xl font-serif mb-2 text-white">Your cart is empty</h2>
            <p className="text-zinc-500 mb-8">Looks like you haven't added any luxury items yet.</p>
            <Link to="/shop" className="inline-block bg-[#C8A253] text-[#0A0A0A] px-8 py-3 rounded-full font-bold tracking-widest uppercase hover:bg-[#d4af6b] transition-all">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => {
                const product = item.productDetails;
                const hasDiscount = product?.discountPrice && product.discountPrice > 0;
                const itemImage = product?.variants?.[0]?.images?.[0]?.url || product?.images?.[0]?.url || 'https://placehold.co/200x200/111/C8A253?text=Boutique';
                const itemTotal = getItemPrice(item) * item.quantity;
                const discountPercent = hasDiscount ? Math.round((product.discountPrice / product.price) * 100) : 0;
                
                return (
                <div key={item._id} className="flex gap-6 p-6 bg-[#111] rounded-2xl border border-zinc-800 hover:border-[#C8A253]/30 transition-colors">
                  <div className="w-28 h-28 bg-white rounded-xl p-2 flex-shrink-0">
                    <img 
                      src={itemImage} 
                      alt={product?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif text-lg text-white line-clamp-1">{product?.name}</h3>
                        <p className="text-xs text-zinc-500 tracking-wider uppercase mt-1">{product?.category}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product)} 
                        className="text-zinc-600 hover:text-red-500 transition-colors bg-zinc-900 p-2 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        {hasDiscount ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xl font-semibold text-[#C8A253]">₹{itemTotal}</span>
                            <span className="text-sm text-zinc-500 line-through">₹{product.price * item.quantity}</span>
                            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{discountPercent}% OFF</span>
                          </div>
                        ) : (
                          <span className="text-xl font-semibold text-[#C8A253]">₹{itemTotal}</span>
                        )}
                        <p className="text-xs text-zinc-500 mt-1">₹{getItemPrice(item)} each</p>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1.5">
                        <button 
                          onClick={() => updateQuantity(item.product, item.quantity, -1)}
                          className="text-zinc-400 hover:text-[#C8A253] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product, item.quantity, 1)}
                          className="text-zinc-400 hover:text-[#C8A253] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 sticky top-24 shadow-2xl">
                <h3 className="text-xl font-serif text-[#C8A253] mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-zinc-400 mb-8">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-white">₹{subtotal}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount Saved</span>
                      <span>-₹{totalSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-white">Free Premium</span>
                  </div>
                </div>
                
                <div className="border-t border-zinc-800 pt-6 mb-8 flex justify-between items-center">
                  <span className="text-lg text-white">Grand Total</span>
                  <span className="text-3xl font-serif text-[#C8A253]">₹{subtotal}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  className="w-full py-4 flex items-center justify-center gap-2 bg-[#C8A253] text-[#0A0A0A] rounded-xl font-bold tracking-widest uppercase hover:bg-[#d4af6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-[#0A0A0A]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Secure Checkout'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}