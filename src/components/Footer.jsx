import { Link } from "react-router-dom";

export default function Footer() {
  // Exact link for coordinates: 21°07'48.0"N 72°43'26.4"E
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=21.130000,72.724000";

  return (
    <footer className="footer-modern">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <h2 className="brand-name">bashō</h2>
            <p className="brand-subtitle">by Shivangi</p>
            <p className="brand-tagline">
              Handcrafted Japanese pottery celebrating the timeless beauty of wabi-sabi
            </p>

            {/* Social Links */}
            <div className="social-links">
              <a
                href="https://www.instagram.com/bashobyyshivangi/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                {/* Instagram SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                </svg>
              </a>

              <a
                href="https://wa.me/919879575601"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="WhatsApp"
              >
                {/* WhatsApp SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059z" />
                </svg>
              </a>

              {/* Location */}
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Location"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-column">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="footer-content">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-detail"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                311, Silent Zone, Gavier, Dumas Road, Surat-395007, India
              </a>
              <p className="contact-detail">bashobyyshivangi@gmail.com</p>
              <p className="contact-detail">+91 98795 75601</p>
            </div>
          </div>

          {/* More Info Section */}
          <div className="footer-column">
            <h3 className="footer-heading">More Info</h3>
            <ul className="footer-links">
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/workshops">Workshops</Link></li>

              {/* ✅ FIXED: Client Tales opens NEW PAGE */}
              <li><Link to="/client-tales">Client Tales</Link></li>

              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Product Care Section */}
          <div className="footer-column">
            <h3 className="footer-heading">Product Care</h3>
            <ul className="footer-links">
              <li>Food Safe & Lead Free</li>
              <li>Microwave & Oven Friendly</li>
              <li>Dishwasher Friendly</li>
              <li><Link to="/care-guide">Full Care Guide</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2025 Bashō by Shivangi. Handmade with Love.</p>
        </div>
      </div>
    </footer>
  );
}
