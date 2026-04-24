import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Star, ShoppingBag, X, Menu, History, Clock, LogOut, Package, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Cart from '../Cart';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

// 🚀 Full Static Brands List
const staticBrands = [
  "Noise", "Amazfit", "Marshall", "Devialet", "Sonos", "Bang & Olufsen", "Jlab", "Truee", 
  "Sony", "Shokz", "Withings", "Therabody", "Hurom", "Bowers & Wilkins", 
  "JBL", "Bose", "Harman Kardon", "Arcam", "JVC", "Formovie", "ViewSonic"
];

// ⚡ SMART CATEGORIES MAP
const NAV_CATEGORIES = [
  { 
    label: 'SPEAKERS', 
    keyword: 'Speaker',
    sub: [
      { label: 'Karaoke Speakers', keyword: 'Karaoke' },
      { label: 'Home Theater Speakers', keyword: 'Home Theater' },
      { label: 'Party Speakers', keyword: 'Party' },
      { label: 'Portable Speakers', keyword: 'Portable' },
      { label: 'Smart Speaker', keyword: 'Smart Speaker' },
      { label: 'Power Speakers', keyword: 'Power' }
    ]
  },
  { 
    label: 'HEADPHONES', 
    keyword: 'Headphone',
    sub: [
      { label: 'Wired Headphones', keyword: 'Wired Headphone' },
      { label: 'Wireless Headphones', keyword: 'Wireless Headphone' }
    ] 
  },
  { 
    label: 'EARPHONES', 
    keyword: 'Earphone',
    sub: [
      { label: 'Wired Earphones', keyword: 'Wired Earphone' },
      { label: 'Wireless Earphones', keyword: 'Wireless Earphone' },
      { label: 'Truly Wireless Earphones', keyword: 'TWS' }
    ]
  },
  { 
    label: 'SMARTWATCHES', 
    keyword: 'Smartwatch',
    sub: [
      { label: 'Budget', keyword: 'Budget' },
      { label: 'Premium', keyword: 'Premium' }
    ] 
  },
  { 
    label: 'HOME THEATER', 
    keyword: 'Home Theater',
    sub: [
      { label: 'Home Theater Setup', keyword: 'Home Theater' },
      { label: 'Soundbars', keyword: 'Soundbar' },
      { label: 'Subwoofers', keyword: 'Subwoofer' },
      { label: 'Amplifier', keyword: 'Amplifier' },
      { label: 'Projector', keyword: 'Projector' }
    ] 
  }
];

