import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Swiper styles
import 'swiper/css';

const testimonials = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Traveler",
    text: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    image: "https://i.pravatar.cc/150?u=11"
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Traveler",
    text: "The quality is top-notch. Finding a reliable service was hard until I found this. Great experience!",
    image: "https://i.pravatar.cc/150?u=12"
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    role: "Explorer",
    text: "Amazing support and design. Exactly what I was looking for. Highly recommended to everyone.",
    image: "https://i.pravatar.cc/150?u=13"
  }
];

const TestimonialSlider = () => {
  return (
    <section className="bg-[#f8f9fa] py-16 px-4">
      {/* Container wide enough to fit two cards side-by-side */}
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">This Is What Our Customers Say</h2>
          <p className="text-gray-400 text-xs tracking-[2px] uppercase">Testimonials</p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30} 
            slidesPerView={1} 
            loop={true}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            breakpoints={{
              // Desktop pe exactly 2 full cards dikhenge
              1024: { 
                slidesPerView: 2,
                centeredSlides: false 
              },
            }}
            className="pb-12"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id} className="py-4">
                {/* Card Width exactly as your previous code (max-w-lg) */}
                <div className="bg-white p-8 flex flex-col md:flex-row items-center gap-6 rounded-md shadow-[0_20px_40px_rgba(0,0,0,0.06),_0_0_20px_rgba(255,255,255,1)] border border-gray-50 mx-auto max-w-lg h-full">
                  
                  {/* Image Section */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -top-1.5 -left-1.5 w-full h-full bg-gray-200 -z-10"></div>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-28 h-36 object-cover relative z-10 shadow-sm"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="text-left flex-1">
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 italic">
                      "{item.text}"
                    </p>
                    <div className="text-yellow-400 text-sm mb-2">★★★★★</div>
                    <div className="w-12 h-[1px] bg-gray-200 mb-4"></div>
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h4>
                    <p className="text-gray-400 text-[10px] tracking-widest uppercase">{item.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Bottom Center Arrows */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <button className="custom-prev w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm cursor-pointer">
              <span className="text-lg">‹</span>
            </button>
            <button className="custom-next w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm cursor-pointer">
              <span className="text-lg">›</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;