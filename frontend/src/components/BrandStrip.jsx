import React from 'react';

// Brand names array
const brands = [
  { id: 1, name: "Amazfit" },
  { id: 2, name: "Marshall" },
  { id: 3, name: "DEVIALET" },
  { id: 4, name: "SONOS" },
  { id: 5, name: "BANG & OLUFSEN" },
  { id: 6, name: "JLab" },
  { id: 7, name: "tru=e" },
  { id: 8, name: "SONY" },
  { id: 9, name: "SHOKZ" },
  { id: 10, name: "Sennheiser" },
  { id: 11, name: "WITHINGS" },
  { id: 12, name: "Therabody" },
  { id: 13, name: "HUROM" },
  { id: 14, name: "Bowers & Wilkins" },
  { id: 15, name: "JBL" },
  { id: 16, name: "BOSE" },
  { id: 17, name: "harman/kardon" },
  { id: 18, name: "Arcam" },
  { id: 19, name: "JVC" },
  { id: 20, name: "Formovie" },
  { id: 21, name: "ViewSonic" },
  { id: 22, name: "Ledger" },
  { id: 23, name: "Goldmedal" },
  { id: 24, name: "Aecooly" },
  { id: 25, name: "Jisulife" },
  { id: 26, name: "Plaud" },
  { id: 27, name: "Whoop" },
  { id: 28, name: "Meta Quest" },
  { id: 29, name: "Meta Rayban" },
  { id: 30, name: "IZI" },
  { id: 31, name: "Dyson" },
  { id: 32, name: "Nespresso" },
  { id: 33, name: "Ninja" },
  { id: 34, name: "Shark" },
  { id: 35, name: "KiCA" },
  { id: 36, name: "Polar" },
];

const BrandStrip = () => {
  return (
    <section className="w-full bg-white py-8 flex items-center justify-center z-10 relative overflow-hidden border-y border-gray-50">
      {/* Container with Marquee Animation */}
      <div className="w-full flex overflow-hidden group">
        <div className="flex whitespace-nowrap animate-marquee items-center opacity-70 group-hover:animation-pause">
          
          {/* Duplicate arrays to make smooth infinite sliding */}
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <div 
              key={`${brand.id}-${index}`} 
              className="flex-shrink-0 cursor-pointer text-gray-500 hover:text-black transition-colors duration-300 mx-10 md:mx-16 flex items-center justify-center self-center"
            >
              {/* Render plain text instead of logos */}
              <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-widest font-sans">
                {brand.name}
              </h3>
            </div>
          ))}

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          /* Animation speed is controlled here (60s) */
          animation: marquee 60s linear infinite; 
        }
        .group-hover\\:animation-pause:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default BrandStrip;
