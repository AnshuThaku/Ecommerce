import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import heroImage from './01 (2).png';

export default function Hero() {
  const navigate = useNavigate();
  const [targetProductId, setTargetProductId] = useState(null);

  useEffect(() => {
    // API integration to fetch a product for the Buy Now button
    const fetchHeroProduct = async () => {
      try {
        const response = await axiosInstance.get('/api/products');
        if (response.data && response.data.length > 0) {
          // Selecting the first product
          setTargetProductId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching product for hero section:", error);
      }
    };
    fetchHeroProduct();
  }, []);

  const handleShopNow = () => {
    if (targetProductId) {
      // API se fetched product ke details page pe le jayega
      navigate(`/product/${targetProductId}`);
    } else {
      // Fallback
      navigate('/shop');
    }
  };

  return (
    <main
      className="w-full relative bg-white flex flex-col justify-center items-center overflow-hidden h-[50vh] lg:h-[calc(100vh-100px)] p-0 cursor-pointer"
      onClick={handleShopNow}
    >
      <div className="w-full h-full relative mx-auto flex justify-center items-center">

        {/* 1. The Main Hero Image */}
        <img
          src={heroImage}
          alt="Hero Section"
          className="w-full h-full object-cover block"
        />
        </div>
        </main>
  );
}
