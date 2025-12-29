import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <img src={logo} alt="Basho Logo" className="logo" />

          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#workshops">Workshops</a></li>
            <li><a href="#about">About Us</a></li>

            {/* Account Icon */}
            <li>
              <button
                className="account-icon-btn"
                onClick={() => setShowAuth(true)}
                aria-label="Account"
              >
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
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
