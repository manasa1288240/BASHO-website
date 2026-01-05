import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <img src={logo} alt="Basho Logo" className="logo" />

          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/workshops">Workshops</Link></li>
            <li><Link to="/about-basho">About Basho</Link></li>

            {/* ACCOUNT */}
            <li className="account-nav" style={{ position: "relative" }}>
              <a href="#" onClick={handleAccountClick} aria-label="Account">
                {!user ? (
                  // BEFORE LOGIN → DEFAULT ICON
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
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
