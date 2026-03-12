import React, { useEffect, useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import Toast from '../../components/Toast';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
  };

  const fetchCart = async () => {
    try {
      const { data } = await axiosInstance.get('/cart');
      if (data && data.items) {
        // Fetch details for each product (since it's FakeStore for now)
        const detailedItems = await Promise.all(
          data.items.map(async (item) => {
            try {
              const res = await fetch(`https://fakestoreapi.com/products/${item.product}`);
              const productData = await res.json();
              return { ...item, productDetails: productData };
            } catch (err) {
              return { ...item, productDetails: { title: 'Unknown', price: 0, image: '' } };
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
    if (change === 1) { // Increase
      try {
        await axiosInstance.post('/cart/add', { productId, quantity: 1 });
        fetchCart(); // Refetch or ideally update local state
      } catch (error) {
        showToast('error', 'Failed to update quantity');
      }
    } else if (change === -1 && currentQuantity > 1) { // Decrease
      // Need a backend endpoint for decrease. Assuming a decrease endpoint or doing what we can. 
      // If we don't have a decrease endpoint, we might have to delete and re-add. Let's assume there is an update endpoint or we just simulate it for now.
      showToast('info', 'Quantity decrease is not fully supported in current mock backend api.');
    }
  };

  const removeItem = async (productId) => {
    // Assuming you will need an endpoint for `/cart/remove`
    showToast('info', 'Remove item from cart endpoint needs to be mapped to Backend');
  };

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + (curr.productDetails?.price || 0) * curr.quantity,
    0
  );

  if (loading) return <div className="text-center py-20 animate-pulse text-[#C8A253]">Loading your cart...</div>;

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-12 px-6">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-[#C8A253] mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8" /> Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-[#111] rounded-2xl border border-zinc-900">
            <ShoppingBag className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
            <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
            <Link to="/shop" className="inline-block bg-[#C8A253] text-black px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-6 p-6 bg-[#111] rounded-2xl border border-zinc-900">
                  <div className="w-24 h-24 bg-white rounded-xl p-2 flex-shrink-0">
                    <img 
                      src={item.productDetails?.image} 
                      alt={item.productDetails?.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-serif text-lg">{item.productDetails?.title}</h3>
                      <button 
                        onClick={() => removeItem(item.product)} 
                        className="text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="text-[#C8A253] text-xl font-medium">
                        ${(item.productDetails?.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <div className="flex items-center gap-4 bg-black border border-zinc-800 rounded-full px-4 py-2">
                        <button 
                          onClick={() => updateQuantity(item.product, item.quantity, -1)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product, item.quantity, 1)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#111] p-8 rounded-2xl border border-zinc-900 sticky top-24">
                <h3 className="text-xl font-serif text-[#C8A253] mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-gray-400 mb-8">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-white">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-zinc-800 pt-6 mb-8 flex justify-between items-center">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl font-serif text-[#C8A253]">${subtotal.toFixed(2)}</span>
                </div>
                
                <button className="w-full py-4 bg-[#C8A253] text-black rounded-full font-semibold hover:bg-white transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
