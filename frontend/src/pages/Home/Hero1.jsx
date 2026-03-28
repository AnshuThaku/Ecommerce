

// import { useNavigate } from "react-router-dom";

// export default function HeroAlternate({ accentColor = "#d3b574", bg = "#121212", featuredProducts = [] }) {
//   const navigate = useNavigate();

//   // ── LOGIC: Safely get the image from product variants ──
//   const getProductImg = (p) => {
//     if (p.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
//     if (p.images?.[0]?.url) return p.images[0].url;
//     return "/preview(1).png"; // Fallback
//   };

//   // ── LOGIC: Generate SEO Friendly URL ──
//   const createProductUrl = (p) => {
//     const cat = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'shop';
//     const brand = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
//     const name = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product';
//     return `/${cat}/${brand}/${name}/p/${p._id}`;
//   };

//   // ── LOGIC: Map Products & Fill missing spots with fallback data ──
//   // Layout ke liye humein exact 4 images chahiye. 
//   // Agar backend se kam aati hain, toh design kharab na ho isliye bachi hui jagah default images le lengi.
//   const fallbackItems = [
//     { id: 'f1', image: "/preview(1).png", title: "ULTIMATE", subtitle: "NEW COLLECTION", url: "/shop" },
//     { id: 'f2', image: "/canvass.png", title: "PREMIUM", subtitle: "SOUND GEAR", url: "/shop" },
//     { id: 'f3', image: "/canvas.png", title: "EXCLUSIVE", subtitle: "HOME LINE III", url: "/shop" },
//     { id: 'f4', image: "/preview(1).png", title: "MODERN", subtitle: "LISTENING", url: "/shop" }
//   ];

//   const mappedProducts = featuredProducts.map(p => ({
//     id: p._id,
//     image: getProductImg(p),
//     title: p.name || "ULTIMATE",
//     subtitle: p.brand || "NEW COLLECTION",
//     url: createProductUrl(p)
//   }));

//   // Hamesha exactly 4 items nikalenge display ke liye
//   const displayItems = [
//     ...mappedProducts,
//     ...fallbackItems.slice(mappedProducts.length)
//   ].slice(0, 4);

//   // Static positions ke liye variables
//   const currentMainItem = displayItems[0];
//   const topSmallItem = displayItems[1];
//   const bottomWideItem = displayItems[2];
//   const rightTallItem = displayItems[3];

//   if (!currentMainItem) return null;

//   return (
//     <div className="alt-hero-wrapper">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');

//         .alt-hero-wrapper {
//           background-color: ${bg};
//           color: #ffffff;
//           font-family: 'Inter', sans-serif;
//           height: 80vh;
//           width: 100%;
//           position: relative;
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-sizing: border-box;
//           padding: 20px;
//            margin-top: 60px;
//           transition: background 0.7s;
//         }

//         /* 12-Column Grid for perfectly replicating the overlapping collage */
//         .alt-grid {
//           display: grid;
//           grid-template-columns: repeat(12, 1fr);
//           grid-template-rows: repeat(10, 1fr);
//           width: 100%;
//           max-width: 1200px;
//           height: 90%;
//           gap: 15px;
//         }

//         /* Grid Areas - Aligned perfectly like your reference image */
//         /* Left Column: Large Product */
//         .item-main { grid-column: 1 / 5; grid-row: 2 / 10; display: flex; align-items: center; justify-content: center; position: relative; }
        
//         /* Middle Column Top: Small Product directly above text */
//         .item-top { grid-column: 5 / 9; grid-row: 1 / 4; display: flex; align-items: center; justify-content: center; position: relative; }
        
//         /* Middle Column Center: Text Block */
//         .item-text { grid-column: 5 / 9; grid-row: 4 / 8; z-index: 20; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        
//         /* Middle Column Bottom: Wide Image below text */
//         .item-bottom { grid-column: 5 / 9; grid-row: 8 / 11; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; background: transparent; border-radius: 8px;}
        
