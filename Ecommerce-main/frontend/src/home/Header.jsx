import { useState } from "react";
import { Search, ShoppingBag, ChevronDown, Palette, Menu, X } from "lucide-react";

const themes = {
  default: { id: "default", name: "Normal (Classic)", accent: "#d3b574" },
  eid:     { id: "eid",     name: "Eid Theme",        accent: "#E5C158" },
  holi:    { id: "holi",   name: "Holi Theme",        accent: "#FF3366" },
  diwali:  { id: "diwali", name: "Diwali Theme",      accent: "#FFB347" },
};

export default function Header() {
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const theme = themes[currentTheme];

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── PROMO BAR ── */
        .promo-bar {
          background: #000000;
          color: #ffffff;
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          text-align: center;
          padding: 10px 16px;
        }

        /* ── NAVBAR ── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 17px;
          background: #121212;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        /* ── LOGO PILLARS ── */
        .logo-wrap {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .logo-wrap:hover { opacity: 1; }
        .pillar {
          width: 2.5px;
          background: #c8c8c8;
          border-radius: 1px;
        }

        /* ── CENTER NAV ── */
        .nav-center {
          display: flex;
          align-items: center;
          gap: 52px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .nav-link {
          color: #999;
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
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
          padding: 0;
        }
        .nav-link:hover { color: #ffffff; }

        /* ── RIGHT ICONS ── */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .icon-btn {
          background: none;
          border: none;
          color: #777;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover { color: #fff; }

        /* ── CART ── */
        .cart-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Montserrat', sans-serif;
          transition: color 0.2s;
        }
        .cart-price {
          color: #777;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }
        .cart-btn:hover .cart-price { color: #fff; }
        .cart-btn:hover .cart-icon  { color: #fff; }
        .cart-icon { color: #777; transition: color 0.2s; }
        .cart-icon-wrap { position: relative; }
        .cart-badge {
          position: absolute;
          top: -7px;
          right: -8px;
          background: #d3b574;
          color: #000;
          font-size: 8px;
          font-weight: 800;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
        }

        /* ── THEME DROPDOWN ── */
        .theme-wrap { position: relative; }
        .theme-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 190px;
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 12px 48px rgba(0,0,0,0.6);
        }
        .theme-dropdown-header {
          padding: 10px 16px;
          background: #f2f2f2;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #888;
          border-bottom: 1px solid #e5e5e5;
          font-family: 'Montserrat', sans-serif;
        }
        .theme-option {
          display: block;
          width: 100%;
          text-align: left;
          padding: 11px 16px;
          font-size: 12px;
          font-weight: 500;
          font-family: 'Montserrat', sans-serif;
          background: #fff;
          border: none;
          cursor: pointer;
          color: #111;
          transition: background 0.15s;
        }
        .theme-option:hover { background: #f7f7f7; }

        /* ── MOBILE ── */
        .hamburger { display: none; }
        .mobile-menu {
          background: #0d0d0d;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 8px 0;
        }
        .mobile-link {
          display: block;
          color: #bbb;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 14px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-family: 'Montserrat', sans-serif;
          transition: color 0.2s;
        }
        .mobile-link:last-child { border-bottom: none; }
        .mobile-link:hover { color: #fff; }

        @media (max-width: 768px) {
          .navbar { padding: 14px 20px; }
          .nav-center { display: none; }
          .cart-price { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      {/* ── PROMO BAR ── */}
      <div className="promo-bar">
        Complimentary Delivery on orders above ₹10,000 &nbsp;|&nbsp; 100% Authentic Products
      </div>

      {/* ── NAVBAR ── */}
      <nav className="navbar">

        {/* LEFT — Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            className="icon-btn hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >

            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

         <div className="logo-wrap">
  <div className="logo-wrap">
  <img 
    src="/Truee_Luxury_Logo.png"
    alt="logo"
    style={{
      height: "70px",
      width: "auto",
      objectFit: "contain",
      display: "block"
    }}
  />
</div>
</div>
        </div>

        {/* CENTER — Nav Links */}
        <div className="nav-center">
          <a href="#" className="nav-link">Lifestyle</a>
          <a href="#" className="nav-link">Luxury</a>
          <a href="#" className="nav-link">Account</a>
          <button className="nav-link">
            Brands <ChevronDown size={11} />
          </button>
        </div>

        {/* RIGHT — Icons */}
        <div className="nav-right">

          {/* Theme */}
          <div className="theme-wrap">
            <button
              className="icon-btn"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title="Change Theme"
            >
              <Palette size={15} />
            </button>
            {isThemeMenuOpen && (
              <div className="theme-dropdown">
                <div className="theme-dropdown-header">Select Theme</div>
                {Object.values(themes).map((t) => (
                  <button
                    key={t.id}
                    className="theme-option"
                    onClick={() => { setCurrentTheme(t.id); setIsThemeMenuOpen(false); }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <button className="icon-btn">
            <Search size={15} />
          </button>

          {/* Cart */}
          <button className="cart-btn" onClick={() => setCartCount(c => c + 1)}>
            <span className="cart-price">₹0.00</span>
            <div className="cart-icon-wrap">
              <ShoppingBag size={17} className="cart-icon" />
              <span
                className="cart-badge"
                style={{ background: theme.accent }}
              >
                {cartCount}
              </span>
            </div>
          </button>

        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <a href="#" className="mobile-link">Lifestyle</a>
          <a href="#" className="mobile-link">Luxury</a>
          <a href="#" className="mobile-link">Account</a>
          <a href="#" className="mobile-link">Brands</a>
        </div>
      )}
    </div>
  );
}

