import React from 'react';
import { Filter, IndianRupee, ChevronDown, Star, Check } from 'lucide-react';

export default function ShopSidebar({ 
  categories = [], 
  selectedCategories = [], 
  onCategoryToggle, 
  priceRange, 
  setPriceRange, 
  maxPriceLimit,
  selectedColors = [],
  onColorToggle,
  selectedRating,
  onRatingChange,
  selectedDiscount,
  onDiscountChange,
  onClearFilters 
}) {
  const colors = ["Black", "White", "Silver", "Gold", "Blue", "Red"];
  const discounts = [10, 20, 30, 50];

  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="sticky top-[90px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-h-[calc(100vh-110px)] overflow-y-auto hide-scrollbar transition-all duration-500">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
            <Filter size={14} className="text-theme-primary" /> Filters
          </h3>
          {(selectedCategories.length > 0 || selectedColors.length > 0 || selectedRating || selectedDiscount) && (
            <button onClick={onClearFilters} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider cursor-pointer">
              Clear All
            </button>
          )}
        </div>

        {/* 1. Categories (Multi-Select + Word Clickable) */}
        <div className="p-5 border-b border-gray-50">
          <h4 className="text-[11px] font-bold uppercase text-gray-400 mb-4 tracking-widest">Categories</h4>
          <div className="space-y-3">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <div 
                  key={cat} 
                  className="flex items-center group cursor-pointer" 
                  onClick={() => onCategoryToggle(cat)} // ⚡ Pura row clickable
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-theme-primary border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                    {isSelected && <Check size={12} className="text-theme-bg-dark stroke-[4]" />}
                  </div>
                  <span className={`ml-3 text-[13px] transition-colors ${isSelected ? 'font-bold text-black' : 'text-gray-500 group-hover:text-theme-primary'}`}>
                    {cat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Colors */}
        <div className="p-5 border-b border-gray-50">
          <h4 className="text-[11px] font-bold uppercase text-gray-400 mb-4 tracking-widest">Colours</h4>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = selectedColors.includes(color);
              return (
                <button 
                  key={color}
                  onClick={() => onColorToggle(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${isSelected ? 'border-theme-primary scale-110 shadow-md' : 'border-transparent'}`}
                  style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase(), border: color.toLowerCase() === 'white' ? '1px solid #ddd' : 'none' }}
                >
                  {isSelected && <Check size={14} className={color === 'White' ? 'text-black' : 'text-white'} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Ratings (Word Clickable + Deselect Logic) */}
        <div className="p-5 border-b border-gray-50">
          <h4 className="text-[11px] font-bold uppercase text-gray-400 mb-4 tracking-widest">Customer Ratings</h4>
          <div className="space-y-3">
            {[4, 3, 2].map((star) => {
              const isSelected = selectedRating === star;
              return (
                <div 
                  key={star} 
                  className="flex items-center group cursor-pointer" 
                  onClick={() => onRatingChange(star)} // ⚡ Word clickable
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-theme-primary border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-theme-bg-dark rounded-full" />}
                  </div>
                  <div className={`ml-3 flex items-center gap-1 text-[13px] transition-colors ${isSelected ? 'font-bold text-black' : 'text-gray-600 group-hover:text-theme-primary'}`}>
                    {star} <Star size={12} className="fill-yellow-400 text-yellow-400" /> & above
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Discount (Word Clickable + Deselect Logic) */}
        <div className="p-5 border-b border-gray-50">
          <h4 className="text-[11px] font-bold uppercase text-gray-400 mb-4 tracking-widest">Discounts</h4>
          <div className="space-y-3">
            {discounts.map((d) => {
              const isSelected = selectedDiscount === d;
              return (
                <div 
                  key={d} 
                  className="flex items-center group cursor-pointer" 
                  onClick={() => onDiscountChange(d)} // ⚡ Word clickable
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-theme-primary border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                    {isSelected && <Check size={12} className="text-theme-bg-dark stroke-[4]" />}
                  </div>
                  <span className={`ml-3 text-[13px] transition-colors ${isSelected ? 'font-bold text-black' : 'text-gray-500 group-hover:text-theme-primary'}`}>
                    {d}% or more
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Price Range */}
        <div className="p-5">
          <h4 className="text-[11px] font-bold uppercase text-gray-400 mb-4 tracking-widest">Price Range</h4>
          <input type="range" min="0" max={maxPriceLimit} value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary)]" />
          <div className="flex justify-between mt-3 text-[10px] font-black text-theme-primary">
            <span>₹0</span>
            <span className="bg-theme-primary/10 px-2 py-1 rounded">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}