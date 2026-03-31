// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const Banner = ({ products = [] }) => {
//   if (!products || products.length === 0) return null;

//   return (
//     <div className="w-full relative group bg-black">
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]}
//         navigation={true}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 5000 }}
//         loop={true}
//         // HEIGHT KO AUR KAM KIYA HAI (Desktop pe max 380px)
//         className="w-full h-[250px] md:h-[320px] lg:h-[380px]" 
//       >
//         {products.map((item) => {
//           const desktopImg = item.variants?.[0]?.images?.[0]?.url || item.images?.[0]?.url;
//           const mobileImg = item.variants?.[0]?.images?.[1]?.url || desktopImg;

//           return (
//             <SwiperSlide key={item._id}>
//               {/* Flex container banaya hai taaki image aur text side-by-side aa saken */}
//               <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-10 md:px-24">
                
//                 {/* 1. IMAGE SECTION (Left on Desktop) */}
//                 <div className="w-full md:w-[45%] h-[60%] md:h-full flex items-center justify-center pt-4 md:pt-0">
//                   <picture>
//                     <source media="(max-width: 768px)" srcSet={mobileImg} />
//                     <img 
//                       src={desktopImg} 
//                       alt={item.name}
//                       // 👇 MAGIC HERE: 'object-contain' poori image dikhayega bina crop kiye 👇
//                       className="max-w-full max-h-full object-contain"
//                     />
//                   </picture>
//                 </div>

//                 {/* 2. TEXT SECTION (Right on Desktop) */}
//                 <div className="w-full md:w-[50%] h-[40%] md:h-full flex flex-col justify-center items-start md:items-end text-white text-left md:text-right pb-4 md:pb-0">
//                   <h3 className="text-[#d3b574] text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-1 drop-shadow-md">
//                     {item.brand}
//                   </h3>
//                   <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif uppercase mb-5 leading-tight drop-shadow-lg">
//                     {item.name}
//                   </h2>
//                   <button className="bg-white text-black px-6 py-2 md:px-8 md:py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-white">
//                     Explore +
//                   </button>
//                 </div>
//               </div>
//             </SwiperSlide>
//           );
//         })}
//       </Swiper>

//       {/* Swiper Custom CSS for Nykaa look and smaller arrows */}
//       <style dangerouslySetInnerHTML={{ __html: `
//         .swiper-button-next, .swiper-button-prev {
//           background: white !important;
//           width: 32px !important;
//           height: 32px !important;
//           border-radius: 50% !important;
//           color: black !important;
//           box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
//           opacity: 0.5;
//         }
//         .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
//           opacity: 1;
//         }
//         .swiper-button-next:after, .swiper-button-prev:after {
//           font-size: 12px !important;
//         }
//         .swiper-pagination-bullet {
//           background: white !important;
//           opacity: 0.5;
//         }
//         .swiper-pagination-bullet-active {
//           background: white !important;
//           opacity: 1;
//           width: 15px !important;
//           border-radius: 4px !important;
//         }
//       `}} />
//     </div>
//   );
// };

// export default Banner;