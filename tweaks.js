const fs = require('fs');

let dealFile = 'c:\\Users\\LENOVO\\OneDrive\\Desktop\\Ecom\\frontend\\src\\pages\\Home\\Deal.jsx';
let dealContent = fs.readFileSync(dealFile, 'utf8');

// The main layout doesn't need to constrain the right side to 89% anymore if we want the right image to touch the edge. Wait, the user said "uski right se margin-0 hai" - meaning no margin on the right edge of the screen, BUT 89% width wrapper adds margin-auto (margin left and right).
// The requirement is: "right wali jo image hai uski right se margin-0 hai" -> It should touch the browser edge! But the wrapper is max-w-[89%] mx-auto. Let's fix this so the slider breaks out or the container is fluid on the right.

dealContent = dealContent.replace(
  /className="w-full max-w-\[89%\] mx-auto px-0 flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 justify-between"/,
  'className="w-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 justify-between pl-[5.5%]"' // 5.5% left padding replicates the left margin of an 89% center block (100 - 89) / 2 = 5.5.
);

fs.writeFileSync(dealFile, dealContent);


let sliderFile = 'c:\\Users\\LENOVO\\OneDrive\\Desktop\\Ecom\\frontend\\src\\pages\\Home\\ImageSlider.jsx';
let sliderContent = fs.readFileSync(sliderFile, 'utf8');

// Change gap strictly to 20px
sliderContent = sliderContent.replace(
  /className="w-full relative flex flex-col md:flex-row items-stretch justify-between gap-\[20px\] ml-auto m-0 p-0"/,
  'className="w-full relative flex flex-col md:flex-row items-stretch gap-[20px] m-0 p-0"'
);

// We need the aspect of the left image to be square but fill its gap.
sliderContent = sliderContent.replace(
  /className="w-full relative overflow-hidden bg-white shadow-sm rounded-\[2px\] flex-\[1\.35\] m-0"/,
  'className="relative overflow-hidden bg-white shadow-sm rounded-[2px] flex-[1.4] m-0 transition-all duration-500"'
);


// The right flex should stretch to the right edge.
sliderContent = sliderContent.replace(
  /className="w-full flex flex-col justify-between h-auto flex-\[1\] m-0"/,
  'className="flex flex-col justify-between h-auto flex-[1] m-0 transition-all duration-500 w-[100%]"'
);

fs.writeFileSync(sliderFile, sliderContent);

console.log("Tweaked Deal to align directly to the right edge");
