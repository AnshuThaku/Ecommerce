
// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Hero({ accentColor = "#d3b574", bg = "#121212", featuredProducts = [] }) {
//   const [current, setCurrent] = useState(0);
//   const [hoveredBtn, setHoveredBtn] = useState(false);
//   const navigate = useNavigate();

//   // ── LOGIC: Safely get the image from product variants ──
//   const getProductImg = (p) => {
//     if (p.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
//     if (p.images?.[0]?.url) return p.images[0].url;
//     return "/preview(1).png"; // Fallback image
//   };

//   // ── LOGIC: Generate SEO Friendly URL ──
//   const createProductUrl = (p) => {
//     const cat = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'luxury';
//     const brand = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'exclusive';
//     const name = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product';
//     return `/${cat}/${brand}/${name}/p/${p._id}`;
//   };

//   // ── LOGIC: Map Featured Products (with Fallback if Admin hasn't set any) ──
//   const displayItems = featuredProducts.length > 0
//     ? featuredProducts.map(p => ({
//       id: p._id,
//       image: getProductImg(p),
//       title: p.name,
//       subtitle: p.brand || "Exclusive Selection",
//       url: createProductUrl(p)
//     }))
//     : [
//       { id: 1, image: "/preview(1).png", title: "HOME LINE III", subtitle: "Bring the big stage home", url: "/shop" },
//       { id: 2, image: "/canvass.png", title: "ARTISAN CANVAS", subtitle: "Crafted for perfection", url: "/shop" },
//       { id: 3, image: "/canvas.png", title: "MODERN LUXURY", subtitle: "Elevate your space", url: "/shop" }
//     ];

//   const goTo = useCallback((index) => {
//     if (displayItems.length === 0) return;
//     setCurrent(index);
//   }, [displayItems.length]);

//   const next = useCallback(() => {
//     if (displayItems.length === 0) return;
//     const nextIndex = current === displayItems.length - 1 ? 0 : current + 1;
//     goTo(nextIndex);
//   }, [current, goTo, displayItems.length]);

//   useEffect(() => {
//     if (displayItems.length > 1) {
//       const timer = setInterval(() => {
//         next();
//       }, 5000);
//       return () => clearInterval(timer);
//     }
//   }, [next, displayItems.length]);

//   // Handle click on the whole image container to navigate
//   const handleContainerClick = () => {
//     if (displayItems[current]?.url) {
//       navigate(displayItems[current].url);
//     }
//   };

//   return (
//     <div
//       
//       style={{
//         fontFamily: "'Inter', sans-serif",
//         background: bg,
//         transition: "background 0.7s",
//         color: "white",
//         height: "80vh",
//         width: "100%",
//         overflow: "hidden",
//         position: "relative",
//         boxSizing: "border-box",
//         cursor: "pointer", // Pura hero section clickable dikhega
//       }}
//     >
//       {/* ── EXTERNAL FONT LINK ── */}
//       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />

//       {/* ── KEYFRAMES ── */}
//       <style>{`
//         @keyframes floatGlow {
//           0% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-48%, -52%) scale(1.1); }
//           100% { transform: translate(-50%, -50%) scale(1); }
//         }
//       `}</style>

//       {/* Dark Overlay & Background */}
//       <div style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         background: "radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)",
//         zIndex: 1
//       }} />

//       {/* ── BACKGROUND GLOW EFFECT ── */}
//       <div style={{ 
//         position: "absolute",
//         width: "50vh",
//         height: "50vh",
//         background: accentColor,
//         filter: "blur(150px)",
//         opacity: 0.04,
//         borderRadius: "50%",
//         pointerEvents: "none",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         animation: "floatGlow 8s ease-in-out infinite",
//         zIndex: 2
//       }} />

//       {/* ── 1. TOP LEFT TEXT (FIXED POSITION) ── */}
//       <div style={{
//         position: "absolute",
//         top: "25vh", // Header se kafi niche aur clear rahe
//         left: "5vw", // Left side se alignment
//         zIndex: 10,
//         pointerEvents: "none"
//       }}>
//         <div style={{
//           fontSize: "clamp(24px, 4vw, 36px)",
//           opacity: 0.9,
//           fontWeight: 600,
//           textShadow: "0 4px 24px rgba(0,0,0,0.8)",
//           background: "linear-gradient(90deg, #d3b574, #f5e6c4, #d3b574)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           letterSpacing: "1px"
//         }}>
//           True Luxury
//         </div>
//       </div>

