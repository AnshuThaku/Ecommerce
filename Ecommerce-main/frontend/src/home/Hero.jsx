import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/preview(1).png",
  "/canvass.png",
  "/canvas.png",
];

export default function Hero({ accentColor = "#d3b574", bg = "#121212" }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const goTo = useCallback((index) => {
    if (animating) return;
    setAnimating(true);

    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 600);
  }, [animating]);

  const prev = () => {
    const nextIndex = current === 0 ? images.length - 1 : current - 1;
    goTo(nextIndex);
  };

  const next = useCallback(() => {
    const nextIndex = current === images.length - 1 ? 0 : current + 1;
    goTo(nextIndex);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(timer);
  }, [next]);

  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        background: bg,
        transition: "background 0.7s",
        color: "white",
        paddingBottom: 40,
        // marginBottom hata diya hai
        minHeight: "80vh", // 100vh ki jagah 80vh kar diya taaki thoda chota ho
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
        <button onClick={prev}>
          <ChevronLeft size={44} />
        </button>

        <div style={{ width: "760px", height: "380px", position: "relative" }}>
          {images.map((imgSrc, index) => (
            <img
              key={index}
              src={imgSrc}
              alt=""
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

        <button onClick={next}>
          <ChevronRight size={44} />
        </button>
      </div>

      {/* Text */}
      <div className="text-reveal" style={{ textAlign: "center", marginTop: 40 }}>
        <h2 style={{ fontSize: 48 }}>HOME LINE III</h2>
        <p style={{ color: "#888" }}>Bring the big stage home</p>
      </div>

      {/* Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 40 }}>
        <button
          onMouseEnter={() => setHoveredBtn(true)}
          onMouseLeave={() => setHoveredBtn(false)}
          style={{
            border: `1px solid ${accentColor}`,
            color: hoveredBtn ? "#000" : accentColor,
            background: hoveredBtn ? accentColor : "transparent",
            padding: "12px 30px",
            transition: "all 0.5s",
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