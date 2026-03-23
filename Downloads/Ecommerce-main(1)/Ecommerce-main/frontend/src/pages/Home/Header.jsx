


import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, ChevronDown, Palette, Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import SearchBar from '../../components/SearchBar'; // 👈 Aapka puraana SearchBar

const themes = {
  default: { id: "default", name: "Normal (Classic)", accent: "#d3b574" },
  eid:     { id: "eid",     name: "Eid Theme",        accent: "#E5C158" },
  holi:    { id: "holi",    name: "Holi Theme",       accent: "#FF3366" },
  diwali:  { id: "diwali",  name: "Diwali Theme",      accent: "#FFB347" },
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 👈 Search Overlay control
  const [cartCount, setCartCount] = useState(0);

  const theme = themes[currentTheme];

  // ── FETCH REAL CART COUNT ──
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

  // ✅ UPDATED LISTENER
  const handleCartUpdate = (e) => {
    if (e.detail?.increase) {
      // 👉 Direct count increase
      setCartCount(prev => prev + e.detail.increase);
    } else {
      // fallback: API call
      fetchCartData();
    }
  };

  window.addEventListener('cartUpdated', handleCartUpdate);

  return () => window.removeEventListener('cartUpdated', handleCartUpdate);
}, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        .promo-bar {
          background: #000000; color: #ffffff; font-size: 9px; font-weight: 600;
          letter-spacing: 0.35em; text-transform: uppercase; text-align: center; padding: 10px 16px;
        }

        .navbar {
          position: sticky; top: 0; z-index: 100; display: flex; align-items: center;
          justify-content: space-between; padding: 8px 17px; background: #121212;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .nav-center {
          display: flex; align-items: center; gap: 40px; position: absolute;
          left: 50%; transform: translateX(-50%);
        }

        .nav-link {
          color: #999; text-decoration: none; font-size: 11px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase; transition: color 0.2s;
          background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 3px;
        }
        .nav-link:hover { color: #ffffff; }

        .cart-badge {
          position: absolute; top: -7px; right: -8px; background: ${theme.accent};
          color: #000; font-size: 8px; font-weight: 800; width: 14px; height: 14px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }

        /* ── SEARCH OVERLAY ── */
        .search-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(10, 10, 10, 0.95); backdrop-blur: 10px;
          z-index: 200; display: flex; flex-direction: column; align-items: center;
          padding-top: 100px; transition: all 0.3s ease;
        }

        @media (max-width: 1024px) {
          .nav-center { display: none; }
        }
      `}</style>

      {/* ── SEARCH OVERLAY (FLIPKART STYLE INTEGRATION) ── */}
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
            {/* 👇 Aapka puraana SearchBar yahan use ho raha hai */}
            <SearchBar onSearchSuccess={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* ── PROMO BAR ── */}
      <div className="promo-bar">
        Complimentary Delivery on orders above ₹10,000 &nbsp;|&nbsp; 100% Authentic Products
      </div>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        {/* LEFT — Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button className="icon-btn hamburger lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={22} color="white" /> : <Menu size={22} color="white" />}
          </button>
          <Link to="/" className="logo-wrap">
            <img src="/Truee_Luxury_Logo.png" alt="logo" style={{ height: "60px", width: "auto", objectFit: "contain" }} />
          </Link>
        </div>

        {/* CENTER — Nav Links */}
        <div className="nav-center">
          <Link to="/shop" className="nav-link">The Shop</Link>
          <Link to="/products" className="nav-link">Collection</Link>
          
          {/* USER ACCOUNT LOGIC */}
          {user ? (
            <div className="group relative">
                <button className="nav-link" onClick={() => navigate("/account")}>

                My Account <ChevronDown size={11} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-zinc-800 rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/account" className="block px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">Profile</Link>
                <Link to="/cart" className="block px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">My Orders</Link>
                <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-xs text-red-400 hover:bg-zinc-800 transition-colors">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link">Sign In</Link>
          )}

          <button className="nav-link">Brands <ChevronDown size={11} /></button>
        </div>

        {/* RIGHT — Icons */}
        <div className="nav-right" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          
          {/* Theme Palette */}
          <div className="theme-wrap" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} style={{ color: '#777', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Palette size={18} />
            </button>
            {isThemeMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', borderRadius: '4px', padding: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', zIndex: 300, minWidth: '150px' }}>
                {Object.values(themes).map((t) => (
                  <button key={t.id} onClick={() => { setCurrentTheme(t.id); setIsThemeMenuOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px', border: 'none', background: 'none', fontSize: '12px', cursor: 'pointer', color: '#333' }}>
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger — Opens Overlay */}
          <button className="icon-btn" onClick={() => setIsSearchOpen(true)} style={{ color: '#777', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Search size={18} />
          </button>

          {/* Cart Bag */}
          <button className="cart-btn" onClick={() => navigate('/cart')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={20} color="#777" />
              <span className="cart-badge">{cartCount}</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d0d] border-t border-zinc-800 flex flex-col p-6 gap-4">
          <Link to="/shop" className="text-zinc-400 text-xs uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link to="/login" className="text-zinc-400 text-xs uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
          <button className="text-zinc-400 text-xs uppercase tracking-widest text-left" onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}>Search</button>
        </div>
      )}
    </div>
  );
}