//       {/* ── 2. CENTER IMAGE (FIXED POSITION & SIZE) ── */}
//       <div style={{ 
//         position: "absolute", 
//         top: "50%", 
//         left: "50%", 
//         transform: "translate(-50%, -50%)",
//         width: "100%", 
//         maxWidth: "450px", 
//         height: "45vh", // Image height thodi kam ki taaki buttons overlap na hon
//         maxHeight: "400px",
//         zIndex: 5 
//       }}>
//         {displayItems.map((item, index) => (
//           <img
//             key={item.id}
//             src={item.image}
//             alt={item.title}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               objectFit: "contain",
//               objectPosition: "center",
//               opacity: index === current ? 1 : 0,
//               transform: index === current ? "scale(1)" : "scale(1.05)",
//               transition: "opacity 0.8s ease, transform 0.8s ease",
//             }}
//           />
//         ))}
//       </div>

//       {/* ── 3. BOTTOM CONTROLS: BUTTON & DOTS (FIXED POSITION) ── */}
//       <div style={{
//         position: "absolute",
//         bottom: "3vh", // 👈 CHANGED: 2vh se 6vh kar diya taaki thoda aur upar dikhe
//         left: "50%",
//         transform: "translateX(-50%)", // Perfectly center
//         zIndex: 10,
//         display: "flex", 
//         flexDirection: "column", 
//         alignItems: "center", 
//         gap: "16px",
//         pointerEvents: "auto" // Clickable rakha
//       }}>
        
//         {/* Shop Now Button (Ab ye upar hai) */}
//         <button
//           onMouseEnter={() => setHoveredBtn(true)}
//           onMouseLeave={() => setHoveredBtn(false)}
//           onClick={(e) => {
//             e.stopPropagation();
//             if (displayItems[current]?.url) navigate(displayItems[current].url);
//           }}
//           style={{
//             border: `1px solid ${accentColor}`,
//             color: hoveredBtn ? "#000" : accentColor,
//             background: hoveredBtn ? accentColor : "rgba(0,0,0,0.5)",
//             backdropFilter: "blur(4px)",
//             padding: "10px 18px", 
//             fontSize: "clamp(12px, 1.2vw, 14px)", 
//             fontWeight: 500,
//             textTransform: "uppercase",
//             letterSpacing: "1.5px",
//             transition: "all 0.5s",
//             cursor: "pointer",
//             whiteSpace: "nowrap",
//             transform: hoveredBtn ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
//           }}
//         >
//           Shop Now
//         </button>

