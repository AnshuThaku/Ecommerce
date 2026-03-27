import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

// ── NAYE UI COMPONENTS IMPORT ──
import Header from './Header';
import Hero   from './Hero';
// import Hero1  from './Hero1';
import Hero2  from './Hero2';
import BrandsMarquee from './BrandsMarquee';
import ProductSlide  from './ProductSlide'; // 👈 NAYA SLIDER IMPORT KIYA
import ProductGrid   from '../Product/ProductGrid'; // 👈 NAYA GRID COMPONENT IMPORT KIYA
import Footer from './Footer';
import Cursor from './Cursor';
import SaleCategories from '../../components/SaleCategories';

export default function Home() {
  const { user } = useAuth();
  
  // State for API Data
  const [homeData, setHomeData] = useState({ 
    flashDeals: [], // ⚡ Added Flash Deals
    trending: [], 
    recommended: [], 
    recentlyViewed: [],
    featured: [], // 👈 Admin dwara mark kiye gaye featured products yahan aayenge
    newArrivals: []
  });
  const [loading, setLoading] = useState(true);

  // ── FETCH HOME DATA LOGIC ──
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('guestId', guestId);
      }

      // Backend API Call with Cache Buster
      const { data } = await axiosInstance.get(`/home?t=${Date.now()}`, {
        headers: { 
          'x-guest-id': guestId,
          'Cache-Control': 'no-cache' 
        }
      });
      
      if (data.success) {
        setHomeData(data.data);
      }
    } catch (error) {
      console.error("Home API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
    window.scrollTo(0, 0);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#d3b574] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#d3b574] font-serif tracking-[0.3em] uppercase text-[10px]">Unveiling Luxury</p>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen selection:bg-[#d3b574] selection:text-black">
      <Cursor />
      <Header />

      {/* 👇 3. Hero Slider - Ab yeh Featured Products use karega 👇 */}
      <Hero 
        accentColor="#d3b574" 
        bg="#121212" 
        featuredProducts={homeData.featured} 
      />
      {/* <Hero1
        accentColor="#d3b574" 
        bg="#121212" 
        featuredProducts={homeData.featured} 
      /> */}

      {/* <Hero2
        accentColor="#d3b574" 
        bg="#121212" 
        featuredProducts={homeData.featured} 
      /> */}

     

      {/* 👇 NAYA CATEGORY SLIDER YAHAN LAGA HAI 👇 */}
      <ProductSlide />

      {/* ⚡ 4. LIGHTNING DEALS SECTION ⚡ */}
      {homeData.flashDeals?.length > 0 && (
        <ProductGrid 
          title="Lightning" 
          subtitle="Deals" 
          products={homeData.flashDeals} 
        />
      )}

        {/* 7. RECENTLY VIEWED */}
      {homeData.recentlyViewed?.length > 0 && (
        <ProductGrid 
          title="Recently" 
          subtitle="Viewed" 
          products={homeData.recentlyViewed} 
        />
      )}

      
      {/* 6. RECOMMENDED SECTION */}
      {homeData.recommended?.length > 0 && (
        <ProductGrid 
          title="Personalized" 
          subtitle="For You" 
          products={homeData.recommended} 
        />
      )}

      {/* 5. TRENDING SECTION */}
      {homeData.trending?.length > 0 && (
        <ProductGrid 
          title="Trending" 
          subtitle="Now" 
          products={homeData.trending} 
        />
      )}


    

      {/* 8. NEW ARRIVALS */}
      {homeData.newArrivals?.length > 0 && (
        <ProductGrid 
          title="New" 
          subtitle="Arrivals" 
          products={homeData.newArrivals} 
        />
      )}

        <SaleCategories/>

      <Footer />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />

    
    </div>

  );
}