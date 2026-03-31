import React, { useState, useEffect, useRef } from 'react';
import { History, Search, Clock, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance'; 

// ⚡ Props: onSearch (parent ko batane ke liye), initialQuery
const SearchBar = ({ onSearch }) => {
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

  // ⚡ 2. Debounced Search & Suggestions
  // Isse har character pe API call nahi jayegi
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        // Parent ko search term bhejo (In-page filtering)
        onSearch(query.trim());
        
        // Fetch suggestions for dropdown
        setIsSearching(true);
        try {
          const { data } = await axiosInstance.get(`/products/search-suggestions?q=${query}`);
          if (data.success) setSuggestions(data.suggestions);
        } catch (err) { console.error(err); } 
        finally { setIsSearching(false); }
      } else {
        onSearch(''); // Clear results if query is empty
        setSuggestions([]);
      }
    }, 500); // 500ms wait before API/Filter
    
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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      await trackSearchHistory(query);
      onSearch(query.trim()); // Final search
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* ⚡ Theme Color Sync */}
          <Search className="w-4 h-4 text-white/30 group-focus-within:text-theme-primary transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setShowDropdown(true); if(!query) fetchRecentSearches(); }}
          placeholder="Search luxury products..."
          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-10 py-2.5 rounded-full focus:outline-none focus:border-theme-primary transition-all placeholder-white/20 text-sm backdrop-blur-md"
          autoComplete="off"
        />
        
        {/* Clear Button */}
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-10 top-3 text-white/30 hover:text-white">
            <X size={14}/>
          </button>
        )}

        {isSearching && (
          <div className="absolute right-4 top-3">
             <div className="w-4 h-4 border-2 border-theme-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </form>

      {/* DROPDOWN MAGIC */}
      {showDropdown && (query.trim() ? suggestions.length > 0 : recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-theme-bg-dark border border-white/5 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
          
          {/* RECENT SEARCHES */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-4">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 px-2 flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Searches
              </h4>
              <ul className="space-y-1">
                {recentSearches.map((term, idx) => (
                  <li 
                    key={idx}
                    onClick={() => { setQuery(term); setShowDropdown(false); onSearch(term); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-theme-primary cursor-pointer rounded-lg transition-all"
                  >
                    <Clock className="w-3.5 h-3.5 opacity-40" /> {term}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LIVE SUGGESTIONS */}
          {query.trim() && suggestions.length > 0 && (
            <ul className="py-2">
              {suggestions.map((item) => (
                <li 
                  key={item._id}
                  onClick={async () => {
                    setQuery(item.name);
                    setShowDropdown(false);
                    await trackSearchHistory(item.name);
                    onSearch(item.name);
                  }}
                  className="px-5 py-3 hover:bg-white/5 cursor-pointer flex justify-between items-center group border-b border-white/5 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white group-hover:text-theme-primary transition-colors truncate">
                      {item.name}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-white/30 mt-1">
                      <span className="text-theme-primary/60 font-bold">{item.brand}</span> • {item.category}
                    </div>
                  </div>
                  <div className="text-xs font-black text-white/40 group-hover:text-white ml-4">
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