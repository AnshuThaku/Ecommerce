import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#ffffff",
        color: "#111111",
        paddingTop: "80px",
        paddingBottom: "40px",
        fontFamily: "'Montserrat', sans-serif",
        transition: "background 0.5s ease, color 0.5s ease",
        borderTop: "1px solid #eaeaea"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700&display=swap');

        .footer-link {
          color: #999;
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.05em;
          transition: color 0.3s ease, transform 0.3s ease;
          display: inline-block;
        }
        .footer-link:hover {
          color: var(--theme-primary);
          transform: translateX(4px);
        }

        .footer-heading {
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 28px;
          color: #111;
        }
      `}</style>

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 40px" }}> 
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",        
            gap: "80px",
            marginBottom: "60px",
          }}
        >
          {/* Logo & Description */}
          <div style={{ gridColumn: "span 2", paddingRight: "40px" }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: "24px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", gap: "3px", marginBottom: "12px" }}>
                  <div style={{ width: "2px", height: "16px", backgroundColor: "#444" }}></div>
                  <div style={{ width: "2px", height: "24px", backgroundColor: "#666" }}></div>
                  <div style={{ width: "2px", height: "32px", backgroundColor: "var(--theme-primary)" }}></div>
                  <div style={{ width: "2px", height: "24px", backgroundColor: "#666" }}></div>
                  <div style={{ width: "2px", height: "16px", backgroundColor: "#444" }}></div>
                </div>
                <h2
                  style={{
                    fontSize: "28px",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: "700",
                    letterSpacing: "0.15em",
                    margin: "0",
                    color: "#111"
                  }}
                >
                  TRUEE<span style={{ color: "var(--theme-primary)", fontStyle: "italic", fontWeight: "400" }}>.in</span>
                </h2>
              </div>
            </Link>
            <p
              style={{
                color: "#888",
                fontSize: "13px",
                fontWeight: 300,
                lineHeight: "2",
                maxWidth: "380px",
              }}
            >
              Curating the world's most premium luxury audio, smart home, and wellness products. Elevate your everyday living with our handpicked selection of global brands.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="footer-heading">The Collection</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li><Link to="/shop" state={{ search: 'Audio' }} className="footer-link">High-Fidelity Audio</Link></li>
              <li><Link to="/shop" state={{ search: 'Smart' }} className="footer-link">Smart Wearables</Link></li>
              <li><Link to="/shop" state={{ search: 'Home' }} className="footer-link">Luxury Home Care</Link></li> 
              <li><Link to="/shop" state={{ search: 'Accessories' }} className="footer-link">Exclusive Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Client Services</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li><Link to="/profile" className="footer-link">My Account</Link></li>
              <li><Link to="/orders" className="footer-link">Track Order</Link></li>
              <li><Link to="#" className="footer-link">Shipping & Returns</Link></li>      
              <li><Link to="#z" className="footer-link">Warranty Info</Link></li>    
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Connect</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li><a href="#" className="footer-link">Instagram</a></li>        
              <li><a href="#" className="footer-link">Facebook</a></li>
              <li><a href="#" className="footer-link">LinkedIn</a></li>
              <li><a href="#" className="footer-link">Twitter</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #eaeaea",
            paddingTop: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <p
            style={{
              color: "#666",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 600,
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} Truee Luxury. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>      
            <Link to="#" style={{ color: "#666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, textDecoration: "none", transition: "color 0.3s" }} onMouseOver={(e) => e.target.style.color="var(--theme-primary)"} onMouseOut={(e) => e.target.style.color="#666"}>Privacy Policy</Link>
            <Link to="#" style={{ color: "#666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, textDecoration: "none", transition: "color 0.3s" }} onMouseOver={(e) => e.target.style.color="var(--theme-primary)"} onMouseOut={(e) => e.target.style.color="#666"}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
