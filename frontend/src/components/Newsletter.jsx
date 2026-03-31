// src/components/Newsletter.jsx
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Yahan API call lagayenge baad mein
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000); // 3 sec baad reset
      setEmail('');
    }
  };

  return (
    <section className="bg-[#0A0A0A] py-20 sm:py-28 relative overflow-hidden selection:bg-[#d3b574] selection:text-black">
      
      {/* Subtle Background Glow for Luxury Feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d3b574] opacity-[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Minimal Line */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="w-12 h-[1px] bg-[#d3b574]"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#d3b574]">The Inner Circle</span>
          <div className="w-12 h-[1px] bg-[#d3b574]"></div>
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-3xl sm:text-5xl font-serif text-white mb-4 leading-tight">
          Unlock True <span className="italic text-[#d3b574]">Luxury</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base font-light tracking-wide mb-10 max-w-lg mx-auto">
          Subscribe to receive exclusive access to limited-time releases, private sales, and the latest in premium audio and tech.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center max-w-md mx-auto gap-4 sm:gap-0">
          
          <div className="relative w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-transparent border-b border-gray-600 px-2 py-3 text-white text-sm focus:outline-none focus:border-[#d3b574] transition-colors placeholder-gray-600 peer"
            />
            {/* Animated Bottom Line */}
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d3b574] transition-all duration-500 peer-focus:w-full"></div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 bg-white hover:bg-[#d3b574] text-black px-8 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            {isSubmitted ? 'Subscribed' : 'Subscribe'}
            {!isSubmitted && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
          
        </form>

        {/* Success Message Feedback */}
        {isSubmitted && (
          <p className="text-[#d3b574] text-xs tracking-widest uppercase mt-6 animate-in fade-in slide-in-from-bottom-2">
            Welcome to the club.
          </p>
        )}

      </div>
    </section>
  );
}