//         {/* Dots Pagination (Ab ye niche hai) */}
//         <div 
//           style={{ display: "flex", gap: "12px" }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {displayItems.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goTo(index)}
//               style={{
//                 width: "10px", 
//                 height: "10px",
//                 borderRadius: "50%",
//                 border: "none",
//                 cursor: "pointer",
//                 background: index === current ? accentColor : "rgba(255, 255, 255, 0.3)",
//                 transition: "all 0.3s ease",
//                 transform: index === current ? "scale(1.2)" : "scale(1)",
//                 padding: 0,
//                 boxShadow: index === current ? `0 0 8px ${accentColor}` : "none"
//               }}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero({ featuredProducts = [] }) {
  const [current, setCurrent] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const navigate = useNavigate();

  // ── LOGIC: Safely get the image from product variants ──
  const getProductImg = (p) => {
    if (p.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
    if (p.images?.[0]?.url) return p.images[0].url;
    return "/preview(1).png"; // Fallback image
  };

  // ── LOGIC: Generate SEO Friendly URL ──
  const createProductUrl = (p) => {
    const cat = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'luxury';
    const brand = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'exclusive';
    const name = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product';
    return `/${cat}/${brand}/${name}/p/${p._id}`;
  };

  // ── LOGIC: Map Featured Products ──
  const displayItems = featuredProducts.length > 0
    ? featuredProducts.map(p => ({
        id: p._id,
        image: getProductImg(p),
        title: p.name,
        subtitle: p.brand || "Exclusive Selection",
        url: createProductUrl(p),
        category: p.category
      }))
    : [
        { id: 1, image: "/preview(1).png", title: "HOME LINE III", subtitle: "Bring the big stage home", url: "/shop" },
        { id: 2, image: "/canvass.png", title: "ARTISAN CANVAS", subtitle: "Crafted for perfection", url: "/shop" },
        { id: 3, image: "/canvas.png", title: "MODERN LUXURY", subtitle: "Elevate your space", url: "/shop" }
      ];

  const goTo = useCallback((index) => {
    if (displayItems.length === 0) return;
    setCurrent(index);
  }, [displayItems.length]);

  const next = useCallback(() => {
    if (displayItems.length === 0) return;
    const nextIndex = current === displayItems.length - 1 ? 0 : current + 1;
    goTo(nextIndex);
  }, [current, goTo, displayItems.length]);

  useEffect(() => {
    if (displayItems.length > 1) {
      const timer = setInterval(() => {
        next();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [next, displayItems.length]);

  const handleContainerClick = () => {
    if (displayItems[current]?.url) {
      navigate(displayItems[current].url);
    }
  };

  return (
    <div
      
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "var(--theme-bg-dark, #121212)", // ⚡ Integrated
        transition: "background 0.7s",
        color: "var(--theme-text-light, white)",     // ⚡ Integrated
        height: "80vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        cursor: "pointer",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes floatGlow {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-48%, -52%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      {/* Dark Overlay & Background */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "var(--theme-gradient, radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%))", // ⚡ Integrated
        zIndex: 1
      }} />

      {/* BACKGROUND GLOW EFFECT */}
      <div style={{ 
        position: "absolute",
        width: "50vh", height: "50vh",
        background: "var(--theme-primary, #d3b574)", // ⚡ Integrated
        filter: "blur(150px)",
        opacity: 0.04,
        borderRadius: "50%",
        pointerEvents: "none",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        animation: "floatGlow 8s ease-in-out infinite",
        zIndex: 2
      }} />

      {/* 1. TOP LEFT TEXT */}
      <div style={{
        position: "absolute",
        top: "25vh", left: "5vw",
        zIndex: 10, pointerEvents: "none"
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(24px, 3vw, 36px)",
          opacity: 0.9,
          fontWeight: 400,
          textTransform: "uppercase",
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          color: "var(--theme-text-light, #ffffff)",
          letterSpacing: "4px"
        }}>
          {/* Dynamic Greeting if available or default text */}
          True Luxury
        </div>
      </div>

      {/* 2. CENTER IMAGE */}
      <div style={{ 
        position: "absolute", top: "50%", left: "50%", 
        transform: "translate(-50%, -50%)",
        width: "100%", maxWidth: "450px", height: "45vh",
        maxHeight: "400px", zIndex: 5 
      }}>
        {displayItems.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.title}
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              objectFit: "contain",
              opacity: index === current ? 1 : 0,
              transform: index === current ? "scale(1)" : "scale(1.05)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          />
        ))}
      </div>

      {/* 3. BOTTOM CONTROLS */}
      <div style={{
        position: "absolute", bottom: "3vh", left: "50%",
        transform: "translateX(-50%)", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
        pointerEvents: "auto"
      }}>
        
        {/* Shop Now Button */}
        <button
          onMouseEnter={() => setHoveredBtn(true)}
          onMouseLeave={() => setHoveredBtn(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (displayItems[current]?.category) {
              navigate('/shop', { state: { category: displayItems[current].category } });
            } else if (displayItems[current]?.url) {
              navigate(displayItems[current].url);
            }
          }}
          style={{
            border: `1.5px solid var(--theme-primary, #d3b574)`, 
            color: hoveredBtn ? "var(--theme-bg-dark, #000)" : "var(--theme-primary, #d3b574)", 
            background: hoveredBtn ? "var(--theme-primary, #d3b574)" : "rgba(18, 18, 18, 0.4)", 
            backdropFilter: "blur(8px)",
            padding: "12px 36px", 
            fontSize: "clamp(11px, 1.2vw, 13px)", 
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "4px",
            boxShadow: hoveredBtn ? "0 8px 32px rgba(0,0,0,0.5)" : "0 4px 15px rgba(0,0,0,0.3)",
            transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transform: hoveredBtn ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
            borderRadius: "30px"
          }}
        >
          Shop Now
        </button>

        {/* Dots Pagination */}
        <div 
          style={{ display: "flex", gap: "12px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {displayItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              style={{
                width: "10px", height: "10px", borderRadius: "50%", border: "none",
                cursor: "pointer",
                background: index === current ? "var(--theme-primary, #d3b574)" : "rgba(255, 255, 255, 0.3)", // ⚡ Integrated
                transition: "all 0.3s ease",
                transform: index === current ? "scale(1.2)" : "scale(1)",
                padding: 0,
                boxShadow: index === current ? `0 0 8px var(--theme-primary)` : "none" // ⚡ Integrated
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}