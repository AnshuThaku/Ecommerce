import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 👈 Navigation ke liye import

export default function Hero({ accentColor = "#d3b574", bg = "#121212", featuredProducts = [] }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const navigate = useNavigate(); // 👈 Hook initialize kiya

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

  // ── LOGIC: Map Featured Products (with Fallback if Admin hasn't set any) ──
  const displayItems = featuredProducts.length > 0 
    ? featuredProducts.map(p => ({
        id: p._id,
        image: getProductImg(p),
        title: p.name,
        subtitle: p.brand || "Exclusive Selection",
        url: createProductUrl(p)
      }))
    : [
        // Default images agar database khali ho
        { id: 1, image: "/preview(1).png", title: "HOME LINE III", subtitle: "Bring the big stage home", url: "/shop" },
        { id: 2, image: "/canvass.png", title: "ARTISAN CANVAS", subtitle: "Crafted for perfection", url: "/shop" },
        { id: 3, image: "/canvas.png", title: "MODERN LUXURY", subtitle: "Elevate your space", url: "/shop" }
      ];

  const goTo = useCallback((index) => {
    if (animating || displayItems.length === 0) return;
    setAnimating(true);

    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 600);
  }, [animating, displayItems.length]);

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
      }, 5000); // 👈 3000ms se 5000ms kar diya taaki user text padh sake
      return () => clearInterval(timer);
    }
  }, [next, displayItems.length]);

  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        background: bg,
        transition: "background 0.7s",
        color: "white",
        paddingBottom: 40,
        marginBottom: "100px",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Great+Vibes&display=swap');
        
        .text-reveal {
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translateY(${animating ? "40px" : "0"});
          opacity: ${animating ? "0" : "1"};
        }

        .glow-effect {
          position: absolute;
          width: 500px;
          height: 500px;
          background: ${accentColor};
          filter: blur(180px);
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
      <div style={{ position: "relative", paddingTop: 48, paddingLeft: 64, paddingBottom: 40, zIndex: 10 }}>
        <div 
          style={{ 
            fontSize: 36, 
            opacity: 0.9, 
            textShadow: "0 4px 24px rgba(0,0,0,0.4)",
            background: "linear-gradient(90deg, #d3b574, #f5e6c4, #d3b574)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          True Luxury
        </div>
      </div>

      {/* Slider */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 40 }}>
        <button onClick={prev} style={{ background: "none", border: "none", color: "white", cursor: "pointer", opacity: 0.7 }}>
          <ChevronLeft size={44} />
        </button>

        <div style={{ width: "760px", height: "380px", position: "relative" }}>
          {/* 👇 Mapping Dynamic Items Instead of Hardcoded Images 👇 */}
          {displayItems.map((item, index) => (
            <img
              key={item.id}
              src={item.image}
              alt={item.title}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: index === current ? 1 : 0,
                transform:
                  index === current
                    ? "scale(1) rotate(0deg)"
                    : "scale(1.1) rotate(-2deg)",
                transition: "all 0.8s ease",
              }}
            />
          ))}
        </div>

        <button onClick={next} style={{ background: "none", border: "none", color: "white", cursor: "pointer", opacity: 0.7 }}>
          <ChevronRight size={44} />
        </button>
      </div>

      {/* Dynamic Text Reveal */}
      <div className="text-reveal" style={{ textAlign: "center", marginTop: 40 }}>
        <h2 style={{ fontSize: 48, textTransform: "uppercase" }}>{displayItems[current]?.title}</h2>
        <p style={{ color: "#888", textTransform: "uppercase", letterSpacing: "2px" }}>{displayItems[current]?.subtitle}</p>
      </div>

      {/* Button with Dynamic Navigation */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 40 }}>
        <button
          onClick={() => navigate(displayItems[current]?.url)} // 👈 Redirect to Specific Product
          onMouseEnter={() => setHoveredBtn(true)}
          onMouseLeave={() => setHoveredBtn(false)}
          style={{
            border: `1px solid ${accentColor}`,
            color: hoveredBtn ? "#000" : accentColor,
            background: hoveredBtn ? accentColor : "transparent",
            padding: "12px 30px",
            transition: "all 0.5s",
            cursor: "pointer",
            transform: hoveredBtn
              ? "translateY(-5px) scale(1.05)"
              : "translateY(0) scale(1)",
          }}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}