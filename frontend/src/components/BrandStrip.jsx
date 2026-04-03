import React from 'react';

// Re-using the exact brand logo definitions from your application
const brands = [
  { id: 1, name: "Marshall", className: "font-serif italic font-[700] text-[28px] md:text-[34px] tracking-tighter text-[#111]" },
  { id: 2, name: "SONOS", className: "font-sans font-[800] text-[20px] md:text-[26px] tracking-[0.1em] text-[#111] uppercase" },
  { id: 3, name: "DEVIALET", className: "font-serif text-[16px] md:text-[20px] tracking-[0.4em] text-[#111] uppercase" },
  { id: 4, name: "SONY", className: "font-serif font-[900] text-[26px] md:text-[32px] text-[#111] uppercase" },
  { id: 5, name: "BANG & OLUFSEN", className: "font-sans text-[10px] md:text-[12px] font-[600] tracking-[0.2em] text-[#111] uppercase" },
  { id: 6, name: "JLab", isCustom: true }, 
  { id: 7, name: "WITHINGS", className: "font-sans font-[500] text-[18px] md:text-[20px] tracking-[0.15em] text-[#111] uppercase" },
  { id: 8, name: "tru=e", isCustom: true },
  { id: 9, name: "SHOKZ", className: "font-sans font-[900] text-[22px] md:text-[28px] italic tracking-tight text-[#111] uppercase" },
  { id: 10, name: "Therabody", className: "font-serif font-[500] text-[20px] md:text-[24px] tracking-tight text-[#111]" },
  { id: 11, name: "HUROM", className: "font-sans font-[900] text-[20px] md:text-[24px] tracking-widest text-[#111] uppercase" },
  { id: 12, name: "Bowers & Wilkins", className: "font-sans font-light text-[18px] md:text-[20px] tracking-wide text-[#111]" },
  { id: 13, name: "JBL", className: "font-sans font-[900] text-[30px] md:text-[36px] tracking-tighter text-[#111]" },
  { id: 14, name: "BOSE", className: "font-sans italic font-[900] text-[24px] md:text-[30px] tracking-[0.15em] text-[#111] uppercase", style: { transform: "scaleY(1.05) scaleX(1.15)" } },
  { id: 15, name: "harman/kardon", isCustom: true },
  { id: 16, name: "Ledger", isCustom: true },
  { id: 17, name: "EDIFIER", className: "font-sans font-[900] text-[20px] md:text-[24px] tracking-widest text-[#111] uppercase" },
  { id: 18, name: "Goldmedal", isCustom: true },
  { id: 19, name: "nanoleaf", isCustom: true },
];

const RenderBrand = ({ brand }) => {
  if (brand.name === "harman/kardon") {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-baseline">
          <span className="font-sans font-bold text-[18px] md:text-[22px] tracking-tight text-[#111]">harman</span>
          <span className="font-light mx-[1px] text-gray-400 text-[18px] md:text-[22px]">/</span>
          <span className="font-sans font-bold text-[18px] md:text-[22px] tracking-tight text-[#111]">kardon</span>
        </div>
        <span className="text-[5px] md:text-[6.5px] font-[700] tracking-[0.25em] -mr-8 mt-[1px] text-[#555]">BY HARMAN</span>
      </div>
    );
  }
  
  if (brand.name === "tru=e") {
    return (
      <div className="flex flex-col items-center justify-center mt-2">
         <div className="flex gap-[3px] items-end mb-1">
           <div className="w-[2px] h-5 bg-[#111]"></div><div className="w-[3px] h-8 bg-[#111]"></div>
           <div className="w-[3px] h-10 bg-[#111]"></div><div className="w-[3px] h-8 bg-[#111]"></div><div className="w-[2px] h-5 bg-[#111]"></div>
         </div>
         <div className="w-10 h-[2px] bg-[#111] mb-1"></div>
         <p className="text-lg font-light text-[#111] tracking-[0.2em] mt-1 font-sans">tru<span className="font-bold">=</span>e</p>
      </div>
    );
  }

  if (brand.name === "JLab") {
    return (
      <div className="flex items-center gap-1.5">
         <div className="w-7 h-7 rounded-full border-[3px] border-[#111] flex items-center justify-center">
           <div className="w-2.5 h-2.5 bg-[#111] rounded-sm rotate-45"></div>
         </div>
         <span className="font-sans font-black text-2xl tracking-tighter uppercase text-[#111]">JLAB</span>
      </div>
    );
  }

  if (brand.name === "Ledger") {
    return (
      <div className="flex items-center gap-2">
         <div className="grid grid-cols-2 gap-[2px]">
            <div className="w-3 h-3 bg-[#111] rounded-[1px]"></div><div className="w-3 h-3 bg-[#111] rounded-[1px]"></div>
            <div className="w-3 h-3 bg-[#111] rounded-[1px]"></div><div className="w-3 h-3 bg-transparent border-[2px] border-[#111] rounded-[1px]"></div>
         </div>
         <span className="font-sans font-bold text-2xl tracking-tight text-[#111]">Ledger</span>
      </div>
    );
  }

  if (brand.name === "Goldmedal") {
    return (
      <div className="flex flex-col items-center">
         <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 border-[2px] border-[#111] rounded-sm flex items-center justify-center relative">
              <div className="w-1.5 h-1.5 bg-[#111] rounded-full"></div>
            </div>
            <span className="font-serif font-black text-[22px] text-[#111] tracking-tighter">Goldmedal</span>
         </div>
         <span className="text-[6px] font-sans tracking-[0.25em] uppercase font-bold text-[#111] mt-1 ml-4">Switches & Systems</span>
      </div>
    );
  }

  if (brand.name === "nanoleaf") {
    return (
      <div className="flex flex-col items-center">
         <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-[#111] rounded-tl-full rounded-br-full rounded-tr-md rounded-bl-md relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
            <span className="font-sans font-bold text-[26px] tracking-tighter lowercase text-[#111]">nanoleaf</span>
         </div>
         <span className="text-[6px] font-sans tracking-widest text-[#111] mt-0.5 ml-6">Smarter by Design</span>
      </div>
    );
  }

  return (
    <span className={brand.className} style={brand.style || {}}>
      {brand.name}
    </span>
  );
};

const BrandStrip = () => {
  return (
    <section className="w-full bg-white py-6 flex items-center justify-center z-10 relative overflow-hidden border-y border-gray-50">
      {/* Container with Marquee Animation */}
      <div className="w-full flex overflow-hidden group">
        <div className="flex whitespace-nowrap animate-marquee items-center opacity-80 mix-blend-multiply group-hover:animation-pause">
          {/* Duplicate arrays to make smooth infinite sliding */}
          {[...brands, ...brands].map((brand, index) => (
            <div 
              key={`${brand.id}-${index}`} 
              className="flex-shrink-0 cursor-pointer grayscale hover:grayscale-0 transition-opacity duration-300 mx-10 md:mx-14 flex items-center justify-center self-center"
            >
              <RenderBrand brand={brand} />
            </div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        .group-hover\\:animation-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default BrandStrip;