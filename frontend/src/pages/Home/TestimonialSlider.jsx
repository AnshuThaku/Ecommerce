import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Photographer",
    quote: "I was looking for exactly this. Thank you for making it so intuitive and beautifully designed. Highly recommended!",
    rating: 5,
    image: "download (20).webp"
  },
  {
    id: 2,
    name: "Rohan Desai",
    role: "Traveler",
    quote: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    rating: 5,
    image: "OIP (60).webp"
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Designer",
    quote: "This has completely transformed my workflow. The attention to detail and user experience is simply unmatched.",
    rating: 5,
    image: "OIP (61).webp"
  },
  {
    id: 4,
    name: "Maksudhan Kumar",
    role: "Developer",
    quote: "Exceptional quality and support. It seamlessly integrated into our existing system without any hassle.",
    rating: 5,
    image: "OIP (64).webp"
  },
  {
    id: 5,
    name: "Jagdish Prasad",
    role: "Marketing Manager",
    quote: "A game changer for our team. The analytics and reporting features alone saved us hours every single week.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jagdish&backgroundColor=F2F2F2"
  },
  {
    id: 6,
    name: "Vikram Gupta",
    role: "Product Manager",
    quote: "This product exceeded my expectations in every way. The level of detail and craft is just superb.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram&backgroundColor=F2F2F2"
  },
  {
    id: 7,
    name: "Sanya Arora",
    role: "Architect",
    quote: "The intuitive nature of the design made it an absolute pleasure to use. The transition was flawless.",
    rating: 5,
    image: "OIP (62).webp"
  },
  {
    id: 8,
    name: "Arun Singh",
    role: "Consultant",
    quote: "We were looking for something exactly like this to streamline our processes.",
    rating: 5,
    image: "OIP (63).webp"
  }
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getCardClassName = (index) => {
    const length = testimonials.length;
    const isCenter = index === activeIndex;
    const isLeft = index === (activeIndex - 1 + length) % length;
    const isRight = index === (activeIndex + 1) % length;

    // Mobile layout fixes: 'w-[92%]' for better fit, 'h-fit' to wrap content
    let baseClass = "absolute transition-all duration-500 ease-in-out w-[92%] md:w-[650px] bg-[#f2f2f2] shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-center rounded-sm h-fit top-0";

    if (isCenter) {
      return baseClass + " translate-x-0 scale-100 opacity-100 z-20 pointer-events-auto relative";
    } else if (isLeft) {
      return baseClass + " -translate-x-[15%] md:-translate-x-[70%] scale-90 md:scale-75 opacity-0 md:opacity-40 z-10 pointer-events-none";
    } else if (isRight) {
      return baseClass + " translate-x-[15%] md:translate-x-[70%] scale-90 md:scale-75 opacity-0 md:opacity-40 z-10 pointer-events-none";
    } else {
      return baseClass + " opacity-0 scale-50 z-0 pointer-events-none";
    }
  };

  return (
    <div className="bg-[#e5e5e5] flex flex-col items-center justify-start py-6 md:py-16 overflow-hidden">
      
      {/* Header Section - Margin further reduced for mobile */}
      <div className="text-center mb-6 md:mb-12 px-6">
        <h2 className="text-2xl md:text-5xl font-serif text-gray-800 mb-2 tracking-tight">
          This Is What Our Customers Say
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-xs md:text-base">
          Real stories from people who use our platform every day.
        </p>
      </div>

      {/* Carousel Container - Height is now dynamic based on content */}
      <div className="relative w-full max-w-7xl flex flex-col items-center px-4">
        <div className="relative w-full flex justify-center min-h-[400px] md:min-h-[280px]">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className={getCardClassName(index)}>
              
              {/* Image Section */}
              <div className="relative w-28 h-28 md:w-56 md:h-48 shrink-0">
                <div className="absolute top-2 -left-2 md:top-4 md:-left-6 w-full h-full bg-[#d4d4d4] -z-10"></div>
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-full h-full object-cover shadow-md bg-white"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-center text-center md:text-left flex-1">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex gap-1 mb-4 md:mb-6 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 md:w-5 md:h-5 ${i < testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>

                <div>
                  <h4 className="text-lg md:text-2xl font-serif text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-widest mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Margin adjusted for mobile */}
      <div className="flex gap-6 mt-4 md:mt-10 z-30 relative">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:border-black transition-all"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:border-black transition-all"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

    </div>
  );
}