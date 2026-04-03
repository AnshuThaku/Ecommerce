import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const ImageSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const slidesMain = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800",
      tagline: "SPRING SALE"
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
      tagline: "SUMMER SALE"
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?q=80&w=800",
      tagline: "AUTUMN SALE"
    },
  ];

  const slidesSide = [
    { id: 1, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
    { id: 2, img: "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?q=80&w=800" },
    { id: 3, img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800" },
  ];

  return (
    <div className="w-full relative flex flex-col xl:flex-row items-stretch gap-[20px] m-0 p-0 pr-0">

      {/* 1. Main Image Box */}   
      <div className="relative w-full xl:w-[calc(60%-40px)] flex-[0_0_100%] xl:flex-[0_0_calc(60%-40px)] flex items-end">
        {/* LEFT / RIGHT BUTTONS NOW OUTSIDE MAIN IMAGE - BOTTOM LEFT */}
        <div className="flex flex-row gap-3 z-50 mr-[5px] mb-[5px] absolute bottom-full left-0 xl:relative xl:bottom-auto xl:left-auto pb-4 xl:pb-0">
          <button 
            onClick={() => swiperInstance?.slidePrev()}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 hover:bg-black hover:text-white transition-all text-black text-[20px] font-light cursor-pointer shadow-sm bg-transparent"
          >
            ‹
          </button>
          <button 
            onClick={() => swiperInstance?.slideNext()}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 hover:bg-black hover:text-white transition-all text-black text-[20px] font-light cursor-pointer shadow-sm bg-transparent"
          >
            ›
          </button>
        </div>

        <div className="relative overflow-hidden bg-[#f0f0f0] w-full h-[300px] sm:h-[350px] md:h-[400px] xl:h-[500px] rounded-[2px] transition-all duration-500 z-10 group">
          <Swiper
            modules={[Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={600}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            loop={true}
            allowTouchMove={false}
            className="w-full h-full !overflow-hidden"       
          >
            {slidesMain.map((slide) => (
              <SwiperSlide key={`main-${slide.id}`}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.img}
                    className="w-full h-full object-cover"
                    alt={`Deal ${slide.id}`}
                  />
                  <div className="absolute bottom-0 right-0 bg-white py-6 px-8 shadow-xl min-w-[220px] md:min-w-[260px] z-50 -translate-x-4 -translate-y-4">
                    <p className="text-[11px] md:text-[13px] text-gray-500 tracking-[0.1em] mb-2 flex items-center gap-3">
                      <span className="font-semibold text-black">0{slide.id}</span>
                      <span className="w-6 md:w-8 h-[1px] bg-gray-400 block"></span>
                      <span className="capitalize font-medium">{slide.tagline}</span>
                    </p>
                    <h3 className="text-2xl md:text-[32px] font-[500] text-[#111] font-sans">30% OFF</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* 2. Right Image Box */}  
      <div className="relative flex flex-col justify-between w-full xl:w-[calc(40%-20px)] flex-[0_0_100%] xl:flex-[0_0_calc(40%-20px)] h-[300px] sm:h-[350px] md:h-[400px] xl:h-[500px] z-0 mr-1 mt-6 xl:mt-0">
        <div className="relative overflow-hidden bg-[#222] w-full h-full scale-y-[1.0] rounded-[2px] shadow-lg">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={800}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
            allowTouchMove={false}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}        
            className="w-full h-full !overflow-hidden"
          >
            {slidesSide.map((slide) => (
              <SwiperSlide key={`side-${slide.id}`}>
                 <img
                  src={slide.img}
                  className="w-full h-full object-cover opacity-95"
                  alt="Upcoming Deal"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

         {/* Pagination Dots */}
        <div className="absolute -bottom-8 xl:relative xl:bottom-auto flex gap-3 items-center mt-0 xl:mt-6 ml-0">
          {slidesMain.map((_, index) => (
            <span
              key={index}
              className={`transition-all duration-500 rounded-full relative flex items-center justify-center ${
                activeIndex === index ? 'w-2.5 h-2.5 bg-black' : 'w-2 h-2 bg-[#ccc]'
              }`}
            >
              {activeIndex === index && (
                <span className="absolute -inset-[4px] border-[1.5px] border-black rounded-full" />
              )}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ImageSlider;