import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ShopProvider } from "./context/ShopContext";

// Font imports for chic typography
const fontLink = document.createElement('link');
fontLink.rel = 'preconnect';
fontLink.href = 'https://fonts.googleapis.com';
document.head.appendChild(fontLink);

const fontLink2 = document.createElement('link');
fontLink2.rel = 'preconnect';
fontLink2.href = 'https://fonts.gstatic.com';
fontLink2.crossOrigin = 'true';
document.head.appendChild(fontLink2);

const fontLink3 = document.createElement('link');
fontLink3.rel = 'stylesheet';
fontLink3.href = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap';
document.head.appendChild(fontLink3);

// Initialize scroll effects
const initScrollEffects = () => {
  // Navbar scroll effect
  const handleScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  // Section fade-in on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  // Smooth scroll for anchor links
  const handleAnchorClick = (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
      e.preventDefault();
      const id = target.getAttribute('href').substring(1);
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  // Initialize everything
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section').forEach(section => observer.observe(section));
    document.addEventListener('click', handleAnchorClick);
  });

  // Initial check
  handleScroll();

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleAnchorClick);
    observer.disconnect();
  };
};

// Initialize effects before React renders
initScrollEffects();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ShopProvider>
      <App />
    </ShopProvider>
  </React.StrictMode>
);
