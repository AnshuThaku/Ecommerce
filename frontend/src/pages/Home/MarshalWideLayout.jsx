import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MarshallWideLayout = () => {
  // Hardcoded Images
  const imgSet1 = {
    left: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=1200",
    right: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200"
  };
  const imgSet2 = {
    left: "https://images.unsplash.com/photo-1583394838336-acd977730f90?q=80&w=1200",
    right: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200"
  };

  const [isFirstSet, setIsFirstSet] = useState(true);
  const toggleImages = () => setIsFirstSet((prev) => !prev);

  return (
    <div className="w-full bg-white flex items-center justify-center pt-10 pb-10 px-8 font-sans">

      {/* Main Container - Gap reduced to gap-4 */}
      <div className="relative w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-center gap-4">
        
        {/* LEFT IMAGE BOX */}
        <div className="relative w-full md:w-1/2 h-[420px] bg-gray-50 overflow-hidden shadow-sm border border-gray-100">
          <img 
            src={isFirstSet ? imgSet1.left : imgSet2.left} 
            alt="Model Portrait" 
            className="w-full h-full object-cover transition-all duration-500"
          />
          
          {/* BLACK BOX WITH BIG '✕' */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-black flex flex-col items-center justify-center pointer-events-none">
            <span className="text-white text-8xl font-normal select-none mb-[-10px] opacity-90">✕</span>
            <div className="mt-8"> 
              <ChevronLeft className="text-white opacity-40" size={16} />
            </div>
          </div>
        </div>

        {/* CENTER NAVIGATION - Tight horizontal layout */}
        <div className="flex flex-row gap-2 z-30 shrink-0">
          <button 
            onClick={toggleImages}
            className="w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-90 border border-gray-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={toggleImages}
            className="w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-90 border border-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* RIGHT IMAGE BOX */}
        <div className="relative w-full md:w-1/2 h-[420px] bg-gray-50 overflow-hidden shadow-sm border border-gray-100">
          <img 
            src={isFirstSet ? imgSet1.right : imgSet2.right} 
            alt="Audio Product" 
            className="w-full h-full object-cover transition-all duration-500"
          />
          
          {/* BUY NOW Button */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button className="bg-black text-white px-9 py-4 text-[11px] rounded-lg font-bold tracking-[0.5em] uppercase hover:bg-zinc-800 transition-all shadow-xl active:scale-95">
              BUY NOW
            </button>
          </div>
        </div>

      </div>

      {/* Decorative Top Notch */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-b-xl opacity-10"></div>
    </div>
  );
};

export default MarshallWideLayout;