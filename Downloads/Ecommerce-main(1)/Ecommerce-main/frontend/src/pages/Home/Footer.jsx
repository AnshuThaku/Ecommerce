import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #121212 0%, #1a1a1a 100%)",
        color: "white",
        paddingTop: "96px",
        paddingBottom: "48px",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700&display=swap');

        .footer-link {
          color: #a0a0a0;
          text-decoration: none;
          font-size: 12px;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .footer-link:hover {
          color: white;
          transform: translateY(-2px);
        }

        .footer-heading {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 32px;
          color: #888;
        }

        .newsletter-input {
          background: none;
          color: white;
          padding: 12px 16px;
          font-size: 12px;
          border: none;
          outline: none;
          flex: 1;
        }

        .newsletter-button {
          background: #d3b574;
          color: #121212;
          font-weight: 700;
          text-transform: uppercase;
          padding: 12px 24px;
          cursor: pointer;
          font-size: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: none;
        }

        .newsletter-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
      `}</style>

      <div style={{ maxWidth: "1480px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "64px",
            marginBottom: "80px",
          }}
        >
          {/* Logo & Description */}
          <div style={{ gridColumn: "span 2" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginBottom: "32px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
                <div style={{ width: "2px", height: "16px", backgroundColor: "#666" }}></div>
                <div style={{ width: "2px", height: "24px", backgroundColor: "#666" }}></div>
                <div style={{ width: "2px", height: "32px", backgroundColor: "white" }}></div>
                <div style={{ width: "2px", height: "24px", backgroundColor: "#666" }}></div>
                <div style={{ width: "2px", height: "16px", backgroundColor: "#666" }}></div>
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: "0.1em",
                  margin: "8px 0 0 0",
                }}
              >
                Truee.in
              </h2>
            </div>
            <p
              style={{
                color: "#a0a0a0",
                fontSize: "12px",
                fontWeight: 300,
                lineHeight: "1.8",
                maxWidth: "340px",
              }}
            >
              Curating the world's most premium audio, smart home, and wellness products. Elevate your everyday living with our handpicked selection of global luxury brands.
            </p>

            {/* Newsletter on Left */}
            <div style={{ marginTop: "32px" }}>
              <h4 className="footer-heading" style={{ marginBottom: "16px" }}>Subscribe to Our Newsletter</h4>
              <div style={{ display: "flex", maxWidth: "400px" }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-button">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="footer-heading">The Collection</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li><a href="#" className="footer-link">High-Fidelity Audio</a></li>
              <li><a href="#" className="footer-link">Smart Wearables</a></li>
              <li><a href="#" className="footer-link">Luxury Home Care</a></li>
              <li><a href="#" className="footer-link">Exclusive Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Client Services</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li><a href="#" className="footer-link">Contact Concierge</a></li>
              <li><a href="#" className="footer-link">Shipping & Returns</a></li>
              <li><a href="#" className="footer-link">Track Order</a></li>
              <li><a href="#" className="footer-link">Warranty Info</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Connect</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <li><a href="#" className="footer-link">Instagram</a></li>
              <li><a href="#" className="footer-link">Facebook</a></li>
              <li><a href="#" className="footer-link">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
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
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
              margin: 0,
            }}
          >
            &copy; 2026 Truee E-Commerce. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <a href="#" style={{ color: "#666", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "#666", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}