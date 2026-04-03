import React, { useState } from 'react';
import TextContent from './TextContent';
import ImageSlider from './ImageSlider';

const Deals = () => {
  return (
    <section className="w-full bg-[#fcfcfc] py-2 xl:py-10 relative z-0 overflow-hidden font-sans">
      <div className="w-full flex flex-col xl:flex-row items-stretch gap-2 xl:gap-[20px] justify-between px-[20px] xl:px-[5%] 2xl:px-[10%] mx-auto">

        {/* Component 1: Text Part */}
        <div className="w-full xl:w-[32%] flex flex-col justify-center items-center xl:items-start pb-2 pt-0 xl:pb-8 xl:pt-8">
          <div className="flex-1 w-full max-w-[400px] xl:ml-auto">
            <TextContent />
          </div>
        </div>

        {/* Component 2: Slider Part */}
        <div className="w-full xl:w-[65%] min-w-0 flex items-stretch justify-start m-0 p-0">
          <div className="w-full">
            <ImageSlider />
          </div>
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
