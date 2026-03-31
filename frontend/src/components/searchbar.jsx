import React, { useState, useEffect, useRef } from 'react';
import { History, Search, Clock, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance'; 

const SearchBar = ({ onSearch, placeholder = "Search luxury products..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchContainerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Fetch Recent Searches
  const fetchRecentSearches = async () => {
    try {
      let guestId = localStorage.getItem('guestId');
      let url = `/history?type=search${guestId ? `&guestId=${guestId}` : ''}`;
      const { data } = await axiosInstance.get(url);
      if (data.success) {
        const searches = data.history.map(item => item.searchQuery).filter(Boolean);
        setRecentSearches([...new Set(searches)].slice(0, 5));
      }
    } catch (error) { console.error(error); }
  };

  // 2. Debounced Suggestions (ONLY for Dropdown, NOT for Sidebar filtering)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const { data } = await axiosInstance.get(`/products/search-suggestions?q=${query}`);
          if (data.success) setSuggestions(data.suggestions);
        } catch (err) { console.error(err); } 
        finally { setIsSearching(false); }
      } else {
        setSuggestions([]);
      }
    }, 500); 
    
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const trackSearchHistory = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    try {
      let guestId = localStorage.getItem('guestId');
      await axiosInstance.post('/history/add', { 
        type: 'search', 
        searchQuery: searchTerm.trim(),
        guestId: guestId 
      });
    } catch (err) { console.error(err); }
  };

  // 3. STRICT SUBMIT (Triggers Sidebar/Results in Parent)
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      await trackSearchHistory(query);
      onSearch(query.trim()); // Sends data to ShopHome
    } else {
      onSearch(''); 
    }
  };

  // 4. CLEAR SEARCH
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    onSearch(''); 
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {/* ⚡ Theme Color on Focus */}
          <Search className="w-[18px] h-[18px] text-white/40 group-focus-within:text-[var(--theme-primary)] transition-colors duration-300" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setShowDropdown(true); if(!query) fetchRecentSearches(); }}
          placeholder={placeholder}
          // ⚡ Theme Borders and Glassmorphism 
          className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-12 py-3 rounded-full focus:outline-none focus:border-[var(--theme-primary)] focus:bg-[var(--theme-bg-dark)] transition-all duration-300 placeholder-white/30 text-[13px] font-medium backdrop-blur-md shadow-inner"
          autoComplete="off"
        />
        
        {/* Clear Button */}
        {query && (
          <button type="button" onClick={handleClear} className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-[var(--theme-primary)] text-white/60 hover:text-[var(--theme-bg-dark)] rounded-full transition-all cursor-pointer z-10">
            <X size={13} strokeWidth={3}/>
          </button>
        )}

        {isSearching && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2">
             <div className="w-4 h-4 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </form>

      {/* ⚡ THEMED DROPDOWN MAGIC ⚡ */}
      {showDropdown && (query.trim() ? suggestions.length > 0 : recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[var(--theme-bg-dark)] border border-white/10 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden backdrop-blur-2xl animate-fade-in">
          
          {/* RECENT SEARCHES */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-5">
              <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 px-2 flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Searches
              </h4>
              <ul className="space-y-1">
                {recentSearches.map((term, idx) => (
                  <li 
                    key={idx}
                    onClick={() => { setQuery(term); setShowDropdown(false); onSearch(term); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-white/70 hover:bg-[var(--theme-primary)]/10 hover:text-[var(--theme-primary)] cursor-pointer rounded-xl transition-all"
                  >
                    <Clock className="w-3.5 h-3.5 opacity-50" /> {term}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LIVE SUGGESTIONS */}
          {query.trim() && suggestions.length > 0 && (
            <ul className="py-3">
              {suggestions.map((item) => (
                <li 
                  key={item._id}
                  onClick={async () => {
                    setQuery(item.name);
                    setShowDropdown(false);
                    await trackSearchHistory(item.name);
                    onSearch(item.name); // 👈 Suggestion click triggers Parent Search
                  }}
                  className="px-6 py-3 hover:bg-white/5 cursor-pointer flex justify-between items-center group border-b border-white/5 last:border-0 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-[13.5px] font-semibold text-white/90 group-hover:text-[var(--theme-primary)] transition-colors truncate">
                      {item.name}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40 mt-1">
                      <span className="text-[var(--theme-primary)] font-bold">{item.brand}</span> • {item.category}
                    </div>
                  </div>
                  <div className="text-xs font-black text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 px-3 py-1.5 rounded-lg group-hover:bg-[var(--theme-primary)] group-hover:text-[var(--theme-bg-dark)] transition-all">
                    ₹{item.price?.toLocaleString('en-IN')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;