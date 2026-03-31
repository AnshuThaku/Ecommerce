import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useServerTheme } from "../../hooks/useServerTheme";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Banner = ({ products = [] }) => {
  useServerTheme();

  if (!products || products.length === 0) return null;

  return (
    /* overflow-hidden aur max-w-full se white corner aur scroll dono band ho jayenge */
    <div className="w-full relative group transition-all duration-500 overflow-hidden" 
         style={{ background: "var(--theme-gradient, #000)" }}>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        /* Height wapas wahi purani (Desktop pe max 380px) */
        className="w-full h-[250px] md:h-[320px] lg:h-[380px]" 
      >
        {products.map((item) => {
          const desktopImg = item.variants?.[0]?.images?.[0]?.url || item.images?.[0]?.url;
          const mobileImg = item.variants?.[0]?.images?.[1]?.url || desktopImg;

          return (
            <SwiperSlide key={item._id}>
              <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-10 md:px-24 overflow-hidden">
                
                {/* 1. IMAGE SECTION: object-contain rakha hai taaki image kate nahi aur choti dikhe */}
                <div className="w-full md:w-[45%] h-[65%] md:h-full flex items-center justify-center">
                  <picture className="w-full h-full flex items-center justify-center">
                    <source media="(max-width: 768px)" srcSet={mobileImg} />
                    <img 
                      src={desktopImg} 
                      alt={item.name}
                      /* scale-90 se image thodi choti rahegi aur edges nahi bhatengi */
                      className="max-w-full max-h-full object-contain transform scale-90 drop-shadow-2xl"
                    />
                  </picture>
                </div>

                {/* 2. TEXT SECTION */}
                <div className="w-full md:w-[50%] h-[35%] md:h-full flex flex-col justify-center items-start md:items-end text-left md:text-right pb-4 md:pb-0 z-10">
                  <h3 
                    className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-1 drop-shadow-md"
                    style={{ color: "var(--theme-text-light, #fff)" }}
                  >
                    {item.brand}
                  </h3>
                  
                  <h2 
                    className="text-2xl md:text-3xl lg:text-4xl font-serif uppercase mb-5 leading-tight drop-shadow-lg"
                    style={{ color: "var(--theme-text-light, #fff)" }}
                  >
                    {item.name}
                  </h2>

                  <button 
                    className="px-6 py-2 md:px-8 md:py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all border hover:opacity-90"
                    style={{ 
                      backgroundColor: "var(--theme-primary, #3498db)", 
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
        .swiper-button-next, .swiper-button-prev {
          background: white !important;
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          color: black !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
          opacity: 0.3;
          transition: 0.3s;
        }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
          opacity: 1;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 12px !important;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: var(--theme-primary, #fff) !important; 
          opacity: 1;
          width: 20px !important;
          border-radius: 4px !important;
        }
      `}} />
    </div>
  );
};

export default Banner;