//         /* Right Column: Tall Vertical Image */
//         .item-right {
//           grid-column: 9 / 13;
//           grid-row: 1 / 11;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//           padding: 20px;   /* 👈 space milega */
//         }
        
//         /* Images Styling */
//         .alt-grid img {
//           width: 100%;
//           height: 100%;
//           border-radius: 8px; /* Thoda soft aur clean look dene ke liye */
//           transition: all 0.4s ease;
//         }
//         .item-main img { object-fit: contain; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5)); padding: 10px; }
        
//         .item-top img { object-fit: contain; max-height: 80%; }
        
//         /* Reference image ki tarah inko "cover" kiya hai taaki boxes poore bhar jayein */
//         .item-bottom img { 
//           object-fit: contain;   /* 👈 IMPORTANT CHANGE */
//           opacity: 1;
//         }     

//         @media (max-width: 768px) {
//           .alt-hero-wrapper {
//             padding-top: 40px;    /* 👈 Pehle 120px tha, ab space kam karne ke liye 40px kiya */
//             height: auto;
//             padding-bottom: 40px; /* 👈 Niche ka space bhi 60px se 40px kar diya */
//           }
//         }  

//         .item-right img  { 
//           opacity: 0.85;
//           max-width: 80%;
//           max-height: 100%;
//           object-fit: contain;
//         }
        
//         .item-bottom:hover img, .item-right:hover img {
//           opacity: 1;
//           transform: scale(1.03);
//         }

