import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", address: "", city: "", zip: "", country: "", cardNumber: "", expiry: "", cvv: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Simulate placing order
    setTimeout(() => {
      navigate("/order-success");
    }, 1000);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-black pt-24 pb-12 px-6 lg:px-20 font-sans">
      <div className="max-w-[1000px] mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Cart
        </button>

        <h1 className="text-4xl font-serif text-[#111] mb-10 font-[600] tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-10">
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-10">
              
              <section>
                <h2 className="text-xl font-serif font-bold mb-6 border-b border-gray-100 pb-3">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">First Name</label>
                    <input type="text" name="firstName" required className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Last Name</label>
                    <input type="text" name="lastName" required className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="email" name="email" required className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Address</label>
                    <input type="text" name="address" required className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">City</label>
                    <input type="text" name="city" required className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">ZIP Code</label>
                    <input type="text" name="zip" required className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif font-bold mb-6 border-b border-gray-100 pb-3 flex items-center"><Lock className="w-5 h-5 mr-2 text-gray-400" /> Payment Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Card Number</label>
                    <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Expiry Date</label>
                    <input type="text" name="expiry" placeholder="MM/YY" className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">CVV</label>
                    <input type="text" name="cvv" placeholder="123" className="w-full border border-gray-300 p-3 text-[14px] outline-none focus:border-black transition-colors" onChange={handleChange} />
                  </div>
                </div>
              </section>

            </form>
          </div>

          <div className="flex flex-col">
             <div className="bg-white p-8 border border-gray-200 sticky top-24 shadow-sm">
                <h3 className="text-xl font-serif font-bold mb-6 border-b border-gray-100 pb-4">Order Summary</h3>

                <div className="space-y-4 mb-6 text-[14px] text-gray-600 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-black">$100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5 mb-8 flex justify-between items-center">
                  <span className="text-[15px] font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-black tracking-tight">$100.00</span>
                </div>

                <button type="submit" form="checkout-form" className="w-full bg-[#0a0a0a] text-white text-[12px] font-bold tracking-[0.2em] uppercase py-4 rounded-[3px] hover:bg-[#222] transition-colors shadow-xl shadow-black/10">
                  Place Order
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

