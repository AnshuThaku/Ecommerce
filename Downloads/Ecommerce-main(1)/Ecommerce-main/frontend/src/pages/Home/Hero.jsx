import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero({ accentColor = "#d3b574", bg = "#121212", featuredProducts = [] }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const navigate = useNavigate();

  // 👇 Agar admin ne koi product select nahi kiya, toh default images rakhenge
  const defaultImages = ["/preview(1).png", "/canvass.png"];
  
  // Admin products se images nikalna
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : [];

  const goTo = useCallback((index) => {
    if (animating || displayProducts.length === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 600);
  }, [animating, displayProducts.length]);

  const next = useCallback(() => {
    if (displayProducts.length === 0) return;
    const nextIndex = current === displayProducts.length - 1 ? 0 : current + 1;
    goTo(nextIndex);
  }, [current, goTo, displayProducts.length]);

  const prev = () => {
    if (displayProducts.length === 0) return;
    const nextIndex = current === 0 ? displayProducts.length - 1 : current - 1;
    goTo(nextIndex);
  };

  useEffect(() => {
    if (displayProducts.length > 1) {
      const timer = setInterval(() => next(), 5000);
      return () => clearInterval(timer);
    }
  }, [next, displayProducts.length]);

  // SEO URL Generator for Hero Button
  const createProductUrl = (p) => {
    const cat = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'luxury';
    const brand = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'exclusive';
    const name = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product';
    return `/${cat}/${brand}/${name}/p/${p._id}`;
  };

  // Helper to get image safely
  const getProductImg = (p) => {
    return p.images?.[0]?.url || p.variants?.[0]?.images?.[0]?.url || "/preview(1).png";
  };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: bg, minHeight: "80vh", overflow: "hidden", position: "relative", color: "white" }}>
      <div className="glow-effect" />

      {/* Hero Content Section */}
      <div className="relative z-10 flex flex-col items-center pt-16">
        
        {/* Dynamic Image Slider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <button onClick={prev} className="p-4 opacity-30 hover:opacity-100 transition-opacity">
            <ChevronLeft size={44} />
          </button>

          <div style={{ width: "800px", height: "450px", position: "relative" }}>
            {displayProducts.length > 0 ? (
              displayProducts.map((product, index) => (
                <img
                  key={product._id}
                  src={getProductImg(product)}
                  alt={product.name}
                  style={{
                    position: "absolute",
                    width: "100%", height: "100%", objectFit: "contain",
                    opacity: index === current ? 1 : 0,
                    transform: index === current ? "scale(1)" : "scale(1.1)",
                    transition: "all 0.8s ease",
                  }}
                />
              ))
            ) : (
              <img src="/preview(1).png" alt="Default" className="w-full h-full object-contain" />
            )}
          </div>

          <button onClick={next} className="p-4 opacity-30 hover:opacity-100 transition-opacity">
            <ChevronRight size={44} />
          </button>
        </div>

        {/* Dynamic Text Section */}
        {displayProducts[current] && (
          <div className="text-reveal text-center mt-10">
            <p className="text-[#d3b574] tracking-[0.4em] uppercase text-[10px] mb-2 font-bold">
              {displayProducts[current].brand || "Featured Selection"}
            </p>
            <h2 className="text-4xl md:text-6xl font-serif italic mb-4">
              {displayProducts[current].name}
            </h2>
            
            <button
              onClick={() => navigate(createProductUrl(displayProducts[current]))}
              onMouseEnter={() => setHoveredBtn(true)}
              onMouseLeave={() => setHoveredBtn(false)}
              style={{
                border: `1px solid ${accentColor}`,
                color: hoveredBtn ? "#000" : accentColor,
                background: hoveredBtn ? accentColor : "transparent",
                padding: "12px 40px",
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                transition: "all 0.5s",
                marginTop: "30px"
              }}
            >
              Discover Product
            </button>
          </div>
        )}
      </div>

      <style>{`
        .text-reveal {
          transition: all 0.8s ease;
          transform: translateY(${animating ? "20px" : "0"});
          opacity: ${animating ? "0" : "1"};
        }
        .glow-effect {
          position: absolute; width: 600px; height: 600px;
          background: ${accentColor}; filter: blur(200px);
          opacity: 0.05; border-radius: 50%; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
}