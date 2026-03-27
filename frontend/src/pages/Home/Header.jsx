
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ChevronDown, Heart, Menu, X, User } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';

/** * NOTE: The following mocks are for the Canvas preview to work. 
 * Please uncomment your actual imports and remove these mocks when using in your local project.
 */

// import { useAuth } from '../../context/AuthContext';
// import axiosInstance from '../../utils/axiosInstance';
// import SearchBar from '../../components/SearchBar';

const useAuth = () => ({ 
  user: { name: "User" }, 
  logout: () => console.log("Logged out") 
});

const axiosInstance = { 
  get: () => Promise.resolve({ data: { success: true, cart: { items: [] } } }) 
};

const SearchBar = ({ onSearchSuccess }) => (
  <div className="relative w-full">
    <input 
      type="text" 
      placeholder="Search for luxury products..." 
      className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#d3b574]" 
    />
    <button onClick={onSearchSuccess} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
      Search
    </button>
  </div>
);

const themes = {
  default: { id: "default", name: "Normal (Classic)", accent: "#d3b574" },
  eid:     { id: "eid",     name: "Eid Theme",        accent: "#E5C158" },
  holi:    { id: "holi",    name: "Holi Theme",       accent: "#FF3366" },
  diwali:  { id: "diwali",  name: "Diwali Theme",     accent: "#FFB347" },
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const theme = themes[currentTheme];

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
      if (e.detail?.increase) {
        setCartCount(prev => prev + e.detail.increase);
      } else {
        fetchCartData();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []); 

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        .promo-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 300;
          background: #000;
          color: #fff;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          text-align: center;
          padding: 8px 10px;
        }

        .navbar {
          position: fixed;
          top: 40px;
          left: 0;
          width: 100%;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 80px;
          background: #121212;
          height: 70px;
        }

        /* Desktop Nav Center */
        .nav-center {
          display: flex;
          align-items: center;
          gap: 30px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-link {
          color: #999;
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 3px;
          white-space: nowrap;
        }
        .nav-link:hover { color: #ffffff; }

        .cart-badge {
          position: absolute;
          top: -7px;
          right: -8px;
          background: ${theme.accent};
          color: #000;
          font-size: 8px;
          font-weight: 800;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          z-index: 400;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 100px;
        }

        /* MOBILE STYLES (Targeting max-width 1024px) */
        @media (max-width: 1024px) {
          .promo-bar {
            font-size: 7.5px;
            letter-spacing: 0.15em;
            padding: 6px 10px;
          }

          .navbar {
            padding: 8px 15px;
            height: 60px;
          }
          
          /* Hide desktop links */
          .nav-center {
            display: none;
          }

          /* Logo for mobile - centered absolutely */
          .logo-mobile-centered {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
          }

          /* Adjust icons gap for mobile to fit */
          .nav-right {
            gap: 16px !important;
          }
          
          .desktop-logo {
            display: none;
          }
        }

        @media (min-width: 1025px) {
          .logo-mobile-centered {
            display: none;
          }
        }
      `}</style>

      {/* ── SEARCH OVERLAY ── */}
      {isSearchOpen && (
        <div className="search-overlay">
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-3xl px-6">
            <h2 className="text-[#d3b574] font-serif text-2xl mb-8 text-center italic">What are you looking for?</h2>
            <SearchBar onSearchSuccess={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* ── PROMO BAR ── */}
      <div className="promo-bar" id="promo-bar">
        Complimentary Delivery on orders above ₹10,000 &nbsp;|&nbsp; 100% Authentic Products
      </div>

      {/* ── NAVBAR ── */}
      <nav className="navbar" id="navbar">
        {/* LEFT — Hamburger (Mobile Only) & Logo (Desktop Only) */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: '40px' }}>
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={24} color="white" />
          </button>
          
          <Link to="/" className="desktop-logo">
            <img src="/Truee_Luxury_Logo.png" alt="logo" style={{ height: "45px", width: "auto", objectFit: "contain" }} />
          </Link>
        </div>

        {/* CENTER — Logo (Mobile Only) */}
        <div className="logo-mobile-centered">
          <Link to="/">
            <img src="/Truee_Luxury_Logo.png" alt="logo" style={{ height: "35px", width: "auto", objectFit: "contain" }} />
          </Link>
        </div>

        {/* CENTER — Nav Links (Desktop Only) */}
        <div className="nav-center">
          <Link to="/shop" className="nav-link">Speakers</Link>
          <Link to="/products" className="nav-link">Earphone</Link>
          <Link to="/products" className="nav-link">Headphone</Link>
          <Link to="/products" className="nav-link">Smartwatch</Link>
          <Link to="/products" className="nav-link">Home Theater</Link>
          <button className="nav-link">Brands <ChevronDown size={11} /></button>
        </div>

        {/* RIGHT — Icons */}
        <div className="nav-right" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          
          {/* Heart / Wishlist */}
          <button onClick={() => navigate('/wishlist')} style={{ color: '#777', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Heart size={18} />
          </button>

          {/* User / Profile */}
          <div className="group relative">
            <button 
              className="nav-link" 
              onClick={() => user ? navigate("/profile") : navigate("/login")}
              style={{ color: '#777' }}
            >
              <User size={18} />
            </button>
            {user && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A1A1A] border border-zinc-800 rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[300]">
                <Link to="/profile" className="block px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">Profile</Link>
                <Link to="/cart" className="block px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">My Orders</Link>
                <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-xs text-red-400 hover:bg-zinc-800 transition-colors">Logout</button>
              </div>
            )}
          </div>

          {/* Search */}
          <button onClick={() => setIsSearchOpen(true)} style={{ color: '#777', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Search size={18} />
          </button>

          {/* Cart Bag */}
          <button onClick={() => navigate('/cart')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ShoppingBag size={20} color="#777" />
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[500] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 w-[280px] h-full bg-[#121212] p-6 flex flex-col gap-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold tracking-widest">MENU</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} color="white" /></button>
            </div>
            <Link to="/shop" className="text-zinc-400 text-sm uppercase tracking-widest border-b border-zinc-800 pb-3" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
            <Link to="/products" className="text-zinc-400 text-sm uppercase tracking-widest border-b border-zinc-800 pb-3" onClick={() => setIsMobileMenuOpen(false)}>Speakers</Link>
            <Link to="/products" className="text-zinc-400 text-sm uppercase tracking-widest border-b border-zinc-800 pb-3" onClick={() => setIsMobileMenuOpen(false)}>Headphones</Link>
            {!user && <Link to="/login" className="text-zinc-400 text-sm uppercase tracking-widest border-b border-zinc-800 pb-3" onClick={() => setIsMobileMenuOpen(false)}>Login / Sign Up</Link>}
            {user && <button onClick={handleLogout} className="text-red-400 text-sm uppercase tracking-widest text-left">Logout</button>}
          </div>
        </div>
      )}
    </div>
  );
}