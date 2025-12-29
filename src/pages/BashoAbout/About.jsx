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
