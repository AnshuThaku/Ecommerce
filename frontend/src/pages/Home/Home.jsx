// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../utils/axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import Header from './Header';
// import Hero1  from './Hero1';
// import { useServerTheme } from "../../hooks/useServerTheme"; // Ek aur '../' add kiya hai
// import Hero2  from './Hero2';
// import Banner  from './Banner';
// import ProductSlide  from './ProductSlide';
// import ProductGrid   from '../Product/ProductGrid';
// import Footer from './Footer';
// import Cursor from './Cursor';
// import SaleCategories from '../../components/SaleCategories';
// import BrandsSection from '../../components/Brands';
// import Newsletter2 from '../../components/Newsletter2';

// export default function Home() {
//   const { user } = useAuth();
//   const [homeData, setHomeData] = useState({ 
//     flashDeals: [], trending: [], recommended: [], recentlyViewed: [], featured: [], newArrivals: []
//   });
//   const [loading, setLoading] = useState(true);

//   const fetchHomeData = async () => {
//     try {
//       setLoading(true);
//       let guestId = localStorage.getItem('guestId') || ('guest_' + Math.random().toString(36).substr(2, 9) + Date.now());
//       localStorage.setItem('guestId', guestId);
//       const { data } = await axiosInstance.get(`/home?t=${Date.now()}`, {
//         headers: { 'x-guest-id': guestId, 'Cache-Control': 'no-cache' }
//       });
//       if (data.success) setHomeData(data.data);
//     } catch (error) { console.error("Home API Error:", error); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchHomeData(); window.scrollTo(0, 0); }, [user]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-theme-bg-light flex flex-col items-center justify-center transition-colors duration-500">
//         <div className="w-12 h-12 border-2 border-theme-primary border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-theme-primary font-serif tracking-[0.3em] uppercase text-[10px]">Unveiling Luxury</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-theme-bg-light min-h-screen selection:bg-theme-primary selection:text-theme-text-light transition-colors duration-500">
//       <Cursor />
//       <Header />
//       <Hero2 accentColor="var(--theme-primary)" bg="var(--theme-bg-light)" featuredProducts={homeData.featured} />
// +      <ProductSlide />
//       <Banner products={homeData.featured} />

//       {homeData.flashDeals?.length > 0 && <ProductGrid title="Lightning" subtitle="Deals" products={homeData.flashDeals} />}
//       {homeData.recentlyViewed?.length > 0 && <ProductGrid title="Recently" subtitle="Viewed" products={homeData.recentlyViewed} />}
//       {homeData.recommended?.length > 0 && <ProductGrid title="Personalized" subtitle="For You" products={homeData.recommended} />}
//       {homeData.trending?.length > 0 && <ProductGrid title="Trending" subtitle="Now" products={homeData.trending} />}
//       {homeData.newArrivals?.length > 0 && <ProductGrid title="New" subtitle="Arrivals" products={homeData.newArrivals} />}
//       <SaleCategories/><BrandsSection /><Newsletter2/><Footer />
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Hero1  from './Hero1';
import { useServerTheme } from "../../hooks/useServerTheme"; 
import Hero2  from './Hero2';
import Hero  from './Hero';
import Banner  from './Banner';
import ProductSlide  from './ProductSlide';
import ProductGrid   from '../Product/ProductGrid';
import Footer from './Footer';
import Cursor from './Cursor';
import SaleCategories from '../../components/SaleCategories';
import BrandsSection from '../../components/Brands';
import Newsletter2 from '../../components/Newsletter2';

export default function Home() {
  // 🎨 Integrating the Server Theme Hook
  useServerTheme(); 

  const { user } = useAuth();
  const [homeData, setHomeData] = useState({ 
    flashDeals: [], trending: [], recommended: [], recentlyViewed: [], featured: [], newArrivals: []
  });
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      let guestId = localStorage.getItem('guestId') || ('guest_' + Math.random().toString(36).substr(2, 9) + Date.now());
      localStorage.setItem('guestId', guestId);
      const { data } = await axiosInstance.get(`/home?t=${Date.now()}`, {
        headers: { 'x-guest-id': guestId, 'Cache-Control': 'no-cache' }
      });
      if (data.success) setHomeData(data.data);
    } catch (error) { console.error("Home API Error:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHomeData(); window.scrollTo(0, 0); }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg-light)] flex flex-col items-center justify-center transition-colors duration-500">
        <div className="w-12 h-12 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--theme-primary)] font-serif tracking-[0.3em] uppercase text-[10px]">Unveiling Luxury</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--theme-bg-light)] min-h-screen selection:bg-[var(--theme-primary)] selection:text-[var(--theme-text-light)] transition-colors duration-500">
      <Cursor />
      <Header />
      
      {/* Dynamic Hero with Theme Colors */}
      <Hero
        accentColor="var(--theme-primary)" 
        bg="var(--theme-bg-light)" 
        featuredProducts={homeData.featured} 
      />
      {/* <Hero2 
        accentColor="var(--theme-primary)" 
        bg="var(--theme-bg-light)" 
        featuredProducts={homeData.featured} 
      /> */}
      {/* <Hero1 
        accentColor="var(--theme-primary)" 
        bg="var(--theme-bg-light)" 
        featuredProducts={homeData.featured} 
      /> */}

      <ProductSlide />

      {/* Headings will now follow the theme automatically via CSS variables */}
      <div className="text-[var(--theme-text-main)]">
        {homeData.flashDeals?.length > 0 && (
          <ProductGrid title="Lightning" subtitle="Deals" products={homeData.flashDeals} />
        )}
        
        {homeData.recentlyViewed?.length > 0 && (
          <ProductGrid title="Recently" subtitle="Viewed" products={homeData.recentlyViewed} />
        )}
        
        {homeData.recommended?.length > 0 && (
          <ProductGrid title="Personalized" subtitle="For You" products={homeData.recommended} />
        )}
        
        {homeData.trending?.length > 0 && (
          <ProductGrid title="Trending" subtitle="Now" products={homeData.trending} />
        )}
        
        {homeData.newArrivals?.length > 0 && (
          <ProductGrid title="New" subtitle="Arrivals" products={homeData.newArrivals} />
        )}
      </div>
      <Banner products={homeData.featured} />


      <SaleCategories />
      <BrandsSection />
      <Newsletter2 />
      <Footer />
    </div>
  );
}