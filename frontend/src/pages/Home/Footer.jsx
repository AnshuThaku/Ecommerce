import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#ffffff",
        color: "#111111",
        paddingTop: "80px", // Luxury feel ke liye padding thodi badhayi
        paddingBottom: "40px",
        fontFamily: "'Montserrat', sans-serif",
        borderTop: "1px solid #f0f0f0"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        .footer-link {
          color: #888;
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer-link:hover {
          color: #111;
          transform: translateX(5px); /* Chota sa movement effect */
        }

        .footer-heading {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 25px;
          color: #111;
        }

        .footer-container {
          max-width: 1400px; /* Thoda tight container for premium look */
          margin: 0 auto;
          padding: 0 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr; /* Logo section wider */
          gap: 50px;
          margin-bottom: 80px;
        }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-logo-section { grid-column: span 2; }
        }

        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; gap: 40px; }
          .footer-logo-section { grid-column: span 1; text-align: center; align-items: center; }
          .footer-heading { text-align: center; }
          ul { align-items: center !important; text-align: center; }
          .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
        }
      `}</style>

      <div className="footer-container"> 
        <div className="footer-grid">
          
          {/* --- LOGO SECTION --- */}
          <div className="footer-logo-section" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* ✅ Original Logo Image Implementation */}
              <img 
                src="/Truee_Luxury_Logo.png" 
                alt="Truee Luxury Logo" 
                style={{ height: "45px", width: "auto", objectFit: "contain" }} 
              />
              <h2 style={{ 
                fontSize: "22px", 
                fontFamily: "'Playfair Display', serif", 
                fontWeight: "700", 
                letterSpacing: "0.1em", 
                margin: "0", 
                color: "#111",
                textTransform: "uppercase" 
              }}>
                Truee<span style={{ color: "var(--theme-primary)", fontWeight: "300" }}></span>
              </h2>
            </Link>
            <p style={{ color: "#888", fontSize: "14px", fontWeight: 300, lineHeight: "1.8", maxWidth: "320px" }}>
              Experience the pinnacle of craftsmanship with our curated collection of luxury audio and smart living essentials.
            </p>
          </div>

          {/* --- LINKS COLUMNS --- */}
          <div>
            <h4 className="footer-heading">Shop</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/shop" className="footer-link">All Collections</Link></li>
              <li><Link to="/shop?category=audio" className="footer-link">Audio Experience</Link></li>
              <li><Link to="/shop?category=home" className="footer-link">Home Wellness</Link></li> 
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Assistance</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/profile" className="footer-link">My Account</Link></li>
              <li><Link to="/orders" className="footer-link">Shipping Policy</Link></li>
              <li><Link to="#" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="#" className="footer-link">Privacy Policy</Link></li> 
              <li><Link to="#" className="footer-link">Terms of Service</Link></li>
              <li><Link to="#" className="footer-link">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="footer-bottom" style={{ 
          borderTop: "1px solid #f0f0f0", 
          paddingTop: "30px", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <p style={{ color: "#999", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em" }}>
            &copy; {new Date().getFullYear()} TRUEE LUXURY. ALL RIGHTS RESERVED.
          </p>
          
          <div style={{ display: "flex", gap: "20px" }}>
             {/* Social Placeholder icons can go here */}
             <a href="#" className="footer-link" style={{fontSize: '11px'}}>INSTAGRAM</a>
             <a href="#" className="footer-link" style={{fontSize: '11px'}}>FACEBOOK</a>
          </div>
        </div>
      </div>
    </footer>
  );
}