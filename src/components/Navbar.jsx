import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";
import { useShop } from "../context/ShopContext";

export default function Navbar() {
  const [bgColor, setBgColor] = useState("rgba(250, 247, 242, 0.92)");
  const [textColor, setTextColor] = useState("#222");
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const { wishlist, cart } = useShop();

  // Scroll-gradient effect
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
        const rgbToHex = (r, g, b) =>
          `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

        const [r1, g1, b1] = hexToRgb(c1);
        const [r2, g2, b2] = hexToRgb(c2);

        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return rgbToHex(r, g, b);
      };

      const bg = interpolateColor(colors[index], colors[nextIndex], localFraction);

      // Set navbar background with transparency
      setBgColor(
        `rgba(${parseInt(bg.slice(1, 3), 16)},${parseInt(
          bg.slice(3, 5),
          16
        )},${parseInt(bg.slice(5, 7), 16)},0.92)`
      );

      // Adaptive text color for links and icons
      const rgb = bg.match(/\w\w/g).map((x) => parseInt(x, 16));
      const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      setTextColor(brightness < 128 ? "#f5f5f5" : "#222");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const u = localStorage.getItem("basho_user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (user) {
      setShowMenu((prev) => !prev); // toggle logout menu
    } else {
      setShowAuth(true); // open login modal
    }
  };

  const logout = () => {
    localStorage.removeItem("basho_user");
    setUser(null);
    setShowMenu(false);
  };

  return (
    <>
      <nav
        className="navbar"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="navbar-container">
          {/* LOGO */}
          <img src={logo} alt="Basho Logo" className="logo" />

          {/* NAV LINKS */}
          <ul className="nav-links">
            <li>
              <Link to="/" style={{ color: textColor }}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ color: textColor }}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/workshops" style={{ color: textColor }}>
                Workshops
              </Link>
            </li>
            <li>
              <Link to="/about-basho" style={{ color: textColor }}>
                About Basho
              </Link>
            </li>
            {/* WISHLIST ICON */}
            <li>
              <Link
                to="/wishlist"
                style={{ color: textColor }}
                className="nav-icon-link"
                aria-label="Wishlist"
              >
                <span className="nav-icon-count">{wishlist.length}</span>
                <svg
                  className="nav-icon-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M12 19.5s-4.6-3.2-7-5.8C3.3 12 3 11 3 10c0-2 1.5-3.5 3.5-3.5 1.3 0 2.5.7 3.1 1.8C10.2 7.2 11.4 6.5 12.7 6.5 14.7 6.5 16.2 8 16.2 10c0 1-.3 2-2 3.7-2.4 2.6-7 5.8-7 5.8z"
                  />
                </svg>
              </Link>
            </li>

            {/* CART ICON */}
            <li>
              <Link
                to="/cart"
                style={{ color: textColor }}
                className="nav-icon-link"
                aria-label="Cart"
              >
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
                >
                  <circle cx="9" cy="19" r="1.6" />
                  <circle cx="17" cy="19" r="1.6" />
                  <path d="M4 5h2.2l1.4 9.2c.1.9.9 1.6 1.8 1.6H18" />
                  <path d="M8 7h11l-1.2 5.5H9.5" />
                </svg>
              </Link>
            </li>

            {/* ACCOUNT ICON */}
            <li className="account-nav" style={{ position: "relative" }}>
              <a href="#" onClick={handleAccountClick} aria-label="Account">
                {!user ? (
                  // BEFORE LOGIN → round head/body SVG, adaptive color
                  <svg
                    width="22"
                    height="22"
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
                  // AFTER LOGIN → CIRCULAR AVATAR
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
                      fontWeight: 600,
                    }}
                  >
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </a>

              {/* LOGOUT DROPDOWN */}
              {user && showMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "36px",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={logout}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "10px 16px",
                      cursor: "pointer",
                      fontSize: 14,
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* AUTH MODAL */}
      <AuthModal
        open={showAuth}
        onClose={() => {
          setShowAuth(false);
          const u = localStorage.getItem("basho_user");
          if (u) setUser(JSON.parse(u));
        }}
      />
    </>
  );
}
