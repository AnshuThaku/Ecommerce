import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import heroImage from './truee-001-banner (1).png';

export default function Hero() {
  const navigate = useNavigate();
  const [targetProductId, setTargetProductId] = useState(null);

  useEffect(() => {
    // API integration to fetch a product for the Buy Now button
    const fetchHeroProduct = async () => {
      try {
        const response = await axiosInstance.get('/products');
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
      className="w-full overflow-x-hidden relative bg-white flex flex-col justify-center items-center pt-0 px-0 cursor-pointer mt-0"
      onClick={handleShopNow}
    >
      <div className="w-full m-0 p-0">
        <img
          src={heroImage}
          alt="True 001 Banner"
          className="w-full h-auto block m-0 p-0"
        />
      </div>
    </main>
  );
}
