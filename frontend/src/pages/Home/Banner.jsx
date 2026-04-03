

import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useServerTheme } from "../../hooks/useServerTheme";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Banner = ({ products = [] }) => {
  useServerTheme();
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full relative group transition-all duration-500 overflow-hidden" 
         style={{ background: "var(--theme-gradient, #000)" }}>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full h-[450px] md:h-[400px] lg:h-[450px]" 
      >
        {products.map((item) => {
          const desktopImg = item.variants?.[0]?.images?.[0]?.url || item.images?.[0]?.url;
          const mobileImg = item.variants?.[0]?.images?.[1]?.url || desktopImg;

          return (
            <SwiperSlide key={item._id}>
              <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-24 overflow-hidden pt-2 md:pt-0">
                
                {/* 1. IMAGE SECTION */}
                <div className="w-full md:w-[45%] h-[50%] md:h-full flex items-center justify-center">
                  <picture className="w-full h-full flex items-center justify-center">
                    <source media="(max-width: 768px)" srcSet={mobileImg} />
                    <img 
                      src={desktopImg} 
                      alt={item.name}
                      className="max-w-full max-h-full object-contain transform scale-75 md:scale-95 drop-shadow-2xl"
                    />
                  </picture>
                </div>

                {/* 2. TEXT SECTION */}
                <div className="w-full md:w-[50%] h-auto md:h-full flex flex-col justify-center items-center md:items-end text-center md:text-right pb-10 md:pb-0 z-10 gap-2 md:gap-4 mt-2 md:mt-0">
                  <h3 
                    className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase opacity-80"
                    style={{ color: "var(--theme-text-light, #fff)" }}
                  >
                    {item.brand}
                  </h3>
                  
                  <h2 
                    className="text-2xl md:text-3xl lg:text-4xl font-serif uppercase mb-6 leading-tight"
                    style={{ color: "var(--theme-text-light, #fff)" }}
                  >
                    {item.name}
                  </h2>

                  {/* PREMIUM BUTTON: Border-based with elegant hover */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/shop', { state: { category: item.category, search: item.brand || item.name } }); }}
                    className="px-8 py-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 border bg-transparent hover:!bg-white hover:!text-black hover:border-transparent cursor-pointer"
                    style={{ 
                      color: "var(--theme-text-light, #fff)",
                      borderColor: "var(--theme-text-light, #fff)"
                    }}
                  >
                    Explore +
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Minimalist Arrows: No Background */
        .swiper-button-next, .swiper-button-prev {
          background: transparent !important;
          color: white !important;
          opacity: 0 !important;
          transition: all 0.4s ease;
          transform: scale(0.8); /* Arrow size chhota kiya */
        }
        
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
          opacity: 0.7 !important;
        }

        .swiper-button-next:hover, .swiper-button-prev:hover {
          opacity: 1 !important;
        }

        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 24px !important; /* Arrow ki thickness/size */
          font-weight: bold;
        }

        /* Modern Pagination Bullets */
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          background: white !important; 
          opacity: 1;
          width: 24px !important;
          border-radius: 2px !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 16px !important;
          }
          .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
            opacity: 1 !important;
          }
        }
      `}} />
    </div>
  );
};

export default Banner;