import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import JapaneseCalligraphy from '../components/JapaneseCalligraphy';
import PotteryWheel from '../components/PotteryWheel';
import WS1 from '../../../assets/about-us/WS1.png';
import WS2 from '../../../assets/about-us/WS2.png';
import WS3 from '../../../assets/about-us/WS3.png';
import WS4 from '../../../assets/about-us/WS4.png';
import WS5 from '../../../assets/about-us/WS5.png';
import WS6 from '../../../assets/about-us/WS6.png';
import WS7 from '../../../assets/about-us/WS7.png';

const Hero_section = () => {
  const containerRef = useRef(null);

  return (
    <motion.section
      ref={containerRef}
      className="basho-about-section basho-hero-editorial"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="basho-about-inner basho-hero-grid">
        <motion.div
          className="basho-hero-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, type: 'spring' }}
        >
          <div className="hero-kicker">Bashō × Wabi-Sabi</div>
          <h1 className="hero-title">
            Craft, Imperfection, and Quiet Conversations
          </h1>
          <p className="hero-lead">
            Hand-shaped ceramics inspired by Japanese tradition and contemporary
            living — pieces meant to accompany daily ritual and age gracefully.
          </p>

          <div className="hero-ctas">
            <a className="btn btn-primary" href="#collection">Explore Collection</a>
            <a className="btn btn-ghost" href="#founder">Meet Shivangi</a>
          </div>

          <div className="hero-highlights" aria-hidden>
            <span>Limited Editions</span>
            <span>Workshops</span>
            <span>Custom Commissions</span>
          </div>
        </motion.div>

        <motion.div
          className="basho-hero-right"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, type: 'spring', delay: 0.15 }}
        >
          <div className="hero-carousel" aria-roledescription="carousel">
            {/* image list - user should upload hero-1.jpg ... hero-7.jpg to /public/about/ */}
            {
              /* Build image paths; user will add files into public/about/hero-1.jpg ... hero-7.jpg */
            }
            <CarouselImages />

            <div className="carousel-controls" aria-hidden>
              <button className="carousel-btn prev" aria-label="Previous image" onClick={() => window.dispatchEvent(new CustomEvent('carousel-prev'))}>&larr;</button>
              <button className="carousel-btn next" aria-label="Next image" onClick={() => window.dispatchEvent(new CustomEvent('carousel-next'))}>&rarr;</button>
            </div>

            <div className="carousel-indicators" aria-hidden>
              {/* indicators inserted by CarouselImages */}
            </div>

            <motion.div
              className="hero-ornament"
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

const CarouselImages = () => {
  const images = [WS1, WS2, WS3, WS4, WS5, WS6, WS7];
  const alts = [
    'Workshop scene with pottery in progress',
    'Detail of clay being shaped by hand',
    'Participants at Basho workshop',
    'Glazed pottery pieces on display',
    'Hands painting or glazing ceramics',
    'Shelves with finished ceramic work',
    'Cozy studio atmosphere with Basho ware',
  ];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const onNext = () => setIndex(i => (i + 1) % images.length);
    const onPrev = () => setIndex(i => (i - 1 + images.length) % images.length);
    const nextListener = () => onNext();
    const prevListener = () => onPrev();
    window.addEventListener('carousel-next', nextListener);
    window.addEventListener('carousel-prev', prevListener);

    const t = setInterval(onNext, 4500);
    return () => {
      clearInterval(t);
      window.removeEventListener('carousel-next', nextListener);
      window.removeEventListener('carousel-prev', prevListener);
    };
  }, []);

  return (
    <>
      {images.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt={alts[i] || `Hero image ${i + 1}`}
          className={`hero-photo ${i === index ? 'active' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}

      <div className="carousel-indicators-inner" aria-hidden>
        {images.map((_, i) => (
          <button
            key={i}
            className={`indicator ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Show image ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default Hero_section;
