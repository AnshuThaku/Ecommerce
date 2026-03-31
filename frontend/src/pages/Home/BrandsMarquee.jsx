import React from 'react';

const priorityBrands = [
  "Marshall", "Sonos", "Devialet", "B&O", "Sony",
  "Jlab", "Truee", "Shokz", "Withings", "Therabody",
  "Hurom", "Bowers & Wilkins", "JBL", "Bose", "Harman Kardon"
];

export default function BrandsMarquee() {
  
  // Wrapper: Poori width aur clean spacing ke liye
  // ⚡ THEME UPDATE: bg-white ko bg-theme-bg-light kar diya
  return (
    <div className="w-full bg-theme-bg-light block transition-colors duration-500" style={{ width: '100%', display: 'block' }}>
      
      {/* Forced Spacer: Productcard se gap banaye rakhne ke liye */}
      <div style={{ height: '120px', width: '100%', display: 'block' }}></div>
      
      {/* ⚡ THEME UPDATE: Black bg ko bg-theme-bg-dark kar diya */}
      <div 
        className="relative overflow-hidden bg-theme-bg-dark transition-colors duration-500" 
        style={{ 
          paddingTop: '60px', 
          paddingBottom: '60px', 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
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

        {/* ⚡ THEME UPDATE: Gradients ab directly theme ke bg-dark variable se merge honge */}
        <div 
          className="absolute top-0 left-0 w-[300px] h-full z-10 pointer-events-none transition-colors duration-500" 
          style={{ background: 'linear-gradient(to right, var(--theme-bg-dark), transparent)' }}
        />
        <div 
          className="absolute top-0 right-0 w-[300px] h-full z-10 pointer-events-none transition-colors duration-500" 
          style={{ background: 'linear-gradient(to left, var(--theme-bg-dark), transparent)' }}
        />

        <div className="brands-track opacity-50 hover:opacity-100 transition-opacity duration-700">
          {[...priorityBrands, ...priorityBrands, ...priorityBrands].map((brand, i) => (
            <span 
              key={i} 
              className="text-theme-text-light uppercase tracking-[0.3em] cursor-default font-medium transition-colors duration-500"
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