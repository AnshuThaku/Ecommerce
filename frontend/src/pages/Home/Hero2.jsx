
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero({ accentColor = "#d3b574", bg = "#121212", featuredProducts = [] }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  
  // ── LOGIC: Detect Mobile Screen ──
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  // ── LOGIC: Get Desktop Image (1st Image) ──
  const getDesktopImg = (p) => {
    if (p.variants?.[0]?.images?.[0]?.url) return p.variants[0].images[0].url;
    if (p.images?.[0]?.url) return p.images[0].url;
    return "/preview(1).png"; // Fallback image
  };

  // ── LOGIC: Get Mobile Image (2nd Image) ──
  const getMobileImg = (p) => {
    // Check for the 2nd image for mobile view
    if (p.variants?.[0]?.images?.[1]?.url) return p.variants[0].images[1].url;
    if (p.images?.[1]?.url) return p.images[1].url;
    
    // Agar dusri image nahi hai, toh pehli wali hi return kar do
    return getDesktopImg(p); 
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
      desktopImage: getDesktopImg(p),
      mobileImage: getMobileImg(p),
      title: p.name,
      subtitle: p.brand || "Exclusive Selection",
      url: createProductUrl(p)
    }))
    : [
      // Default images agar database khali ho (Demo ke liye alag mobile images set hain)
      { id: 1, desktopImage: "/preview(1).png", mobileImage: "/mobile-preview(1).png", title: "HOME LINE III", subtitle: "Bring the big stage home", url: "/shop" },
      { id: 2, desktopImage: "/canvass.png", mobileImage: "/mobile-canvass.png", title: "ARTISAN CANVAS", subtitle: "Crafted for perfection", url: "/shop" },
      { id: 3, desktopImage: "/canvas.png", mobileImage: "/mobile-canvas.png", title: "MODERN LUXURY", subtitle: "Elevate your space", url: "/shop" }
    ];

  const goTo = useCallback((index) => {
    if (displayItems.length === 0) return;
    
    // ── CHANGES: Click karte hi turant image change hogi bina delay ke ──
    setCurrent(index);
    
    // Text reveal animation ke liye state update
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
    }, 400); // 600ms se kam karke 400ms kar diya snappy feel ke liye
  }, [displayItems.length]);

  const prev = () => {
    if (displayItems.length === 0) return;
    const nextIndex = current === 0 ? displayItems.length - 1 : current - 1;
    goTo(nextIndex);
  };

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

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: bg,
        transition: "background 0.7s",
        color: "white",
        height: "80vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        padding: "16vh 4vw 4vh 4vw",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Great+Vibes&display=swap');
        
        .text-reveal {
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translateY(${animating ? "20px" : "0"});
          opacity: ${animating ? "0" : "1"};
        }

        .glow-effect {
          position: absolute;
          width: 50vh;
          height: 50vh;
          background: ${accentColor};
          filter: blur(150px);
          opacity: 0.04;
          border-radius: 50%;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: floatGlow 8s ease-in-out infinite;
        }

        @keyframes floatGlow {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-48%, -52%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      {/* Background Glow */}
      <div className="glow-effect" />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <div
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            opacity: 0.9,
            fontWeight: 600,
            textShadow: "0 4px 24px rgba(0,0,0,0.4)",
            background: "linear-gradient(90deg, #d3b574, #f5e6c4, #d3b574)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          True Luxury
        </div>
      </div>

      {/* Responsive Slider Section */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        minHeight: 0
      }}>

        {/* ── CHANGES: Button ka z-index aur padding badha diya taaki easily click ho sake ── */}
        <button onClick={prev} style={{ background: "none", border: "none", color: "white", cursor: "pointer", opacity: 0.7, zIndex: 50, padding: "10px" }}>
          <ChevronLeft size="clamp(28px, 5vw, 44px)" />
        </button>

        {/* Dynamic Image Wrapper */}
        <div style={{ width: "100%", height: "100%", maxWidth: "450px", maxHeight: "min(450px, 45vh)", position: "relative", margin: "0 auto" }}>
          {displayItems.map((item, index) => (
            <img
              key={item.id}
              // ── MAGIC HAPPENS HERE: Screen size ke according image set hogi ──
              src={isMobile ? item.mobileImage : item.desktopImage}
              alt={item.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: index === current ? 1 : 0,
                transform: index === current ? "scale(1) rotate(0deg)" : "scale(1.05) rotate(-2deg)",
                transition: "all 0.8s ease",
              }}
            />
          ))}
        </div>

        {/* ── CHANGES: Button ka z-index aur padding badha diya taaki easily click ho sake ── */}
        <button onClick={next} style={{ background: "none", border: "none", color: "white", cursor: "pointer", opacity: 0.7, zIndex: 50, padding: "10px" }}>
          <ChevronRight size="clamp(28px, 5vw, 44px)" />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative",
        zIndex: 10,
        gap: "20px"
      }}>

        {/* Text */}
        <div className="text-reveal" style={{ textAlign: "center" }}>
          <h2 style={{
            fontSize: "clamp(20px, 4vw, 36px)",
            textTransform: "uppercase",
            margin: "0 0 8px 0"
          }}>
            {displayItems[current]?.title}
          </h2>
          <p style={{
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "2px",
            margin: 0,
            fontSize: "clamp(10px, 1.5vw, 14px)"
          }}>
            {displayItems[current]?.subtitle}
          </p>
        </div>

        {/* Button */}
        <div>
          <button
            onClick={() => navigate(displayItems[current]?.url)}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
            style={{
              border: `1px solid ${accentColor}`,
              color: hoveredBtn ? "#000" : accentColor,
              background: hoveredBtn ? accentColor : "transparent",
              padding: "12px 24px",
              fontSize: "clamp(14px, 1.5vw, 16px)",
              transition: "all 0.5s",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transform: hoveredBtn ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
            }}
          >
            Shop Now
          </button>
        </div>

      </div>
    </div>
  );
}