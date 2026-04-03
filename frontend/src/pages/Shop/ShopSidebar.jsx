import React from 'react';

export default function ShopSidebar({
  categories = [], selectedCategories = [], onCategoryToggle, priceRange, setPriceRange, maxPriceLimit,
  brands = [], selectedBrands = [], onBrandToggle, selectedColors = [], onColorToggle, selectedRating, onRatingChange, selectedDiscount, onDiscountChange, onClearFilters
}) {
  const priceBrackets = [
    { label: '₹0 - ₹5,000', min: 0, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
    { label: '₹50,000+', min: 50000, max: maxPriceLimit || 1000000 },
  ];

  return (
    <aside className="w-full md:w-[220px] flex-shrink-0 self-start h-fit bg-transparent z-10 mb-10 mr-6 md:mr-12 text-left mt-[10px] pt-0">
      <div className="flex justify-between items-center mb-8 mt-0">
        <h2 className="text-[28px] font-serif font-[800] text-[#111]">
          Filters
        </h2>
        {(selectedCategories?.length > 0 || selectedBrands?.length > 0 || priceRange?.max < (maxPriceLimit || 100000) || priceRange?.min > 0) && (
          <button onClick={onClearFilters} className="text-[10px] uppercase tracking-widest text-[#999] hover:text-[#111] transition-colors">
            Clear
          </button>
        )}
      </div>

      {/* 1. Prices */}
      <div className="mb-10">
        <h4 className="text-[15px] font-[800] text-[#111] mb-5 font-serif">Prices</h4>
        <div className="space-y-3.5">
          {priceBrackets.map((bracket, idx) => (
            <div
              key={idx}
              className={"text-[11px] uppercase tracking-widest cursor-pointer transition-colors " + (priceRange?.min === bracket.min && priceRange?.max === bracket.max ? "text-[#111] font-[800]" : "text-[#888] hover:text-[#333]")}
              onClick={() => setPriceRange({ min: bracket.min, max: bracket.max })}
            >
              {bracket.label}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Brands */}
      {brands && brands.length > 0 && (
        <div className="mb-10">
          <h4 className="text-[15px] font-[800] text-[#111] mb-5 font-serif">Brands</h4>
          <div className="flex flex-wrap gap-x-5 gap-y-3.5">
            {brands.map((brand, idx) => {
              const isSelected = selectedBrands.includes(brand);
              return (
                <div 
                  key={idx} 
                  className={"text-[10px] uppercase tracking-widest cursor-pointer transition-colors w-[42%] truncate " + (isSelected ? "text-[#111] font-[800]" : "text-[#888] hover:text-[#333]")}
                  onClick={() => onBrandToggle(brand)}
                >
                  {brand}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Collections (Categories) */}
      <div className="mb-10">
        <h4 className="text-[15px] font-[800] text-[#111] mb-5 font-serif">Collections</h4>
        <div className="space-y-3.5">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategories.some(c => {
               const sc = c?.toLowerCase().replace(/s$/, '') || '';
               const pc = cat?.toLowerCase().replace(/s$/, '') || '';
               return sc === pc || sc.includes(pc) || pc.includes(sc);
            });
            return (
              <div
                key={idx}
                className={"text-[13px] capitalize cursor-pointer transition-colors " + (isSelected ? "text-[#111] font-[600]" : "text-[#777] hover:text-[#333]")}
                onClick={() => onCategoryToggle(cat)}
              >
                {cat || 'Category'}
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
