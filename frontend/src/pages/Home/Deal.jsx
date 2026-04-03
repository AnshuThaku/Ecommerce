import React, { useState } from 'react';
import TextContent from './TextContent';
import ImageSlider from './ImageSlider';

const Deals = () => {
  return (
    <section className="w-full bg-[#fcfcfc] py-10 relative z-0 overflow-hidden font-sans">
      <div className="w-full flex flex-col xl:flex-row items-stretch gap-[20px] justify-between pl-[5.5%] pr-[5.5%] xl:pr-0">

        {/* Component 1: Text Part */}
        <div className="w-full xl:w-[35%] flex flex-col justify-center items-start pb-8 pt-8">
          <div className="flex-1 w-full max-w-[400px]">
            <TextContent />
          </div>
        </div>

        {/* Component 2: Slider Part */}
        <div className="w-full xl:w-[58%] min-w-0 flex items-stretch m-0 p-0 xl:pr-0">
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
