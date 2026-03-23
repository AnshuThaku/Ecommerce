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
  <div className="bg-white min-h-screen text-black pt-24 pb-12 px-6">
    <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-serif text-black mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8" /> Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-100 rounded-2xl border border-gray-300 shadow">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-serif mb-2 text-black">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/shop" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-gray-800 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const product = item.productDetails;
              const itemImage =
                product?.images?.[0]?.url || "https://placehold.co/200";

              const itemTotal = getItemPrice(item) * item.quantity;

              return (
                <div key={item._id} className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-300 shadow">
                  
                  <div className="w-28 h-28 bg-gray-100 rounded-xl p-2">
                    <img src={itemImage} alt="" className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg text-black">{product?.name}</h3>
                        <p className="text-xs text-gray-500">{product?.category}</p>
                      </div>

                      <button onClick={() => removeItem(item.product)}>
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-lg font-semibold text-black">₹{itemTotal}</span>

                      <div className="flex items-center gap-4 border rounded-full px-3 py-1">
                        <button onClick={() => updateQuantity(item.product, item.quantity, -1)}>
                          <Minus className="w-4 h-4" />
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() => updateQuantity(item.product, item.quantity, 1)}>
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="bg-gray-100 p-8 rounded-2xl border border-gray-300 sticky top-24 shadow">
              <h3 className="text-xl mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6 flex justify-between">
                <span>Total</span>
                <span className="text-xl font-bold">₹{subtotal}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800"
              >
                Checkout
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  </div>
);
}

