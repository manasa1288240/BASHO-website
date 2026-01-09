import { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './sections/Hero_section';
import FounderStory from './sections/Founder_journey';
import MissionVision from './sections/MissionVission';
import './About.css';

const BashoAbout = () => {
  useEffect(() => {
    console.log('🎌 Basho About Page Loaded');
  }, []);

  return (
    <motion.main
      className="basho-about-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header band with Background.png like other pages */}
      <div className="featured-header">
        <div className="featured-container">
          <div className="featured-subtitle">About</div>
          <h1 className="featured-title">ABOUT BASHO</h1>
          <div className="featured-divider"></div>
        </div>
      </div>

      {/* 1. Basho & Wabi-Sabi */}
      <HeroSection />

      {/* 2. Shivangi's Journey */}
      <FounderStory />

      {/* 3. Mission & Vision */}
      <MissionVision />
    </motion.main>
  );
};

export default BashoAbout;
