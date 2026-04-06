import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';

export default function ShopTopbar({
  categories = [], 
  selectedCategories = [], 
  onCategoryToggle, 
  brands = [], 
  selectedBrands = [], 
  onBrandToggle, 
  priceRange, 
  setPriceRange, 
  maxPriceLimit,
  onClearFilters,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'best-selling', label: 'Best selling' },
    { value: 'price-asc', label: 'Price: Low to high' },
    { value: 'price-desc', label: 'Price: High to low' },
    { value: 'newest', label: 'New Arrivals' },
  ];

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + (priceRange?.max < maxPriceLimit ? 1 : 0);

  return (
    <>
      <div className="w-full bg-transparent py-3 mb-6 relative z-30" ref={dropdownRef}>
        <div className="w-full flex items-center justify-between gap-4">
          
          {/* MOBILE VIEW: Filter Button */}
          <div className="md:hidden flex items-center flex-1 justify-start">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="flex items-center gap-2 text-[15px] font-[800] text-black uppercase tracking-wider cursor-pointer"
            >
              <Filter size={18} /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>

          {/* 1. LEFT COLUMN: In Stock Only */}
          <div className="hidden md:flex flex-1 justify-start items-center gap-3">
            <span className="text-[15px] font-[800] text-[#111] cursor-pointer" onClick={() => setInStockOnly(!inStockOnly)}>In stock only</span>
            <button 
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${inStockOnly ? 'bg-black' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${inStockOnly ? 'translate-x-4.5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* 2. CENTER COLUMN: Price, Product Type & Brand */}
          <div className="hidden md:flex flex-[2] justify-center items-center gap-10">
            
            {/* Price Dropdown */}
            <div className="relative">
              <button onClick={() => toggleDropdown('price')} className={`flex items-center gap-1.5 text-[15px] font-[800] transition-colors cursor-pointer ${openDropdown === 'price' || priceRange?.max < maxPriceLimit ? 'text-black' : 'text-gray-600 hover:text-black'}`}>
                Price <ChevronDown size={16} className={`transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'price' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[340px] bg-white border border-gray-200 shadow-xl p-6 z-50 rounded-sm">
                  <div className="flex justify-between items-center mb-4 text-[14px] font-bold">
                    <span>₹0</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                  <input type="range" min="0" max={maxPriceLimit || 100000} value={priceRange.max} onChange={(e) => setPriceRange({ min: 0, max: Number(e.target.value) })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                  <p className="text-[12px] text-gray-500 mt-4 text-center font-medium">Slide to set maximum price</p>
                </div>
              )}
            </div>

            {/* Product Type Dropdown */}
            <div className="relative">
              <button onClick={() => toggleDropdown('category')} className={`flex items-center gap-1.5 text-[15px] font-[800] transition-colors cursor-pointer ${openDropdown === 'category' || selectedCategories.length > 0 ? 'text-black' : 'text-gray-600 hover:text-black'}`}>
                Product type {selectedCategories.length > 0 && <span className="bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">{selectedCategories.length}</span>}
                <ChevronDown size={16} className={`transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'category' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[250px] bg-white border border-gray-200 shadow-xl p-5 z-50 rounded-sm max-h-[300px] overflow-y-auto">
                  <div className="space-y-3">
                    {categories.map((cat, idx) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group text-left">
                          <input type="checkbox" checked={isSelected} onChange={() => onCategoryToggle(cat)} className="w-4 h-4 accent-black cursor-pointer" />
                          <span className={`text-[14px] capitalize cursor-pointer ${isSelected ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>{cat || 'Category'}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ⚡ NEW: Brand Dropdown (Desktop) */}
            <div className="relative">
              <button onClick={() => toggleDropdown('brand')} className={`flex items-center gap-1.5 text-[15px] font-[800] transition-colors cursor-pointer ${openDropdown === 'brand' || selectedBrands.length > 0 ? 'text-black' : 'text-gray-600 hover:text-black'}`}>
                Brand {selectedBrands.length > 0 && <span className="bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">{selectedBrands.length}</span>}
                <ChevronDown size={16} className={`transition-transform ${openDropdown === 'brand' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'brand' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[280px] bg-white border border-gray-200 shadow-xl p-5 z-50 rounded-sm max-h-[300px] overflow-y-auto">
                  <div className="grid grid-cols-1 gap-3">
                    {brands.map((brand, idx) => {
                      const isSelected = selectedBrands.includes(brand);
                      return (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group text-left">
                          <input type="checkbox" checked={isSelected} onChange={() => onBrandToggle(brand)} className="w-4 h-4 accent-black cursor-pointer" />
                          <span className={`text-[13px] uppercase tracking-wide cursor-pointer truncate ${isSelected ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Clear All Filters */}
            {activeFiltersCount > 0 && (
              <button onClick={onClearFilters} className="text-[13px] font-[800] uppercase tracking-wider text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer">
                <X size={14} strokeWidth={3} /> Clear
              </button>
            )}
          </div>

          {/* 3. RIGHT COLUMN: Sort By Dropdown */}
          <div className="flex flex-1 justify-end items-center gap-2">
            <span className="hidden md:inline-block text-[15px] font-[800] text-[#111]">Sort by:</span>
            <div className="relative">
               <button onClick={() => toggleDropdown('sort')} className="flex items-center gap-1.5 text-[15px] font-[800] text-gray-600 hover:text-black cursor-pointer">
                 {sortOptions.find(opt => opt.value === sortBy)?.label || 'Best selling'} <ChevronDown size={16} className={`transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
               </button>
               {openDropdown === 'sort' && (
                <div className="absolute top-full right-0 mt-4 w-[200px] bg-white border border-gray-200 shadow-xl py-2 z-50 rounded-sm text-left">
                  {sortOptions.map((option, idx) => (
                    <div key={idx} onClick={() => { setSortBy(option.value); setOpenDropdown(null); }} className={`px-5 py-2.5 text-[14px] cursor-pointer hover:bg-gray-50 transition-colors ${sortBy === option.value ? 'font-bold text-black bg-gray-50' : 'text-gray-600'}`}>
                      {option.label}
                    </div>
                  ))}
                </div>
               )}
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE FILTERS DRAWER (Same as before) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/50 md:hidden flex justify-end" onClick={() => setIsMobileOpen(false)}>
          <div className="w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold">Filters</h2>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-gray-50 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 text-left space-y-8">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setInStockOnly(!inStockOnly)}>
                <span className="text-[15px] font-[800] text-[#111]">In stock only</span>
                <button className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${inStockOnly ? 'bg-black' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${inStockOnly ? 'translate-x-4.5' : 'translate-x-1'}`} />
                </button>
              </div>
              <div>
                <h3 className="text-[15px] font-[800] mb-4 font-serif uppercase tracking-wider text-gray-400">Price Range</h3>
                <div className="flex justify-between items-center mb-2 text-[14px] font-bold"><span>₹0</span><span>₹{priceRange.max}</span></div>
                <input type="range" min="0" max={maxPriceLimit || 100000} value={priceRange.max} onChange={(e) => setPriceRange({ min: 0, max: Number(e.target.value) })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
              </div>
              <div>
                <h3 className="text-[15px] font-[800] mb-4 font-serif uppercase tracking-wider text-gray-400">Product Type</h3>
                <div className="space-y-3">
                  {categories.map((cat, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => onCategoryToggle(cat)} className="w-4 h-4 accent-black" />
                      <span className="text-[15px] capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[15px] font-[800] mb-4 font-serif uppercase tracking-wider text-gray-400">Brands</h3>
                <div className="grid grid-cols-2 gap-3">
                  {brands.map((brand, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => onBrandToggle(brand)} className="w-3.5 h-3.5 accent-black" />
                      <span className="text-[13px] uppercase truncate">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={onClearFilters} className="flex-1 py-3 border border-black text-black text-[12px] font-bold uppercase tracking-widest">Clear</button>
              <button onClick={() => setIsMobileOpen(false)} className="flex-1 py-3 bg-black text-white text-[12px] font-bold uppercase tracking-widest">Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}