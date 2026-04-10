// data.js

// 1. Aapki Excel Sheet se extract kiya gaya raw data
const rawData = [
  { name: "Marshall Willen", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "No" },
  { name: "Marshall Willen", color: "Cream", category: "Marshall Portable Speakers", brand: "Marshall", active: "No" },
  { name: "Marshall Willen II", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Willen II", color: "Cream", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Willen II", color: "Forest Green", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Emberton", color: "Black and Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "NO" },
  { name: "Marshall Emberton", color: "Cream", category: "Marshall Portable Speakers", brand: "Marshall", active: "NO" },
  { name: "Marshall Emberton II", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Emberton II", color: "Cream", category: "Marshall Portable Speakers", brand: "Marshall", active: "NO" },
  { name: "Marshall Emberton II", color: "Black & Steel", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Emberton III", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Emberton III", color: "Cream", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Emberton III", color: "Sage Green", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Emberton III", color: "Midnight Blue", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Stockwell II", color: "Black", category: "Marshall Portable Speakers", brand: "Marshall", active: "NO" },
  { name: "Marshall Stockwell II", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Killburn II", color: "Black", category: "Marshall Portable Speakers", brand: "Marshall", active: "NO" },
  { name: "Marshall Killburn II", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Middleton", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Middleton", color: "Cream", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Middleton II", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Middleton II", color: "Cream", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Killburn III", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Killburn III", color: "Cream", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Killburn III", color: "Brown", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Tufton", color: "Black", category: "Marshall Portable Speakers", brand: "Marshall", active: "NO" },
  { name: "Marshall Tufton", color: "Black & Brass", category: "Marshall Portable Speakers", brand: "Marshall", active: "YES" },
  { name: "Marshall Acton II", color: "Black", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Acton II", color: "Cream", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Acton II", color: "Brown", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Stannmore II", color: "Black", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Stannmore II", color: "Cream", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Stannmore II", color: "Brown", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Woburn II", color: "Black", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Woburn II", color: "Cream", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Woburn II", color: "Brown", category: "Marshall Home Series II", brand: "Marshall", active: "NO" },
  { name: "Marshall Acton III", color: "Black", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Acton III", color: "Cream", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Acton III", color: "Brown", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Acton III", color: "Midnight Blue", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Acton III", color: "Burgundy", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Stannmore III", color: "Black", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Stannmore III", color: "Cream", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Stannmore III", color: "Brown", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Woburn III", color: "Black", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Woburn III", color: "Cream", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Woburn III", color: "Brown", category: "Marshall Home Series III", brand: "Marshall", active: "YES" },
  { name: "Marshall Minor III", color: "Black", category: "Marshall TWS", brand: "Marshall", active: "YES" },
  { name: "Marshall Minor III", color: "Cream", category: "Marshall TWS", brand: "Marshall", active: "NO" },
  { name: "Marshall Minor III", color: "Burgundy", category: "Marshall TWS", brand: "Marshall", active: "NO" },
  { name: "Marshall Minor IV", color: "Black", category: "Marshall TWS", brand: "Marshall", active: "YES" },
  { name: "Marshall Minor IV", color: "Cream", category: "Marshall TWS", brand: "Marshall", active: "YES" },
  { name: "Marshall Motif ANC", color: "Black", category: "Marshall TWS", brand: "Marshall", active: "NO" },
  { name: "Marshall Motif II ANC", color: "Black", category: "Marshall TWS", brand: "Marshall", active: "YES" },
  { name: "Marshall Mode II", color: "Black", category: "Marshall TWS", brand: "Marshall", active: "NO" },
  { name: "Marshall Major IV", color: "Black", category: "Marshall Headphones", brand: "Marshall", active: "YES" },
  { name: "Marshall Major IV", color: "Brown", category: "Marshall Headphones", brand: "Marshall", active: "NO" },
  { name: "Marshall Major IV", color: "Cream", category: "Marshall Headphones", brand: "Marshall", active: "NO" },
  { name: "Marshall Major V", color: "Black", category: "Marshall Headphones", brand: "Marshall", active: "YES" },
  { name: "Marshall Major V", color: "Brown", category: "Marshall Headphones", brand: "Marshall", active: "YES" },
  { name: "Marshall Major V", color: "Cream", category: "Marshall Headphones", brand: "Marshall", active: "YES" },
  { name: "Marshall Major V", color: "Midnight Blue", category: "Marshall Headphones", brand: "Marshall", active: "YES" },
  { name: "Marshall Monitor II ANC", color: "Black", category: "Marshall Headphones", brand: "Marshall", active: "NO" },
  { name: "Marshall Monitor III ANC", color: "Black", category: "Marshall Headphones", brand: "Marshall", active: "YES" },
  { name: "Marshall Monitor III ANC", color: "Cream", category: "Marshall Headphones", brand: "Marshall", active: "YES" },
  { name: "Marshall Mode C Type Earphone", color: "Black", category: "Marshall Earphones", brand: "Marshall", active: "YES" },
  { name: "Heston 60", color: "Black", category: "Marshall Soundbar & Subwoofer", brand: "Marshall", active: "YES" },
  { name: "Heston 60", color: "Cream", category: "Marshall Soundbar & Subwoofer", brand: "Marshall", active: "YES" },
  { name: "Heston 120", color: "Black", category: "Marshall Soundbar & Subwoofer", brand: "Marshall", active: "YES" },
  { name: "Heston 200", color: "Black", category: "Marshall Soundbar & Subwoofer", brand: "Marshall", active: "YES" },
  { name: "Heston 200", color: "Cream", category: "Marshall Soundbar & Subwoofer", brand: "Marshall", active: "YES" },
  { name: "Marshall Bromley 450", color: "Black & Brass", category: "Marshall Party Speaker", brand: "Marshall", active: "YES" },
  { name: "Marshall Bromley 750", color: "Black & Brass", category: "Marshall Party Speaker", brand: "Marshall", active: "YES" },
  { name: "Marshall Heddon", color: "Black & Brass", category: "Marshall Music Streamer", brand: "Marshall", active: "YES" }
];

// 2. Data ko aapke Mongoose Model ke hisaab se Format karna
const formattedProducts = rawData.map(item => {
  // Required fields ki fallback values banayi hain kyunki sheet me khali hain
  return {
    name: item.name,
    description: `Experience premium sound with ${item.name} by ${item.brand}.`, // Fallback description
    price: 9999, // Fallback Price
    discountPrice: 0,
    category: item.category,
    brand: item.brand,
    stock: 10, // Fallback Stock
    images: [], // Images khali chhodi hain, admin panel se dalengi
    
    // Color ko variants array me daala hai
    variants: item.color ? [
      {
        color: item.color,
        size: "Standard",
        stock: 10,
        price: 9999,
        images: []
      }
    ] : [],

    // ⚡ IMPORTANT: Isko apne admin panel ke actual User _id se replace karein!
    seller: "65f0b5a31c5b4b1a2c9d8e7f", 

    isActive: item.active.toLowerCase() === "yes",
    soldCount: 0,
    isFeatured: false,
    flashDeal: {
      isActive: false,
      dealPrice: 0
    }
  };
});

module.exports = formattedProducts;