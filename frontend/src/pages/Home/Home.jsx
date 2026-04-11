import React, { useState, useEffect, Suspense } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

// Components
import Header1 from './Header1';
import BrandStrip from '../../components/BrandStrip';
import Footer from './Footer';
import Cursor from './Cursor';
import Newsletter2 from '../../components/Newsletter2';
import Newhero from './Newhero';
import CategoryShowcase from './Category';
import Deals from './Deal';
import MarshallDesign from './Views';
import FeatureBar from './FeatureBar';
import MarshallWideLayout from './MarshalWideLayout';
import TestimonialSlider from './TestimonialSlider';

// ⚡ Naya Skeleton Component (Ise aap alag file mein bhi rakh sakte hain)
const SkeletonCard = () => (
  <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-lg mb-4"></div>
);

export default function Home() {
  const { user } = useAuth();
  const [homeData, setHomeData] = useState({ 
    flashDeals: [], trending: [], recommended: [], recentlyViewed: [], featured: [], newArrivals: []
  });
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      // setLoading(true); // ⚡ Ise hamesha true karne ki zaroorat nahi agar hum cache use karein
      let guestId = localStorage.getItem('guestId') || ('guest_' + Math.random().toString(36).substr(2, 9) + Date.now());
      localStorage.setItem('guestId', guestId);
      
      const { data } = await axiosInstance.get(`/home?t=${Date.now()}`, {
        headers: { 'x-guest-id': guestId, 'Cache-Control': 'no-cache' }
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

  return (
    <div className="bg-[var(--theme-bg-light)] min-h-screen selection:bg-[var(--theme-primary)] selection:text-[var(--theme-text-light)] transition-colors duration-500">
      <Cursor />
      
      {/* ⚡ Header hamesha dikhega, ye data ka wait nahi karega */}
      <Header1 /> 

      <div className="bg-white relative z-20">
        {/* ⚡ Agar data load ho raha hai toh Hero ka skeleton dikhao */}
        {loading ? (
          <div className="w-full h-[70vh] bg-gray-100 animate-pulse flex items-center justify-center">
             <p className="text-gray-400 font-serif animate-bounce">Loading Luxury...</p>
          </div>
        ) : (
          <Newhero featuredProducts={homeData.featured || []} />
        )}
        <BrandStrip />
      </div>

      {/* ⚡ Sections ko condition ke hisaab se render karein */}
      {loading ? (
        <div className="px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <Deals />
          <CategoryShowcase />
          <MarshallDesign />
          <FeatureBar />
          <MarshallWideLayout />
          <TestimonialSlider />
        </>
      )}

      <Newsletter2 />
      <Footer /> 
    </div>
  );
}