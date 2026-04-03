import React from 'react';
import { Trophy, ShieldCheck, Truck, Headset } from 'lucide-react';

const FeatureBar = () => {
  return (
    <section className="w-full bg-white py-10 px-8">
      {/* Container to center and spread the items */}
      <div className="max-w-[1250px] mx-auto flex flex-wrap justify-between items-center gap-10">
        
        {/* Item 1: High Quality */}
        <div className="flex items-center gap-3">
          <Trophy size={45} strokeWidth={1.2} className="text-black" />
          <div className="flex flex-col">
            <h3 className="text-[19px] font-bold text-[#242424] leading-tight">High Quality</h3>
            <p className="text-[15px] text-[#898989] font-medium">crafted from top materials</p>
          </div>
        </div>

        {/* Item 2: Warranty Protection */}
        <div className="flex items-center gap-3">
          <ShieldCheck size={45} strokeWidth={1.2} className="text-black" />
          <div className="flex flex-col">
            <h3 className="text-[19px] font-bold text-[#242424] leading-tight">Warranty Protection</h3>
            <p className="text-[15px] text-[#898989] font-medium">Over 2 years</p>
          </div>
        </div>

        {/* Item 3: Free Shipping */}
        <div className="flex items-center gap-3">
          <Truck size={45} strokeWidth={1.2} className="text-black" />
          <div className="flex flex-col">
            <h3 className="text-[19px] font-bold text-[#242424] leading-tight">Free Shipping</h3>
            <p className="text-[15px] text-[#898989] font-medium">All over India</p>
          </div>
        </div>

        {/* Item 4: 24/7 Support */}
        <div className="flex items-center gap-3">
          <Headset size={45} strokeWidth={1.2} className="text-black" />
          <div className="flex flex-col">
            <h3 className="text-[19px] font-bold text-[#242424] leading-tight">24 / 7 Support</h3>
            <p className="text-[15px] text-[#898989] font-medium">Dedicated support</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeatureBar;