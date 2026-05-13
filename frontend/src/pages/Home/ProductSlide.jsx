// import React, { useRef, useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// // 🔥 BHAII YAHAN DHYAN DO 🔥
// // Apne VS Code mein is niche wali line se "//" HATA DENA (Uncomment kar dena) tabhi API chalegi!
// import axiosInstance from '../../utils/axiosInstance';

// export default function ProductSlide() {
//   const sliderRef = useRef(null);
//   const navigate = useNavigate();
  
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDynamicCategories = async () => {
//       try {
//         setLoading(true);
//         let responseData;

//         // 👉 Agar aapne upar axiosInstance ko uncomment kiya hai, toh yeh if block chalega
//         if (typeof axiosInstance !== 'undefined') {
//           const { data } = await axiosInstance.get('/products');
//           responseData = data;
//         } else {
//           // Yeh sirf Canvas preview ko crash hone se bachane ke liye fallback hai
//           const response = await fetch('/products');
//           responseData = await response.json().catch(() => ({}));
//         }
        
//         if (responseData?.success && responseData.products) {
//           const uniqueCategories = new Map(); 
          
//           responseData.products.forEach(product => {
//             if (product.isActive && product.category && !uniqueCategories.has(product.category)) {
//               let imgUrl = "https://placehold.co/200x200/ffffff/d3b574?text=" + encodeURIComponent(product.category);

//               if (product.variants?.[0]?.images?.[0]?.url) {
//                 imgUrl = product.variants[0].images[0].url;
//               } else if (product.images?.[0]?.url) {
//                 imgUrl = product.images[0].url;
//               }

//               uniqueCategories.set(product.category, {
//                 id: product.category, 
//                 name: product.category,
//                 image: imgUrl
//               });
//             }
//           });

//           setCategories(Array.from(uniqueCategories.values()));
//         } else {
//           // ❌ Agar uncomment nahi kiya hai, toh ek dummy card dikhayega yaad dilane ke liye
//           setCategories([
//             { 
//               id: 'dummy-1', 
//               name: '⚠️ Uncomment axiosInstance line!', 
//               image: 'https://placehold.co/200x200/ffffff/d3b574?text=Uncomment+Axios' 
//             }
//           ]);
//         }
//       } catch (error) {
//         console.error("Categories fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDynamicCategories();
//   }, []);

//   const slideLeft = () => {
//     sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
//   };

//   const slideRight = () => {
//     sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
//   };

//   const handleCategoryClick = (categoryName) => {
//     if(categoryName.includes('Uncomment')) return; // Dummy card pe click disable kiya hai
//     navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
//   };

//   return (
//     <div className="bg-white py-12 w-full border-y border-gray-100">
      
//       {/* HEADING (Center Aligned) */}
//      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex flex-col items-center">
  
//   {/* TOP LINE + TEXT */}
//   <div className="flex items-center gap-3 mb-2">
//     {/* ⚡ UPDATE: Line color changed to dynamic theme color */}
//     <span className="w-10 h-[1px] bg-[var(--theme-primary)]"></span>
//     {/* ⚡ UPDATE: text-magic-primary changed to text-[var(--theme-primary)] */}
//     <p className="text-[10px] tracking-[0.3em] text-[var(--theme-primary)] uppercase font-semibold">
//       Shop By Category
//     </p>
//     {/* ⚡ UPDATE: Line color changed to dynamic theme color */}
//     <span className="w-10 h-[1px] bg-[var(--theme-primary)]"></span>
//   </div>

//   {/* MAIN HEADING */}
//   <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center">
//     {/* ⚡ UPDATE: text-magic-primary changed to text-[var(--theme-primary)] */}
//     Shop By <span className="text-[var(--theme-primary)]">Category</span>
//   </h2>

// </div>

//       {/* SLIDER */}
//       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative group">

//         {/* LEFT ARROW */}
//         <button 
//           onClick={slideLeft}
//           // ⚡ UPDATE: hover:bg-[#d3b574] changed to hover:bg-[var(--theme-primary)]
//           className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-[-20%] z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-[var(--theme-primary)] hover:text-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] hidden md:flex"
//         >
//           <ChevronLeft className="w-5 h-5 rotate-[-15deg]" />
//         </button>

//         {/* CARDS */}
//         <div 
//           ref={sliderRef}
//           className="flex overflow-x-auto gap-4 px-6 pt-2 pb-6 snap-x hide-scrollbar"
//         >
//           {loading ? (
//             [1,2,3,4,5].map(i => (
//               <div key={i} className="flex-shrink-0 w-[160px] md:w-[180px] h-[160px] bg-white shadow-[0_16px_32px_-4px_rgba(0,0,0,0.2)] rounded-2xl animate-pulse"></div>
//             ))
//           ) : (
//             categories.map((item) => (
//               <div 
//                 key={item.id}
//                 onClick={() => handleCategoryClick(item.name)}
//                 className="flex-shrink-0 snap-start w-[160px] md:w-[180px] bg-white rounded-2xl shadow-[0_16px_32px_-4px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center p-5 cursor-pointer transition-transform duration-300 hover:-translate-y-2"
//               >
                
//                 {/* IMAGE (NO BACKGROUND) */}
//                 <div className="w-[85px] h-[85px] flex items-center justify-center mb-4">
//                   <img 
//                     src={item.image}
//                     alt={item.name}
//                     className="max-w-full max-h-full object-contain"
//                   />
//                 </div>

//                 {/* TEXT */}
//                 <h3 className={`text-sm font-semibold text-center leading-tight ${item.name.includes('Uncomment') ? 'text-red-500' : 'text-gray-800'}`}>
//                   {item.name}
//                 </h3>

//               </div>
//             ))
//           )}
//         </div>

//         {/* RIGHT ARROW */}
//         <button 
//           onClick={slideRight}
//           // ⚡ UPDATE: hover:bg-[#d3b574] changed to hover:bg-[var(--theme-primary)]
//           className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20%] z-30 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-[var(--theme-primary)] hover:text-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] hidden md:flex"
//         >
//           <ChevronRight className="w-5 h-5 rotate-[15deg]" />
//         </button>

//       </div>

//       {/* HIDE SCROLLBAR */}
//       <style>
//         {`
//           .hide-scrollbar::-webkit-scrollbar { display: none; }
//           .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         `}
//       </style>

//     </div>
//   );
// }

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🔥 BHAII YAHAN DHYAN DO 🔥
import axiosInstance from '../../utils/axiosInstance';

export default function ProductSlide() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicCategories = async () => {
      try {
        setLoading(true);
        let responseData;

        if (typeof axiosInstance !== 'undefined') {
          const { data } = await axiosInstance.get('/products');
          responseData = data;
        } else {
          const { data } = await axiosInstance.get('/products');
          responseData = data || {};
        }
        
        if (responseData?.success && responseData.products) {
          const uniqueCategories = new Map(); 
          
          responseData.products.forEach(product => {
            if (product.isActive && product.category && !uniqueCategories.has(product.category)) {
              let imgUrl = "https://placehold.co/200x200/ffffff/d3b574?text=" + encodeURIComponent(product.category);

              if (product.variants?.[0]?.images?.[0]?.url) {
                imgUrl = product.variants[0].images[0].url;
              } else if (product.images?.[0]?.url) {
                imgUrl = product.images[0].url;
              }

              uniqueCategories.set(product.category, {
                id: product.category, 
                name: product.category,
                image: imgUrl
              });
            }
          });

          setCategories(Array.from(uniqueCategories.values()));
        } else {
          setCategories([
            { 
              id: 'dummy-1', 
              name: '⚠️ Uncomment axiosInstance line!', 
              image: 'https://placehold.co/200x200/ffffff/d3b574?text=Uncomment+Axios' 
            }
          ]);
        }
      } catch (error) {
        console.error("Categories fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicCategories();
  }, []);

  const slideLeft = () => {
    sliderRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryName) => {
    if(categoryName.includes('Uncomment')) return;
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="bg-white pt-2 w-full border-t border-gray-50">
      
      {/* HEADING SECTION */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-[1.5px] bg-[var(--theme-primary)] opacity-60"></span>
          <p className="text-[11px] tracking-[0.4em] text-[var(--theme-primary)] uppercase font-bold">
            Shop By Category
          </p>
          <span className="w-10 h-[1.5px] bg-[var(--theme-primary)] opacity-60"></span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-black text-center tracking-tight">
          Shop By <span className="text-[var(--theme-primary)]">Category</span>
        </h2>
      </div>

      {/* SLIDER SECTION */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative group">

        {/* LEFT ARROW */}
        <button 
          onClick={slideLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--theme-primary)] hover:text-white shadow-xl border border-gray-100 hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* CARDS CONTAINER - (Padding fixed here to remove the grey line) */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 px-6 py-6 snap-x hide-scrollbar scroll-smooth"
        >
          {loading ? (
            [1,2,3,4,5,6].map(i => (
              <div key={i} className="flex-shrink-0 w-[180px] md:w-[220px] h-[220px] bg-gray-50 rounded-3xl animate-pulse"></div>
            ))
          ) : (
            categories.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleCategoryClick(item.name)}
                className="flex-shrink-0 snap-start w-[170px] md:w-[210px] bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-500 hover:-translate-y-4 border border-gray-50 group/card"
              >
                
                {/* IMAGE WRAPPER */}
                <div className="w-[100px] h-[100px] flex items-center justify-center mb-6 transition-transform duration-500 group-hover/card:scale-110">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain drop-shadow-md"
                  />
                </div>

                {/* CATEGORY NAME */}
                <h3 className={`text-sm md:text-base font-bold text-center tracking-wide transition-colors duration-300 ${item.name.includes('Uncomment') ? 'text-red-500' : 'text-gray-900 group-hover/card:text-[var(--theme-primary)]'}`}>
                  {item.name}
                </h3>

              </div>
            ))
          )}
        </div>

        {/* RIGHT ARROW */}
        <button 
          onClick={slideRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--theme-primary)] hover:text-white shadow-xl border border-gray-100 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* CUSTOM STYLE FOR CLEAN LOOK */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

    </div>
  );
}