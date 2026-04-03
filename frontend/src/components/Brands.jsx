import React from 'react';

const brands = [
  { id: 1, name: "Marshall", className: "font-serif italic font-bold text-3xl tracking-tight" },
  { id: 2, name: "SONOS", className: "font-sans font-black text-2xl tracking-[0.2em] uppercase" },
  { id: 3, name: "DEVIALET", className: "font-serif text-lg sm:text-xl tracking-[0.4em] uppercase" },
  { id: 4, name: "SONY", className: "font-serif font-black text-4xl uppercase" },
  { id: 5, name: "BANG & OLUFSEN", className: "font-sans text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase" },
  { id: 6, name: "JLab", isCustom: true },
  { id: 7, name: "WITHINGS", className: "font-sans font-medium text-xl tracking-[0.15em] uppercase" },
  { id: 8, name: "tru=e", isCustom: true },
  { id: 9, name: "SHOKZ", className: "font-sans font-black text-3xl italic tracking-tight uppercase" },
  { id: 10, name: "Therabody", className: "font-serif font-medium text-2xl tracking-tight" },
  { id: 11, name: "HUROM", className: "font-sans font-black text-2xl tracking-widest uppercase" },
  { id: 12, name: "Bowers & Wilkins", className: "font-sans font-light text-xl tracking-wide" },
  { id: 13, name: "JBL", className: "font-sans font-black text-4xl tracking-tighter" },
  { id: 14, name: "BOSE", className: "font-sans italic font-black text-3xl tracking-widest uppercase" },
  { id: 15, name: "harman/kardon", className: "font-sans font-bold text-xl tracking-tight lowercase" },
  { id: 16, name: "Ledger", isCustom: true },
  { id: 17, name: "EDIFIER", className: "font-sans font-black text-2xl tracking-widest uppercase" },
  { id: 18, name: "Goldmedal", isCustom: true },
  { id: 19, name: "nanoleaf", isCustom: true },
];

export default function BrandsSection() {
  return (
    <section className="py-16 selection:bg-[#c8a253] selection:text-white transition-colors duration-500 bg-[#ffffff]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h2 className="font-black uppercase tracking-[0.2em] relative inline-block text-[#1d1d1f]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(24px, 4vw, 36px)" }}>
            Our Partners
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-[#c8a253]"></span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 sm:gap-y-3 gap-x-8 lg:gap-x-12 px-4 lg:px-12 max-w-[1400px] mx-auto items-center justify-items-center">
          {brands.map((brand) => (
            <div key={brand.id} className="w-full flex items-center justify-center min-h-[5rem] h-auto hover:scale-105 transition-transform duration-300 cursor-pointer grayscale hover:grayscale-0 opacity-80 hover:opacity-100">
              {brand.name === "tru=e" ? (
                <div className="flex flex-col items-center justify-center mt-2">
                   <div className="flex gap-[3px] items-end mb-1">
                     <div className="w-[2px] h-5 bg-[#1d1d1f]"></div>
                     <div className="w-[3px] h-8 bg-[#1d1d1f]"></div>
                     <div className="w-[3px] h-10 bg-[#1d1d1f]"></div>
                     <div className="w-[3px] h-8 bg-[#1d1d1f]"></div>
                     <div className="w-[2px] h-5 bg-[#1d1d1f]"></div>
                   </div>
                   <div className="w-10 h-[2px] mb-1 bg-[#1d1d1f]"></div>
                   <p className="text-lg font-light tracking-[0.2em] mt-1 font-sans text-[#1d1d1f]">tru<span className="font-bold">=</span>e</p>
                </div>
              ) : brand.name === "JLab" ? (
                <div className="flex items-center gap-1.5">
                   <div className="w-7 h-7 rounded-full border-[3px] flex items-center justify-center border-[#c8a253]">
                     <div className="w-2.5 h-2.5 rounded-sm rotate-45 bg-[#c8a253]"></div>
                   </div>
                   <span className="font-sans font-black text-2xl tracking-tighter uppercase text-[#1d1d1f]">JLAB</span>
                </div>
              ) : brand.name === "Ledger" ? (
                <div className="flex items-center gap-2">
                   <div className="grid grid-cols-2 gap-[2px]">
                      <div className="w-3 h-3 rounded-[1px] bg-[#1d1d1f]"></div>
                      <div className="w-3 h-3 rounded-[1px] bg-[#1d1d1f]"></div>
                      <div className="w-3 h-3 rounded-[1px] bg-[#1d1d1f]"></div>
                      <div className="w-3 h-3 border-[2px] rounded-[1px] border-[#1d1d1f]"></div>
                   </div>
                   <span className="font-sans font-bold text-2xl tracking-tight text-[#1d1d1f]">Ledger</span>
                </div>
              ) : brand.name === "Goldmedal" ? (
                <div className="flex flex-col items-center">
                   <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 border-[2px] rounded-sm flex items-center justify-center relative border-[#1d1d1f]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div>
                      </div>
                      <span className="font-serif font-black text-[22px] tracking-tighter text-[#c8a253]">Goldmedal</span>
                   </div>
                   <span className="text-[6px] font-sans tracking-[0.25em] uppercase font-bold mt-1 ml-4 text-[#1d1d1f]">Switches & Systems</span>
                </div>
              ) : brand.name === "nanoleaf" ? (
                <div className="flex flex-col items-center">
                   <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-tl-full rounded-br-full rounded-tr-md rounded-bl-md relative flex items-center justify-center bg-[#c8a253]">
                        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                      <span className="font-sans font-bold text-[26px] tracking-tighter lowercase text-[#1d1d1f]">nanoleaf</span>  
                   </div>
                   <span className="text-[6px] font-sans tracking-widest mt-0.5 ml-6 text-[#c8a253]">Smarter by Design</span>        
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center mt-2 md:mt-0">
                  <span className={brand.className + " text-[#1d1d1f]"}>{brand.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
