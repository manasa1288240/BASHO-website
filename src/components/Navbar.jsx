import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useShop } from "../context/ShopContext";
import ChatbotModal from "./ChatbotModal";

export default function Navbar() {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState("rgba(250, 247, 242, 0.92)");
  const [textColor, setTextColor] = useState("#222");
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { wishlist, cart } = useShop();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(scrollTop / docHeight, 1);

      const colors = ["#ffffff", "#edd8b4", "#8e5022", "#652810", "#442d1c"];
      const index = Math.floor(scrollFraction * (colors.length - 1));
      const nextIndex = Math.min(index + 1, colors.length - 1);
      const localFraction = scrollFraction * (colors.length - 1) - index;

      const interpolateColor = (c1, c2, t) => {
        const hexToRgb = (hex) => {
          const bigint = parseInt(hex.slice(1), 16);
          return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        };
        const [r1, g1, b1] = hexToRgb(c1);
        const [r2, g2, b2] = hexToRgb(c2);

        return `rgba(${Math.round(r1 + (r2 - r1) * t)},
                     ${Math.round(g1 + (g2 - g1) * t)},
                     ${Math.round(b1 + (b2 - b1) * t)},0.92)`;
      };

      setBgColor(interpolateColor(colors[index], colors[nextIndex], localFraction));

      if (scrollFraction > 0.35) {
        setTextColor("#ffffff");
      } else {
        setTextColor("#222");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem("basho_user");
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    const onLogin = () => {
      const u = localStorage.getItem("basho_user");
      if (u) setUser(JSON.parse(u));
    };
    window.addEventListener("basho-login", onLogin);
    return () => window.removeEventListener("basho-login", onLogin);
  }, []);

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (user) setShowMenu((prev) => !prev);
    else navigate("/auth");
  };

  const logout = () => {
    localStorage.removeItem("basho_user");
    setUser(null);
    setShowMenu(false);
  };

  return (
    <nav className="navbar" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="navbar-container">
        <img src={logo} alt="Basho Logo" className="logo" />

        {/* Hamburger Menu Button - Mobile Only */}
        <button 
          className="hamburger-menu" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: textColor }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          <li><Link to="/" style={{ color: textColor }}>Home</Link></li>
          <li><Link to="/products" style={{ color: textColor }}>Products</Link></li>
          <li><Link to="/workshops" style={{ color: textColor }}>Workshops</Link></li>
          <li><Link to="/about-basho" style={{ color: textColor }}>About Basho</Link></li>
          <li><Link to="/gallery" style={{ color: textColor }}>Gallery</Link></li>

          {/* ❤️ Wishlist */}
          <li>
            <Link to="/wishlist" style={{ color: textColor }} className="nav-icon-link">
              <span className="nav-icon-count">{wishlist.length}</span>
              <svg
                className="nav-icon-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke={textColor}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 24, height: 24, transform: "translateY(-2px)" }}
              >
                <path d="M12 19.5s-4.6-3.2-7-5.8C3.3 12 3 11 3 10
                  c0-2 1.5-3.5 3.5-3.5 1.3 0 2.5.7 3.1 1.8
                  C10.2 7.2 11.4 6.5 12.7 6.5
                  14.7 6.5 16.2 8 16.2 10
                  c0 1-.3 2-2 3.7-2.4 2.6-7 5.8-7 5.8z" />
              </svg>
            </Link>
          </li>

          {/* 🛒 Cart */}
          <li>
            <Link to="/cart" style={{ color: textColor }} className="nav-icon-link">
              <span className="nav-icon-count">
                {cart.reduce((sum, item) => sum + (item.qty || 1), 0)}
              </span>
              <svg
                className="nav-icon-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke={textColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 24, height: 24, transform: "translateY(-2px)" }}
              >
                <circle cx="9" cy="19" r="1.6" />
                <circle cx="17" cy="19" r="1.6" />
                <path d="M4 5h2.2l1.4 9.2c.1.9.9 1.6 1.8 1.6H18" />
                <path d="M8 7h11l-1.2 5.5H9.5" />
              </svg>
            </Link>
          </li>

          {/* 👤 Account */}
          <li className="account-nav" style={{ position: "relative" }}>
            <a href="#" onClick={handleAccountClick}>
              {!user ? (
                <svg
                  className="nav-icon-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                </svg>
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#5b4636",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  {user.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </a>

            {user && showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "36px",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
                }}
              >
                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px 16px",
                    cursor: "pointer"
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Sidebar Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} style={{ backgroundColor: bgColor }}>
          <ul className="mobile-menu-links">
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link></li>
            <li><Link to="/workshops" onClick={() => setMobileMenuOpen(false)}>Workshops</Link></li>
            <li><Link to="/about-basho" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
            <li><Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link></li>
            <li>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                ❤️ Wishlist ({wishlist.length})
              </Link>
            </li>
            <li>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                🛒 Cart ({cart.reduce((sum, item) => sum + (item.qty || 1), 0)})
              </Link>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setChatbotOpen(true); setMobileMenuOpen(false); }} className="chatbot-nav-link">
                💬 Ask BASHO AI
              </a>
            </li>
            {!user ? (
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/auth"); setMobileMenuOpen(false); }}>Account</a></li>
            ) : (
              <li><a href="#" onClick={(e) => { e.preventDefault(); logout(); setMobileMenuOpen(false); }}>Logout</a></li>
            )}
          </ul>
        </div>
      </div>

      {/* Chatbot Modal for Mobile */}
      {chatbotOpen && <ChatbotModal onClose={() => setChatbotOpen(false)} />}
    </nav>
  );
}
