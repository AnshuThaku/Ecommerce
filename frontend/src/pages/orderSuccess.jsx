import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Checkout page se orderId pass karenge hum
  const orderId = location.state?.orderId || "ORD-" + Math.floor(Math.random() * 1000000);

  // Agar bina order ke is page par aaya hai koi, toh home pe bhej do
  useEffect(() => {
    if (!location.state?.orderId) {
       // Commenting this out for testing, but in production you'd redirect
       // navigate('/'); 
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-serif text-white mb-2">Thank You!</h1>
        <p className="text-[#C8A253] text-sm tracking-widest uppercase mb-6">Order Confirmed</p>

        <div className="bg-[#111] rounded-lg p-4 mb-8 border border-zinc-800 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-zinc-500 text-sm">Order ID:</span>
            <span className="text-white font-mono text-sm">{orderId.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-500 text-sm">Payment Status:</span>
            <span className="text-green-500 text-sm font-medium flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Paid
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">Estimated Delivery:</span>
            <span className="text-white text-sm">3-5 Business Days</span>
          </div>
        </div>

        <Link 
          to="/shop"
          className="block w-full py-3 rounded-xl bg-[#C8A253] text-[#0A0A0A] text-sm font-bold tracking-widest uppercase hover:bg-[#d4af6b] transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}