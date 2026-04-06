import React, { useState } from 'react';
import TextContent from './TextContent';
import ImageSlider from './ImageSlider';

const Deals = () => {
  return (
    <section className="w-full bg-[#fcfcfc] py-10 xl:py-[60px] relative z-0 overflow-hidden font-sans">
      <div className="w-full flex flex-col xl:flex-row items-start gap-10 xl:gap-[50px] justify-center px-[20px] xl:px-[5%] max-w-[1600px] mx-auto min-h-[500px]">

        {/* Component 1: Text Part */}
        <div className="w-full xl:w-[35%] flex flex-col justify-start items-center xl:items-start pt-[20px] xl:pt-[80px]">
          <div className="w-full max-w-[400px] xl:ml-auto">
            <TextContent />
          </div>
        </div>

        {/* Component 2: Slider Part */}
        <div className="w-full xl:w-[65%] min-w-0">
          <ImageSlider />
        </div>
        
      </div>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </section>
  );
};

export default Deals;
