import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Header1 from './Header1';
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
import BrandStrip from '../../components/BrandStrip';
import Newsletter2 from '../../components/Newsletter2';
import Newhero from './Newhero';
import CategoryShowcase from './Category';
import ImageSlider from './Deal';
import Deals from './Deal';
import MarshallDesign from './Views';
import FeatureBar from './FeatureBar';
import MarshallWideLayout from './MarshalWideLayout';
import TestimonialSlider from './TestimonialSlider';

export default function Home() {
  // 🎨 Integrating the Server Theme Hook
  // useServerTheme(); 

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
      
      {/* ⚡ Aapka naya Header + Hero Component */}
      <Header1 /> 
      <div className="bg-white relative z-20">
        <Newhero featuredProducts={homeData.featured || []} />
        <BrandStrip />
      </div>
      <Deals/>

<CategoryShowcase/>
<MarshallDesign/>
<FeatureBar/>

<MarshallWideLayout/>
<TestimonialSlider/>
<Newsletter2/>
      
     
      
     
      
      {/* ⚡ FIX: Added Footer at the bottom */}
      <Footer /> 
    </div>
  );
}