import { Link } from "react-router-dom";

export default function Footer() {
  // EXACT Basho location coordinates: 21°07'48.0"N 72°43'26.4"E
  const latitude = "21.13";
  const longitude = "72.724";
  
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  
  // Brown/Earth-toned Google Maps embed
  const embeddedMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.092631361767!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA3JzQ4LjAiTiA3MsKwNDMnMjYuNCJF!5e0!3m2!1sen!2sin!4v1705023456789&language=en&region=IN&scale=2&zoom=16&style=feature:all|element:labels|visibility:off&style=feature:administrative|visibility:off&style=feature:landscape|color:0xf5e9d9&style=feature:poi|visibility:off&style=feature:road|color:0xd4c4a8&style=feature:transit|visibility:off&style=feature:water|color:0xe8dcc5`;

  return (
    <footer className="footer-modern">
      <div className="footer-container">
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
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://wa.me/919879575601"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.173-.515.045-.733.199-.199.447-.521.67-.793.223-.272.297-.471.447-.793.15-.322.075-.62-.045-.867-.124-.247-.67-1.611-.918-2.206-.241-.582-.472-.503-.67-.503h-.57c-.199 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.55 4.12 1.511 5.86L0 24l6.29-1.646c1.733.944 3.71 1.486 5.71 1.486 6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.844c-1.833 0-3.633-.492-5.188-1.42l-.372-.222-3.856 1.011 1.029-3.759-.244-.388c-.987-1.57-1.509-3.39-1.508-5.253.003-5.426 4.414-9.836 9.843-9.836 2.63 0 5.102 1.024 6.96 2.883 1.859 1.859 2.882 4.33 2.881 6.96-.003 5.427-4.414 9.837-9.844 9.837z" />
                </svg>
              </a>

              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Location"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Section - WITH "LOCATION" LINK */}
         <div className="footer-column">
  <h3 className="footer-heading">Contact Us</h3>
  <div className="footer-content" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        textDecoration: "none", 
        color: "inherit",
        lineHeight: "2.2"
      }}
    >
      311, Silent Zone, Gavier, Dumas Road, Surat-395007, India
    </a>
    
    {/* "LOCATION" LINK that leads to coordinates */}
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        textDecoration: "none", 
        color: "inherit",
        lineHeight: "2.2"
      }}
    >
      LOCATION
    </a>
    
    <div style={{ lineHeight: "2.2" }}>bashobyyshivangi@gmail.com</div>
    <div style={{ lineHeight: "2.2" }}>+91 98795 75601</div>
  </div>
</div>

          {/* Mini Map Section with BROWN THEME */}
          <div className="footer-column">
            <h3 className="footer-heading">Our Location</h3>
            <div className="mini-map-container">
              <iframe
                src={embeddedMapUrl}
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bashō by Shivangi Location"
                className="mini-map"
              />
            </div>
          </div>

          {/* Product Care Section */}
          <div className="footer-column">
            <h3 className="footer-heading">Product Care</h3>
            <ul className="footer-links">
              <li>Food Safe & Lead Free</li>
              <li>Microwave & Oven Friendly</li>
              <li>Dishwasher Friendly</li>
              <li><Link to="/care-guide">Full Care Guide</Link></li>
              <li><Link to="/client-tales">Client Tales</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Bashō by Shivangi. Handmade with Love.</p>
        </div>
      </div>
    </footer>
  );
}