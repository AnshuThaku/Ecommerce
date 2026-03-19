import React from 'react';

const priorityBrands = [
  "Marshall", "Sonos", "Devialet", "B&O", "Sony",
  "Jlab", "Truee", "Shokz", "Withings", "Therabody",
  "Hurom", "Bowers & Wilkins", "JBL", "Bose", "Harman Kardon"
];

export default function BrandsMarquee() {
  return (
    /* Wrapper: Poori width aur clean spacing ke liye */
    <div className="w-full bg-white block" style={{ width: '100%', display: 'block' }}>
      
      {/* Forced Spacer: Productcard se gap banaye rakhne ke liye */}
      <div style={{ height: '120px', width: '100%', display: 'block' }}></div>
      
      {/* Black Marquee Strip 
          Padding ko 90px se kam karke 65px kar diya hai taaki thickness aur kam ho jaye.
      */}
      <div 
        className="relative overflow-hidden bg-[#0a0a0a]" 
        style={{ 
          paddingTop: '60px', 
          paddingBottom: '60px', 
          borderTop: '1px solid #111', 
          borderBottom: '1px solid #111',
          width: '100%',
          display: 'block'
        }}
      >
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .brands-track {
            display: flex;
            gap: 180px;
            white-space: nowrap;
            /* Speed ko 150s rakha hai taaki text dheere chale aur elegant lage */
            animation: marquee 150s linear infinite;
            width: max-content;
            align-items: center;
          }
          .brands-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Side Gradients: Smooth fading transitions */}
        <div className="absolute top-0 left-0 w-[300px] h-full bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent z-10 pointer-events-none" />

        <div className="brands-track opacity-50 hover:opacity-100 transition-opacity duration-700">
          {[...priorityBrands, ...priorityBrands, ...priorityBrands].map((brand, i) => (
            <span 
              key={i} 
              className="text-white uppercase tracking-[0.3em] cursor-default font-medium"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 3.5vw, 36px)" 
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Footer spacer */}
      <div style={{ height: '100px', width: '100%', display: 'block' }}></div>
    </div>
  );
}