import React from 'react';

const TextContent = () => {
  return (
    <div className="flex flex-col items-start xl:items-start text-left xl:text-left mx-auto xl:mx-0 z-20 w-full max-w-[500px] xl:max-w-[400px]">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#222] tracking-tight mb-5 md:mb-6">
        Deals Of The Month
      </h2>
      <p className="text-[#888] text-[12px] md:text-[14px] leading-[1.8] mb-8 font-[400]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
      </p>
      <button className="bg-black text-white px-8 py-3 text-[14px] font-bold uppercase rounded-[4px] hover:bg-gray-800 transition-colors shadow-lg shadow-gray-300 cursor-pointer self-start">
        BUY NOW
      </button>
    </div>
  );
};

export default TextContent;