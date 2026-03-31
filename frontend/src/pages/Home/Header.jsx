
import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingBag, ChevronDown, Heart, Menu, X, User, 
  Package, MapPin, CreditCard, Wallet, Ticket, Star, Bell, LogOut, ChevronRight, Briefcase
} from "lucide-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';

/** * NOTE: Mocks for preview */
const useAuth = () => ({ 
  user: { name: "User" }, 
  logout: () => console.log("Logged out") 
});
const axiosInstance = { 
  get: () => Promise.resolve({ data: { success: true, cart: { items: [] } } }) 
};

// SearchBar component
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
  default: { id: "default", accent: "#d3b574" },
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const theme = themes.default;

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

  const SidebarItem = ({ icon: Icon, label, to, isActive = false }) => (
    <Link 
      to={to} 
      className={`relative flex items-center justify-between px-6 py-3 text-[12px] font-semibold transition-all group/item
        ${isActive ? 'bg-zinc-50 text-black border-r-4 border-blue-600' : 'text-zinc-700 hover:bg-zinc-50 hover:text-black'}
      `}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={isActive ? "text-black" : "text-zinc-500 group-hover/item:text-black"} />
        <span className="tracking-tight">{label}</span>
      </div>
      {!isActive && <ChevronRight size={14} className="text-zinc-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />}
    </Link>
  );

  const SectionLabel = ({ children }) => (
    <div className="px-6 pt-5 pb-2 text-[10px] font-bold text-zinc-500 tracking-[0.08em] uppercase">
      {children}
    </div>
  );

  return (
    <div className="font-['Montserrat']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        .promo-bar { position: fixed; top: 0; left: 0; width: 100%; min-height: 40px; display: flex; align-items: center; justify-content: center; z-index: 300; background: #000; color: #fff; font-size: 9px; font-weight: 600; letter-spacing: 0.35em; text-transform: uppercase; padding: 8px 10px; }
        .navbar { position: fixed; top: 40px; left: 0; width: 100%; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 8px 80px; background: #121212; height: 70px; border-bottom: 1px solid #1a1a1a; }
        .nav-center { display: flex; align-items: center; gap: 30px; position: absolute; left: 50%; transform: translateX(-50%); }
        .nav-link { color: #999; text-decoration: none; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; transition: color 0.2s; display: flex; align-items: center; gap: 4px; }
        .nav-link:hover { color: #fff; }
        .cart-badge { position: absolute; top: -7px; right: -8px; background: ${theme.accent}; color: #000; font-size: 8px; font-weight: 800; width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          z-index: 600;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 100px;
        }

        @media (max-width: 1024px) { 
          .navbar { padding: 8px 15px; } 
          .nav-center { display: none; } 
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
            <h2 className="text-[#d3b574] font-serif text-2xl mb-8 text-center italic tracking-wider">What are you looking for?</h2>
            <SearchBar onSearchSuccess={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      <div className="promo-bar">Complimentary Delivery on orders above ₹10,000 &nbsp;|&nbsp; 100% Authentic Products</div>

      <nav className="navbar">
        {/* LEFT — Menu Bar (Hamburger) & Logo (Gap ke saath left aligned) */}
        <div className="flex items-center">
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open Menu">
            <Menu size={24} color="white" />
          </button>
          
          <Link to="/" className="flex items-center ml-4 lg:ml-0">
            <img src="/Truee_Luxury_Logo.png" alt="logo" className="h-[32px] lg:h-[45px] w-auto object-contain" />
          </Link>
        </div>

        {/* CENTER — Nav Links (Desktop Only) */}
        <div className="nav-center">
          {['Speakers', 'Earphone', 'Headphone', 'Smartwatch', 'Home Theater'].map(item => (
            <Link key={item} to="/shop" className="nav-link">{item}</Link>
          ))}
          <button className="nav-link">Brands <ChevronDown size={11} /></button>
        </div>

        {/* RIGHT — Icons */}
        <div className="flex items-center gap-5">
          <button onClick={() => navigate('/wishlist')} className="text-zinc-500 hover:text-white transition-colors" aria-label="Wishlist">
            <Heart size={18} />
          </button>

          <div className="group relative">
            <button className="text-zinc-500 hover:text-white transition-colors p-1" onClick={() => user ? navigate("/profile") : navigate("/login")} aria-label="User Profile">
              <User size={18} />
            </button>
            {user && (
              <div className="absolute top-[calc(100%+10px)] right-0 w-[280px] bg-white rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[500] origin-top-right overflow-hidden border border-zinc-200">
                <div className="pt-2">
                  <SidebarItem icon={ShoppingBag} label="My Orders" to="/cart" />
                </div>
                <div className="border-t border-zinc-100 mt-2">
                  <SectionLabel>Account Settings</SectionLabel>
                  <SidebarItem icon={User} label="Profile Information" to="/profile" isActive={location.pathname === '/profile'} />
                  <SidebarItem icon={MapPin} label="Manage Addresses" to="/profile" />
                </div>
                <div className="border-t border-zinc-100 mt-2">
                  <SectionLabel>Personal Collection</SectionLabel>
                  <SidebarItem icon={CreditCard} label="My Coupons" to="/profile" />
                  <SidebarItem icon={Star} label="Reviews & Ratings" to="/profile" />
                  <SidebarItem icon={Heart} label="Wishlist" to="/wishlist" />
                </div>
                <div className="mt-2 border-t border-zinc-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-[12px] font-bold text-black hover:bg-zinc-50 transition-colors">
                    <LogOut size={18} className="text-zinc-700" />
                    <span className="uppercase tracking-widest text-red-500">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setIsSearchOpen(true)} className="text-zinc-500 hover:text-white transition-colors" aria-label="Search">
            <Search size={18} />
          </button>
          
          <button onClick={() => navigate('/cart')} className="relative" aria-label="Cart">
            <ShoppingBag size={20} color="#777" />
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[500] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 w-[280px] h-full bg-[#121212] p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <span className="text-white text-xs font-bold tracking-[0.3em]">MENU</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} color="white" /></button>
            </div>
            <div className="flex flex-col gap-6">
              {['Speakers', 'Headphones', 'Smartwatches'].map(link => (
                <Link key={link} to="/shop" className="text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800 pb-4" onClick={() => setIsMobileMenuOpen(false)}>{link}</Link>
              ))}
              {user ? (
                <button onClick={handleLogout} className="text-red-500 text-xs font-bold uppercase tracking-widest text-left">Logout</button>
              ) : (
                <Link to="/login" className="text-white text-xs font-bold uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Login / Sign Up</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { 
//   Search, ShoppingBag, ChevronDown, Heart, Menu, X, User, 
//   MapPin, Star, LogOut, ChevronRight, CreditCard
// } from "lucide-react";
// import { Link, useNavigate, useLocation } from 'react-router-dom';

// // Mocks (Inhe apne asli context/api se replace kar lena)
// const useAuth = () => ({ user: { name: "User" }, logout: () => {} });
// const axiosInstance = { get: () => Promise.resolve({ data: { success: true, cart: { items: [] } } }) };

// const SearchBar = ({ onSearchSuccess }) => (
//   <div className="relative w-full">
//     <input 
//       type="text" 
//       placeholder="Search for luxury products..." 
//       className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" 
//     />
//     <button onClick={onSearchSuccess} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">Search</button>
//   </div>
// );

// export default function Header() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     const fetchCartData = async () => {
//       try {
//         const { data } = await axiosInstance.get('/cart');
//         if (data.success) setCartCount(data.cart?.items?.length || 0);
//       } catch (err) { setCartCount(0); }
//     };
//     fetchCartData();
//   }, []); 

//   const handleLogout = () => { logout(); navigate('/'); };

//   const SidebarItem = ({ icon: Icon, label, to, isActive = false }) => (
//     <Link to={to} className={`relative flex items-center justify-between px-6 py-3 text-[12px] font-semibold transition-all group/item ${isActive ? 'bg-zinc-50 text-black border-r-4 border-blue-600' : 'text-zinc-700 hover:bg-zinc-50 hover:text-black'}`}>
//       <div className="flex items-center gap-4"><Icon size={18} /><span className="tracking-tight">{label}</span></div>
//       {!isActive && <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100" />}
//     </Link>
//   );

//   return (
//     <div className="font-['Montserrat']">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
//         .promo-bar { 
//           position: fixed; top: 0; left: 0; width: 100%; min-height: 40px; 
//           display: flex; align-items: center; justify-content: center; z-index: 300; 
//           background: #000; color: #fff; font-size: 9px; font-weight: 600; 
//           letter-spacing: 0.35em; text-transform: uppercase; padding: 8px 10px; 
//         }
        
//         .navbar { 
//           position: fixed; top: 40px; left: 0; width: 100%; z-index: 200; 
//           display: flex; align-items: center; justify-content: space-between; 
//           padding: 8px 80px; height: 70px;
//           background: var(--primary-bg); /* Normal me #121212 rahega */
//           border-bottom: 1px solid var(--border-color); 
//         }

//         .nav-link { 
//           color: var(--text-main); /* Normal me #999 rahega */
//           text-decoration: none; font-size: 11px; font-weight: 600; 
//           letter-spacing: 0.18em; text-transform: uppercase; transition: color 0.2s; 
//           display: flex; align-items: center; gap: 4px;
//         }
//         .nav-link:hover { color: #fff; }

//         .cart-badge { 
//           position: absolute; top: -7px; right: -8px; 
//           background: var(--accent); /* Normal me Luxury Gold */
//           color: #000; font-size: 8px; font-weight: 800; width: 14px; height: 14px; 
//           border-radius: 50%; display: flex; align-items: center; justify-content: center; 
//         }

//         @media (max-width: 1024px) { .navbar { padding: 8px 15px; } .nav-center { display: none; } }
//       `}</style>

//       {/* SEARCH OVERLAY */}
//       {isSearchOpen && (
//         <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[600] flex flex-col items-center pt-24">
//           <button onClick={() => setIsSearchOpen(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors"><X size={32} /></button>
//           <div className="w-full max-w-3xl px-6 text-center">
//             <h2 className="text-[var(--accent)] font-serif text-2xl mb-8 italic tracking-wider">What are you looking for?</h2>
//             <SearchBar onSearchSuccess={() => setIsSearchOpen(false)} />
//           </div>
//         </div>
//       )}

//       <div className="promo-bar">Complimentary Delivery on orders above ₹10,000 | 100% Authentic</div>

//       <nav className="navbar">
//         <div className="flex items-center">
//           <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} color="white" /></button>
//           <Link to="/" className="ml-4 lg:ml-0"><img src="/Truee_Luxury_Logo.png" alt="logo" className="h-[32px] lg:h-[45px] object-contain" /></Link>
//         </div>

//         <div className="hidden lg:flex items-center gap-[30px] absolute left-1/2 -translate-x-1/2">
//           {['Speakers', 'Earphone', 'Headphone', 'Smartwatch', 'Home Theater'].map(item => (
//             <Link key={item} to="/shop" className="nav-link">{item}</Link>
//           ))}
//           <button className="nav-link">Brands <ChevronDown size={11} /></button>
//         </div>

//         <div className="flex items-center gap-5">
//           <button onClick={() => navigate('/wishlist')} className="text-zinc-500 hover:text-white transition-colors"><Heart size={18} /></button>
//           <div className="group relative">
//             <button className="text-zinc-500 hover:text-white transition-colors p-1" onClick={() => user ? navigate("/profile") : navigate("/login")}><User size={18} /></button>
//             {user && (
//               <div className="absolute top-[calc(100%+10px)] right-0 w-[280px] bg-white rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[500] origin-top-right overflow-hidden border border-zinc-200">
//                 <div className="pt-2"><SidebarItem icon={ShoppingBag} label="My Orders" to="/cart" /></div>
//                 <div className="mt-2 border-t border-zinc-100">
//                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-[12px] font-bold text-black hover:bg-zinc-50 transition-colors"><LogOut size={18} className="text-zinc-700" /><span className="uppercase tracking-widest text-red-500">Logout</span></button>
//                 </div>
//               </div>
//             )}
//           </div>
//           <button onClick={() => setIsSearchOpen(true)} className="text-zinc-500 hover:text-white transition-colors"><Search size={18} /></button>
//           <button onClick={() => navigate('/cart')} className="relative">
//             <ShoppingBag size={20} color="#777" />
//             <span className="cart-badge">{cartCount}</span>
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Drawer */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 z-[500] lg:hidden">
//           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
//           <div className="absolute top-0 left-0 w-[280px] h-full bg-[#121212] p-6 shadow-2xl flex flex-col">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-white text-xs font-bold tracking-[0.3em]">MENU</span>
//               <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} color="white" /></button>
//             </div>
//             <div className="flex flex-col gap-6">
//               {['Speakers', 'Headphones', 'Smartwatches'].map(link => (
//                 <Link key={link} to="/shop" className="text-zinc-400 text-xs uppercase tracking-widest border-b border-zinc-800 pb-4" onClick={() => setIsMobileMenuOpen(false)}>{link}</Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }