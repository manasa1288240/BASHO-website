import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <img src={logo} alt="Basho Logo" className="logo" />
        <ul className="nav-links">
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#workshops">Workshops</a></li>
            <li><a href="#about">About Us</a></li>
          </ul>

        </ul>
      </div>
    </nav>
  );
}
