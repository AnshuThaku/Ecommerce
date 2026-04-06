import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MarshallWideLayout = () => {
  // Hardcoded Images 
  const imgSet1 = {
    left:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu5O2VLbibhlbMalWUWL1nenxHsldPe2OP5Q&s",
    right:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiHbqWWlKO6JKAqnl4L4MHkT8ORAy1qU55jQ&s"
  };

  return (
    <div className="w-full bg-white flex items-center justify-center pt-10 pb-10 px-2 md:px-4 font-sans">

      {/* ⚡ Main Container - Width 98% aur gap exactly 'gap-1' kar diya gaya hai */}
      <div className="relative w-[98%] mx-auto flex flex-col md:flex-row items-center justify-center gap-1">
        
        {/* LEFT IMAGE BOX - Height thodi badhai hai taaki width ke hisaab se acha lage */}
        <div className="relative w-full flex-1 h-[460px] bg-gray-50 overflow-hidden shadow-sm">
          <img 
            src={imgSet1.left} 
            alt="Model Portrait" 
            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          />
          
          {/* BLACK BOX WITH BIG '✕' */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-black flex flex-col items-center justify-center pointer-events-none">
            <span className="text-white text-8xl font-normal select-none mb-[-10px] opacity-90">✕</span>
            <div className="mt-8"> 
              <ChevronLeft className="text-white opacity-40" size={16} />
            </div>
          </div>
        </div>

        {/* ⚡ CENTER BUTTONS - Dono buttons ke beech mein halka sa gap-2 rakha hai */}
        <div className="flex flex-row gap-2 z-30 shrink-0">
          <button className="w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-90 border border-gray-100 cursor-pointer">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-90 border border-gray-100 cursor-pointer">
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* RIGHT IMAGE BOX */}
        <div className="relative w-full flex-1 h-[460px] bg-gray-50 overflow-hidden shadow-sm">
          <img 
            src={imgSet1.right} 
            alt="Audio Product" 
            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          />
          
          {/* BUY NOW Button */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button className="bg-black text-white px-9 py-4 text-[11px] rounded-lg font-bold tracking-[0.5em] uppercase hover:bg-zinc-800 transition-all shadow-xl active:scale-95 cursor-pointer">
              BUY NOW
            </button>
          </div>
        </div>

      </div>

      {/* Decorative Top Notch */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-b-xl opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default MarshallWideLayout;