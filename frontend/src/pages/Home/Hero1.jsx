import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ⚡ THEME UPDATE: Hardcoded defaults replaced with CSS variables
export default function HeroAlternate({ 
  accentColor = "var(--theme-primary)", 
  bg = "var(--theme-bg-dark)" 
}) {
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
    }, 2000);
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
          /* ⚡ THEME UPDATE: Dynamic background */
          background-color: ${bg};
          height: 75vh; 
          width: 100%;  
          position: relative;
          overflow: hidden;
          margin-top: 0px; 
          padding-top: 60px; 
          box-sizing: border-box;
          transition: background-color 0.5s ease;
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

        .slide img {
          max-width: 85%; 
          max-height: 85%; 
          object-fit: contain; 
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
          /* ⚡ THEME UPDATE: Active dot border matches theme color */
          border: 2px solid ${accentColor};
          transform: scale(1.5);
        }

        /* Responsive breakpoints original rahenge */
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