const SearchInline = ({ onClose, navigate }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if(query.trim()) {
      await trackSearchHistory(query);
      onClose();
      navigate('/shop', { state: { search: query } });
    }
  };

  const handleSelect = async (term) => {
    setQuery(term);
    await trackSearchHistory(term);
    onClose();
    navigate('/shop', { state: { search: term } });
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 relative z-50" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="flex items-center gap-4 animate-slide-in-right bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
        <Search className="text-zinc-500" size={18} />
        <input 
          autoFocus
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { setShowDropdown(true); if(!query) fetchRecentSearches(); }}
          placeholder="Search luxury products..." 
          className="w-full bg-transparent border-none text-black text-xs lg:text-sm focus:outline-none focus:ring-0 placeholder-zinc-400 tracking-wider" 
        />
        {isSearching && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>}
        <button type="button" onClick={onClose} className="text-zinc-500 hover:text-black transition-colors cursor-pointer bg-transparent border-none">
          <X size={20} />
        </button>
      </form>

      {showDropdown && (query.trim() ? suggestions.length > 0 : recentSearches.length > 0) && (
        <div className="absolute top-[120%] left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden text-black animate-fade-in">
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2 flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Searches
              </h4>
              <ul className="space-y-1">
                {recentSearches.map((term, idx) => (
                  <li 
                    key={idx}
                    onClick={() => handleSelect(term)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-gray-700 hover:bg-gray-100 cursor-pointer rounded-xl transition-all"
                  >
                    <Clock className="w-3.5 h-3.5 opacity-50" /> {term}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {query.trim() && suggestions.length > 0 && (
            <ul className="py-2">
              {suggestions.map((item) => (
                <li 
                  key={item._id}
                  onClick={() => handleSelect(item.name)}
                  className="px-6 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group border-b border-gray-100 last:border-0 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-[13px] font-semibold text-gray-900 group-hover:text-black transition-colors truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                      <span className="text-black font-bold">{item.brand}</span> • {item.category}
                    </div>
                  </div>
                  <div className="text-[11px] font-black text-black bg-gray-100 px-3 py-1.5 rounded-lg group-hover:bg-gray-200 transition-all">
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

export default function Header1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // SCROLL REVEAL LOGIC
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  });

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const { data } = await axiosInstance.get('/cart');
        if (data.success) {
          setCartCount(data.cart?.items?.length || 0);
        }
      } catch (err) {
        setCartCount(0);
      }
    };

    fetchCartData();

    const handleCartUpdate = (e) => {
      setIsCartOpen(true); 
      if (e.detail?.increase) {
        setCartCount(prev => prev + e.detail.increase);
      } else {
        fetchCartData();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <>
    {/* Placeholder div to prevent content overlap */}
    <div className="h-[100px] w-full" />
    
    <motion.header 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -20, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ type: "spring", stiffness: 120, damping: 25, mass: 0.8 }}
      className="fixed top-0 left-0 w-full bg-white flex items-center justify-between px-6 md:px-12 h-[100px] flex-shrink-0 z-[999] border-b border-gray-100"
    >
      
      {/* Mobile Hamburger Menu Icon */}
      <div className="flex-1 xl:hidden">
        <button 
          className="text-black hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {/* LOGO */}
      <div className="flex-1 xl:flex-none flex justify-center xl:justify-start">
        <Link to="/" className="flex flex-col items-center justify-center mt-2 group w-[120px] text-center cursor-pointer">
          <img src="/Truee_Luxury_Logo.png" alt="Truee" className="h-10 md:h-12 w-auto object-contain brightness-0" />    
          <span className="text-[9px] font-bold tracking-[0.4em] uppercase mt-1 text-black opacity-80 group-hover:opacity-100 transition-opacity">
            TRUEE
          </span>
        </Link>
      </div>

      {/* Center Navigation Links or Search */}
      {isSearchOpen ? (
        <SearchInline onClose={() => setIsSearchOpen(false)} navigate={navigate} />
      ) : (
        <nav className="hidden xl:flex items-center h-full gap-3 2xl:gap-6 relative z-50">
          {NAV_CATEGORIES.map((cat) => {
            const isActive = location.pathname === '/shop' && location.state?.search === cat.keyword;
            return (
              <div key={cat.label} className="h-full flex items-center relative group">
                <button 
                  onClick={() => navigate('/shop', { state: { search: cat.keyword } })}
                  className={`font-semibold text-[10px] xl:text-[11px] tracking-widest uppercase transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none relative py-2 after:content-[''] after:absolute after:-bottom-0 after:left-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 ${isActive ? 'text-black after:w-full' : 'text-[#6b6b6b] group-hover:text-black after:w-0 group-hover:after:w-full'}`}
                >
                  {cat.label}
                  {cat.sub.length > 0 && <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />}
                </button>

                {cat.sub.length > 0 && (
                  <div className="absolute top-[65%] left-1/2 -translate-x-1/2 pt-6 w-56 z-[10] opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2">
                      <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">CATEGORIES</span>
                      </div>
                      <ul className="w-full">
                        {cat.sub.map((subItem, idx) => (
                          <li key={idx}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/shop', { state: { search: subItem.keyword } });
                              }}
                              className="w-full text-left px-4 py-2.5 text-[11px] font-semibold text-gray-700 hover:text-black hover:bg-gray-50 transition-colors uppercase tracking-wider cursor-pointer border-b border-gray-50 last:border-0 bg-transparent"
                            >
                              {subItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="h-full flex items-center relative group">
            <button 
              onClick={() => navigate('/brands')}
              className={`font-semibold text-[10px] xl:text-[11px] tracking-widest uppercase transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none relative py-2 after:content-[''] after:absolute after:-bottom-0 after:left-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 ${location.pathname === '/brands' ? 'text-black after:w-full' : 'text-[#6b6b6b] group-hover:text-black after:w-0 group-hover:after:w-full'}`}
            >
              BRANDS
              <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
            </button>
            
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 pt-6 w-64 z-[10] opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-out">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2">
                <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Brand</span>
                </div>
                <ul className="w-full max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {staticBrands.map((brandName, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => {
                          navigate('/shop', { state: { search: brandName } });
                        }}
                        className="w-full text-left px-4 py-2.5 text-[11px] font-semibold text-gray-700 hover:text-black hover:bg-gray-50 transition-colors uppercase tracking-wider cursor-pointer bg-transparent border-none"
                      >
                        {brandName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Right Action Icons */}
      <div className="flex-1 xl:flex-none flex items-center justify-end gap-4 md:gap-5 h-full relative z-50">
        <button 
          className="text-black hover:opacity-60 transition-opacity cursor-pointer hidden sm:block bg-transparent border-none" 
          aria-label="Search"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search size={18} strokeWidth={1.5} />
        </button>

        <div className="h-full flex items-center relative group">
          <Link to={user ? "/profile" : "/login"} className="text-black hover:opacity-60 transition-opacity cursor-pointer flex items-center gap-1" aria-label="Profile">
            <User size={18} strokeWidth={1.5} />
            {user && <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />}
          </Link>
          
          {user && (
            <div className="absolute top-[65%] right-0 pt-6 w-56 z-[100] opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-out">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-semibold text-black truncate">{user.name || user.email || 'User'}</p>
                </div>
                <div className="py-2">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 transition-colors">
                    <User size={16} className="text-gray-400" />
                    My Profile
                  </Link>
                  <Link to="/profile?tab=orders" className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 transition-colors">
                    <Package size={16} className="text-gray-400" />
                    Orders
                  </Link>
                </div>
                <div className="py-2 border-t border-gray-50">
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none outline-none">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Link to="/wishlist" className="hidden sm:block text-black hover:opacity-60 transition-opacity cursor-pointer" aria-label="Wishlist">
          <Star size={18} strokeWidth={1.5} />
        </Link>

        <button onClick={() => setIsCartOpen(true)} className="relative flex items-center justify-center text-black hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none outline-none">
          <ShoppingBag size={18} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-[100px] left-0 w-full bg-white shadow-lg xl:hidden flex flex-col py-4 z-40 border-t border-zinc-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="px-6 pb-4 mb-4 border-b border-zinc-100 flex items-center gap-2">
             <Search size={16} className="text-zinc-400" />
             <input 
               type="text" 
               placeholder="Search..." 
               className="w-full bg-transparent border-none text-sm outline-none"
               onKeyDown={(e) => {
                 if(e.key === 'Enter' && e.target.value.trim()) {
                   setIsMobileMenuOpen(false);
                   navigate('/shop', { state: { search: e.target.value } });
                 }
               }}
             />
          </div>
          
          {NAV_CATEGORIES.map((cat) => (
            <div key={cat.label} className="w-full">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/shop', { state: { search: cat.keyword } });
                }}
                className="w-full text-left px-6 py-3 text-[#6b6b6b] hover:text-black hover:bg-zinc-50 font-semibold text-[11px] tracking-widest uppercase transition-colors cursor-pointer bg-transparent border-none"
              >
                {cat.label}
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/brands');
            }}
            className="text-left px-6 py-3 text-[#6b6b6b] hover:text-black hover:bg-zinc-50 font-semibold text-[11px] tracking-widest uppercase transition-colors cursor-pointer bg-transparent border-none"
          >
            BRANDS
          </button>
        </div>
      )}
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.header>
    </>
  );
}