import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; 
import { History, Search, Clock } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();
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

  // Fetch Recent Searches on mount/focus
  const fetchRecentSearches = async () => {
    try {
      let guestId = localStorage.getItem('guestId');
      let url = '/history?type=search';
      if (guestId) url += `&guestId=${guestId}`;

      const { data } = await axiosInstance.get(url);
      if (data.success) {
        const searches = data.history.map(item => item.searchQuery).filter(Boolean);
        setRecentSearches([...new Set(searches)].slice(0, 5)); // Top 5 recent
      }
    } catch (error) {
      console.error("Failed to load search history", error);
    }
  };

  // Live Suggestions Debounce
  useEffect(() => {
    if (!query.trim()) { 
      setSuggestions([]); 
      return; 
    }
    
    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get(`/products/search-suggestions?q=${query}`);
        if (data.success) { setSuggestions(data.suggestions); }
      } catch (err) { console.error(err); } finally { setIsSearching(false); }
    }, 300);
    
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
    } catch (err) { console.error("History Error", err); }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      await trackSearchHistory(query);
      navigate(`/search?q=${query}`);
    }
  };

  const handleFocus = () => {
    setShowDropdown(true);
    if (!query) fetchRecentSearches();
  };

  const createProductUrl = (item) => {
    const catSlug = item.category ? item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category';
    const brandSlug = item.brand ? item.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'brand';
    const nameSlug = item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product';
    return `/${catSlug}/${brandSlug}/${nameSlug}/p/${item._id}`;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-[#C8A253] transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search luxury collections..."
          className="w-full bg-zinc-900/50 border border-zinc-700 text-white pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:border-[#C8A253] transition-all placeholder-zinc-500 text-sm"
          autoComplete="off"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
             <div className="w-4 h-4 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </form>

      {/* DROPDOWN MAGIC */}
      {showDropdown && (query.trim() ? suggestions.length > 0 : recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          
          {/* SHOW RECENT SEARCHES IF QUERY IS EMPTY */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-3">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Searches
              </h4>
              <ul>
                {recentSearches.map((term, idx) => (
                  <li 
                    key={idx}
                    onClick={async () => {
                      setQuery(term);
                      setShowDropdown(false);
                      await trackSearchHistory(term);
                      navigate(`/search?q=${term}`);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-[#C8A253] cursor-pointer rounded-md transition-colors"
                  >
                    <Clock className="w-4 h-4 text-zinc-600" /> {term}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SHOW LIVE SUGGESTIONS IF TYPING */}
          {query.trim() && suggestions.length > 0 && (
            <ul className="py-1">
              {suggestions.map((item) => (
                <li 
                  key={item._id}
                  onClick={async () => {
                    setQuery('');
                    setShowDropdown(false);
                    await trackSearchHistory(item.name);
                    navigate(createProductUrl(item));
                  }}
                  className="px-5 py-3 hover:bg-zinc-800/80 cursor-pointer flex justify-between items-center group border-b border-zinc-800/30 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white group-hover:text-[#C8A253] transition-colors truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                      <span className="text-[#C8A253]/80 font-bold">{item.brand}</span> • {item.category}
                    </div>
                  </div>
                  
                  <div className="text-xs font-semibold text-zinc-400 group-hover:text-white ml-4">
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