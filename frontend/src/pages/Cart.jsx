import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

export default function Cart({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const showToast = (type, message) => setToastMessage({ type, message });

  const fetchCart = async () => {
    try {
      const { data } = await axiosInstance.get("/cart");
      if (data && data.items) {
        const detailedItems = await Promise.all(
          data.items.map(async (item) => {
            try {
              const res = await axiosInstance.get(`/products/${item.product}`);
              return { ...item, productDetails: res.data.product };
            } catch (err) {
              return { ...item, productDetails: { name: "Unknown", price: 0, images: [] } };
            }
          })
        );
        setCartItems(detailedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      if (error.response?.status !== 404) showToast("error", "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchCart();
    }
  }, [isOpen]);

  // âš¡ NAYA LOGIC: React to 'cartUpdated' event to refresh the cart seamlessly when already open
  useEffect(() => {
    const handleCartUpdate = () => {
      // If modal is open when an item is added, fetch silently without full loading spinner
      if (isOpen) {
        fetchCart();
      }
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isOpen]);

const updateQuantity = async (productId, currentQuantity, change) => {
    try {
      if (change === 1) {
        // Increase quantity
        await axiosInstance.put("/cart/update", { productId, quantity: currentQuantity + 1 });
      } else if (change === -1 && currentQuantity > 1) {
        // Decrease quantity but not below 1
        await axiosInstance.put("/cart/update", { productId, quantity: currentQuantity - 1 });
      }
      fetchCart();
    } catch (error) {
      showToast("error", "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      // Assuming passing quantity 0 deletes it, as seen in updateProductController
      await axiosInstance.put("/cart/update", { productId, quantity: 0 });
      fetchCart();
    } catch (error) {
      showToast("error", "Failed to remove item");
    }
  };

  const getItemPrice = (item) => {
    const product = item.productDetails;
    if (product?.discountPrice && product.discountPrice > 0) return product.price - product.discountPrice;
    return product?.price || 0;
  };

  const subtotal = cartItems.reduce((acc, curr) => acc + getItemPrice(curr) * curr.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999999]" style={{ pointerEvents: 'none' }}>
      <div
        className="fixed inset-0 bg-black/40 transition-opacity" style={{ pointerEvents: 'auto' }}
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[90%] sm:w-[450px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 font-sans" style={{ pointerEvents: 'auto' }}>
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-3xl font-serif font-[600] text-black tracking-tight">Shopping Cart</h2>
          <button onClick={onClose} className="text-black hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
             <div className="h-full flex items-center justify-center animate-pulse text-[#C8A253] font-serif">Curating your cart...</div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-300" strokeWidth={1} />
              <p className="font-serif text-lg text-gray-500">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 uppercase text-xs font-bold tracking-widest border-b border-black pb-1 hover:text-gray-600">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, index) => {
                const product = item.productDetails;
                const itemImage = product?.images?.[0]?.url || "https://placehold.co/200";
                const itemColor = product?.variants?.[0]?.attributes?.find(attr => attr.name.toLowerCase() === "color")?.value || "Standard";
                const itemTotal = getItemPrice(item);

                return (
                  <div key={`${item.product}-${index}`} className="flex gap-6 items-center relative py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2">
                      <button onClick={() => removeItem(item.product)} className="absolute top-4 right-4 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full shadow border border-red-200">
                         <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                    </button>

                    <div className="w-[100px] h-[100px] bg-[#fdfdfd] flex-shrink-0 flex items-center justify-center p-2 rounded-sm border border-gray-100 shadow-sm">
                      <img src={itemImage} alt={product?.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[15px] font-serif font-bold text-[#1a1a1a] leading-snug mb-1 pr-6">{product?.name || "Product Name"}</h4>
                      <p className="text-[12px] text-gray-500 mb-3 font-medium tracking-wide">Color : {itemColor}</p>
                      <span className="text-[15px] font-[600] text-[#111] mb-3">₹{getItemPrice(item).toLocaleString('en-IN')}</span>
                      
                      <div className="flex items-center w-max bg-[#f5f5f5] text-[#222] font-semibold text-[13px] px-1 py-1 rounded-[2px] shadow-inner mt-auto">
                        <button onClick={() => updateQuantity(item.product, item.quantity, -1)} className="px-2 hover:text-black">
                          <Minus className="w-3 h-3 hover:scale-110 transition-transform" />
                        </button>
                        <span className="w-6 text-center">{String(item.quantity).padStart(2, "0")}</span>
                        <button onClick={() => updateQuantity(item.product, item.quantity, 1)} className="px-2 hover:text-black">
                          <Plus className="w-3 h-3 hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!loading && cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-6 bg-white relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
               <input type="checkbox" className="w-[18px] h-[18px] border-2 border-gray-300 rounded-[2px] text-black bg-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-black transition-all" />
               <span className="text-[13px] text-gray-500 tracking-wide font-medium">For <span className="font-bold text-[#111]">₹100</span> Please Wrap The Product</span>
            </div>

            <div className="flex justify-between items-center mb-6 border-t border-gray-200 pt-5">
              <span className="text-[17px] font-serif font-bold text-[#333] tracking-wide">Subtotal</span>
              <span className="text-[18px] font-bold text-black tracking-tight">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <button onClick={handleCheckout} className="w-full bg-[#050505] text-white text-[12px] font-bold tracking-[0.2em] uppercase py-4 rounded-[4px] hover:bg-[#222] hover:shadow-lg transition-all active:scale-[0.99] mb-4">
              Checkout
            </button>
            <div className="text-center">
               <button onClick={onClose} className="text-[12px] font-bold text-gray-800 uppercase tracking-[0.1em] border-b-[1.5px] border-black pb-[2px] hover:text-gray-500 hover:border-gray-500 transition-colors">
                 View Cart
               </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
