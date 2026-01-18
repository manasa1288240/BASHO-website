import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Founder3 from '../../../assets/about-us/Founder3.png';
import Founder4 from '../../../assets/about-us/Founder4.png';

function Founder_journey() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      id="founder"
      ref={containerRef}
      className="basho-about-section basho-about-founder"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="basho-about-inner">
        <div className="basho-founder-header">
          <h2 className="basho-founder-title">
            Shivangi's Journey 
          </h2>
        </div>
        <div className="basho-about-founder-grid">
          {/* Left: Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="basho-founder-carousel-wrapper"
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }} // Add this line
            >
              <FounderHeaderCarousel />
            </motion.div>
          {/* Right: All text content */}
          <div className="basho-founder-text-content">
            <p className="basho-founder-intro-text">
              From medicine to clay, Shivangi's journey is one of quiet transformation — a path shaped by curiosity, cultural immersion, and a deep reverence for the beauty found in imperfection.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="basho-founder-quote-card"
            >
              <div className="basho-founder-quote-label">Shivangi's Journey</div>
              <div className="basho-founder-quote-mark">"</div>
              <blockquote className="basho-founder-quote-text">
                Hi, I'm Shivangi — the hands and heart behind Bashō. Bashō is a Japanese word that means "a place." For me, it is my happy place — a space where time slows, intention matters, and every moment with clay is cherished.
                Each piece created here is shaped by hand, guided by instinct, and finished with patience — making no two forms ever the same. They carry individuality, just as people do.
              </blockquote>
              <div className="basho-founder-quote-footer">
                <div>
                  <div className="basho-founder-name">Shivangi</div>
                  <div className="basho-founder-role">Founder & Ceramic Artisan</div>
                </div>
                <div className="basho-founder-credit">— The beginning of Bashō</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Personal Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="basho-about-founder-quote-final"
        >
          <div className="basho-about-pill">
            <div className="basho-about-pill-inner">
              <p className="basho-about-founder-quote-text">
                "We don't create objects; we create companions for life's journey."
              </p>
              <div className="basho-about-accent-text">— Shivangi's Philosophy</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

const FounderHeaderCarousel = () => {
  const images = [Founder3, Founder4];
  const captions = [
    'Shivangi in the Basho studio',
    'Shivangi at the pottery wheel',
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goNext = () => setIndex((i) => (i + 1) % images.length);
  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="basho-founder-carousel">
      <div className="basho-founder-image-container">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={captions[index]}
          className="basho-founder-carousel-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="basho-founder-carousel-controls">
        <div className="basho-founder-carousel-indicators">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`basho-founder-carousel-dot ${
                i === index ? 'active' : ''
              }`}
              aria-label={`Show founder photo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Founder_journey;
