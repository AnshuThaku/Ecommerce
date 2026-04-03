const fs = require('fs');

let sliderFile = 'c:\\Users\\LENOVO\\OneDrive\\Desktop\\Ecom\\frontend\\src\\pages\\Home\\ImageSlider.jsx';
let sliderContent = fs.readFileSync(sliderFile, 'utf8');

sliderContent = sliderContent.replace(
  /className="w-full relative flex flex-col md:flex-row items-stretch justify-end gap-\[20px\] ml-auto"/,
  'className="w-full relative flex flex-col md:flex-row items-stretch justify-between gap-[20px] ml-auto m-0 p-0"'
);

// Tweak ratios
sliderContent = sliderContent.replace(
  /className="w-full relative overflow-hidden bg-white shadow-sm rounded-\[2px\] flex-\[1\.5\]"/,
  'className="w-full relative overflow-hidden bg-white shadow-sm rounded-[2px] flex-[1.35] m-0"'
);
sliderContent = sliderContent.replace(
  /className="w-full flex flex-col justify-between h-auto flex-\[1\]"/,
  'className="w-full flex flex-col justify-between h-auto flex-[1] m-0"'
);

fs.writeFileSync(sliderFile, sliderContent);

let dealFile = 'c:\\Users\\LENOVO\\OneDrive\\Desktop\\Ecom\\frontend\\src\\pages\\Home\\Deal.jsx';
let dealContent = fs.readFileSync(dealFile, 'utf8');

dealContent = dealContent.replace(
  /className="w-full lg:w-\[65%\] min-w-0 flex items-stretch"/,
  'className="w-full lg:w-[65%] min-w-0 flex items-stretch m-0 p-0"'
);
dealContent = dealContent.replace(
  /className="w-full max-w-\[89%\] mx-auto px-0 lg:px-0 flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16 justify-between"/,
  'className="w-full max-w-[89%] mx-auto px-0 flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 justify-between"'
);

fs.writeFileSync(dealFile, dealContent);
console.log("Deals tweaked");