//         /* Typography for Dark Theme - Text sizes reduced */
//         .text-solid {
//           font-weight: 900;
//           font-size: clamp(28px, 3.5vw, 46px); /* Pehle se chhota kiya */
//           text-transform: uppercase;
//           line-height: 1;
//           margin: 0;
//           text-shadow: 0 4px 24px rgba(0,0,0,0.6);
//           background: linear-gradient(90deg, ${accentColor}, #f5e6c4, ${accentColor});
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .text-outline {
//           color: transparent;
//           -webkit-text-stroke: 1px rgba(255, 255, 255, 0.6);
//           font-weight: 800;
//           font-size: clamp(20px, 2.5vw, 30px); /* Pehle se chhota kiya */
//           text-transform: uppercase;
//           line-height: 1.2;
//           margin: 10px 0 20px 0;
//           text-shadow: 0 2px 10px rgba(0,0,0,0.5);
//         }

//         /* Button - Transparent with accent color border */
//         .buy-btn {
//           border: 1px solid ${accentColor};
//           color: ${accentColor};
//           background: transparent;
//           padding: 12px 30px;
//           font-size: 14px;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//           cursor: pointer;
//           transition: all 0.4s ease;
//         }
        
//         .buy-btn:hover {
//           background: ${accentColor};
//           color: #000;
//           transform: translateY(-3px) scale(1.02);
//           box-shadow: 0 4px 15px rgba(211, 181, 116, 0.3);
//         }

//         /* Responsive Mobile Layout */
//         @media (max-width: 850px) {
//           .alt-grid {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             gap: 10px; /* 👈 Items ke beech ka gap kam kiya */
//           }
//           .item-top, .item-bottom, .item-right {
//             display: none; /* Hide extra collage images on mobile for a clean look */
//           }
//           .item-main {
//             height: 35vh; /* 👈 Mobile par image ki height 40vh se 35vh kar di */
//             width: 100%;
//           }
//           .item-text {
//             margin-top: 10px; /* 👈 Text aur button ka top margin kam kiya */
//           }
//         }
//       `}</style>

//       {/* Grid Layout (Static) */}
//       <div className="alt-grid">
        
//         {/* 1. Main Left Image */}
//         <div className="item-main">
//           <img src={currentMainItem.image} alt={currentMainItem.title} />
//         </div>

//         {/* 2. Top Small Image */}
//         <div className="item-top">
//           {topSmallItem && <img src={topSmallItem.image} alt={topSmallItem.title} />}
//         </div>

//         {/* 3. Center Text Block */}
//         <div className="item-text">
//           <h2 className="text-solid">ULTIMATE</h2>
//           <h3 className="text-outline">NEW COLLECTION</h3>
//           <button className="buy-btn" onClick={() => navigate(currentMainItem.url)}>
//             Shop Now
//           </button>
//         </div>

//         {/* 4. Bottom Wide Image */}
//         <div className="item-bottom">
//           {bottomWideItem && <img src={bottomWideItem.image} alt={bottomWideItem.title} />}
//         </div>

//         {/* 5. Right Tall Image */}
//        <div className="item-right">
//   <img 
//     src={rightTallItem?.image || "/preview(1).png"} 
//     alt={rightTallItem?.title || "product"} 
//   />
// </div>

//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroAlternate({ accentColor = "#d3b574", bg = "#111111" }) {
  const navigate = useNavigate();
  
  const banners = [
    "/banner1.jpg", 
    "/banner2.jpg", 
    "/banner3.png"
  ];

  const extendedBanners = [banners[banners.length - 1], ...banners, banners[0]];
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 4500);
    return () => resetTimeout();
  }, [currentIndex]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTransitionEnd = () => {
    if (currentIndex === extendedBanners.length - 1) {
      setIsTransitioning(false); 
      setCurrentIndex(1); 
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(extendedBanners.length - 2); 
    }
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 1);
  };

  let activeDotIndex = currentIndex - 1;
  if (activeDotIndex === -1) activeDotIndex = banners.length - 1;
  if (activeDotIndex === banners.length) activeDotIndex = 0;

  return (
    <div className="alt-hero-wrapper">
      <style>{`
        .alt-hero-wrapper {
          background-color: ${bg};
          height: 75vh; /* Height bilkul wahi hai */
          width: 100%;  /* Width bhi wahi hai */
          position: relative;
          overflow: hidden;
          margin-top: 0px; 
          padding-top: 60px; /* 👈 TOP PADDING BADHA DI HAI taaki content niche shift ho jaye */
          box-sizing: border-box;
        }

        .slider-container {
          display: flex;
          width: 100%;
          height: 100%;
        }

        .slide {
          min-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer; 
        }

        /* 👈 IMAGE KO CHHOTA KIYA AUR CUTNE SE ROKA */
        .slide img {
          max-width: 85%; /* Image ab container ke andar 85% hi jagah legi */
          max-height: 85%; /* Isse image chhoti dikhegi */
          object-fit: contain; /* Cover ki jagah Contain kiya taaki image bilkul na kate */
          object-position: center;
        }

        .dots-container {
          position: absolute;
          bottom: 35px; 
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 20;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.4s ease;
          border: 2px solid transparent;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .dot.active {
          background: transparent;
          border: 2px solid ${accentColor};
          transform: scale(1.5);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .alt-hero-wrapper { height: 55vh; margin-top: 60px; }
          .slide img { max-width: 90%; max-height: 90%; }
        }
        @media (max-width: 768px) {
          .alt-hero-wrapper { height: 40vh; margin-top: 80px; }
          .dots-container { bottom: 20px; }
          .slide img { max-width: 95%; max-height: 95%; }
        }
        @media (max-width: 480px) {
          .alt-hero-wrapper { height: 32vh; margin-top: 60px; }
          .dots-container { bottom: 15px; gap: 8px; }
          .dot { width: 8px; height: 8px; }
        }
      `}</style>

      <div 
        className="slider-container"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? "transform 1s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedBanners.map((img, index) => (
          <div 
            key={index} 
            className="slide" 
            onClick={() => navigate('/shop')} 
          >
            <img src={img} alt={`Banner Slide ${index}`} />
          </div>
        ))}
      </div>

      <div className="dots-container">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === activeDotIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)} 
          ></div>
        ))}
      </div>
    </div>
  );
}