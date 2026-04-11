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
      img: "https://images.unsplash.com/photo-1692651763027-72aeb12130d7?w=600&auto=format&fit=crop&q=60",
      tagline: "MARSHALL SIGNATURE"
    },
    {
      id: 2,
      img: "https://images.pexels.com/photos/31306016/pexels-photo-31306016.jpeg",
      tagline: "Marshall Stanmore II"
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1692351014024-97edd83a7b5a?w=600&auto=format&fit=crop&q=60",
      tagline: "PREMIUM SOUND"
    },
  ];

  const slidesSide = [
    { 
      id: 1, 
      img: "https://images.unsplash.com/photo-1639385054611-53f34c9297d4?w=600&auto=format&fit=crop&q=60" 
    },
    { 
      id: 2, 
      img: "https://images.unsplash.com/photo-1502798985865-1ab60332f46c?w=600&auto=format&fit=crop&q=60" 
    },
    { 
      id: 3, 
      img: "https://images.unsplash.com/photo-1707364917582-6ad0f98379df?w=600&auto=format&fit=crop&q=60" 
    },
  ];

  return (
    // md:gap-[30px] desktop ke liye, gap-12 mobile par space dene ke liye
    <div className="w-full relative flex flex-col md:flex-row gap-12 md:gap-[30px] m-0 p-0 md:px-6 xl:px-12 py-10">

      {/* 1. Main Image Box */}
      <div className="relative w-full md:w-[58%] shrink-0 flex-none h-[400px] md:h-[550px] xl:h-[600px]">
        <div className="relative overflow-hidden w-full h-full bg-[#f9f9f9]">
          <Swiper
            modules={[Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={600}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            loop={true}
            allowTouchMove={false}
            className="w-full h-full"
          >
            {slidesMain.map((slide) => (
              <SwiperSlide key={`main-${slide.id}`}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.img}
                    className="w-full h-full object-cover object-center"
                    alt={`Deal ${slide.id}`}
                  />
                  
                  {/* Info Card */}
                  <div className="absolute bottom-4 left-4 md:bottom-2 md:left-1 bg-white py-5 px-6 md:py-6 md:px-8 shadow-lg min-w-[220px] md:min-w-[260px] z-[60]">
                    <p className="text-[12px] text-gray-400 tracking-[0.05em] mb-1 flex items-center gap-2">
                      <span className="font-semibold text-black">0{slide.id}</span>
                      <span className="w-6 h-[1px] bg-gray-300 block"></span>
                      <span className="font-medium capitalize">{slide.tagline}</span>
                    </p>
                    <h3 className="text-xl md:text-2xl font-[500] text-[#111] font-sans mt-2">30% OFF</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* NAVIGATION ARROWS: Mobile par dono images ke center space mein */}

        <div className="relative md:absolute flex justify-center md:justify-start items-center gap-4 w-full md:w-auto mt-6 md:mt-0 md:-bottom-10 md:left-0 z-[70]">
         <button 
  onClick={() => swiperInstance?.slidePrev()}
  className="text-black hover:bg-black hover:text-white transition-all bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center text-[18px] shadow-sm cursor-pointer"
>
  ‹
</button>

<button 
  onClick={() => swiperInstance?.slideNext()}
  className="text-black hover:bg-black hover:text-white transition-all bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center text-[18px] shadow-sm cursor-pointer"
>
  ›
</button>
        </div>
      </div>

      {/* 2. Right Image Box */}
      <div className="relative w-full md:w-[42%] shrink-0 flex-none h-[300px] md:h-[400px] xl:h-[500px] flex flex-col justify-start">
        <div className="relative overflow-hidden bg-[#111] w-full h-full rounded-[2px] shadow-md">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={800}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
            allowTouchMove={false}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}        
            className="w-full h-full"
          >
            {slidesSide.map((slide) => (
              <SwiperSlide key={`side-${slide.id}`}>
                 <img
                  src={slide.img}
                  className="w-full h-full object-cover opacity-90"
                  alt="Upcoming Deal"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Pagination Dots (Right Image ke niche) */}
        <div className="flex gap-3 items-center mt-6 justify-center md:justify-start">
          {slidesMain.map((_, index) => (
            <span
              key={index}
              className={`transition-all duration-300 rounded-full relative flex items-center justify-center ${
                activeIndex === index ? 'w-2.5 h-2.5 bg-black' : 'w-2 h-2 bg-gray-300'
              }`}
            >
              {activeIndex === index && (
                <span className="absolute -inset-[3px] border-[1px] border-black rounded-full" />
              )}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ImageSlider;