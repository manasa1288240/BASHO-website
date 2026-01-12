import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Founder3 from '../../../assets/about-us/Founder3.png';
import Founder4 from '../../../assets/about-us/Founder4.png';

function Founder_journey() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // const timeline = [
  //   {
  //     year: '2015',
  //     title: 'Architecture Student',
  //     description:
  //       'Studying spatial design in Mumbai, first exposure to Japanese minimalism',
  //     dotColor: 'bg-[#442D1C]',
  //   },
  //   {
  //     year: '2017',
  //     title: 'Kyoto Pilgrimage',
  //     description:
  //       'First visit to Japan, life-changing encounter with Kintsugi art',
  //     dotColor: 'bg-[#652810]',
  //   },
  //   {
  //     year: '2019',
  //     title: 'Ceramics Apprenticeship',
  //     description: 'Two years studying under a master potter in Shigaraki',
  //     dotColor: 'bg-[#8E5022]',
  //   },
  //   {
  //     year: '2021',
  //     title: 'Bashō is Born',
  //     description: 'Launched first collection: "Whispers of the Tea Garden"',
  //     dotColor: 'bg-[#C85428]',
  //   },
  //   {
  //     year: '2023',
  //     title: 'Global Recognition',
  //     description:
  //       'Featured in international design exhibitions and publications',
  //     dotColor: 'bg-[#652810]',
  //   },
  // ];

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
      <div className="basho-about-inner" style={{padding: '3.5rem 2rem'}}>
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-4xl md:text-5xl font-['Noto_Serif_JP'] text-[#652810] mb-2 text-center">
            Shivangi's Journey
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <FounderHeaderCarousel />
          </motion.div>
          {/* Right: All text content */}
          <div className="flex flex-col gap-8 justify-center h-full items-end">
            <p className="font-['Playfair_Display'] text-2xl leading-relaxed text-[#442D1C]/80 max-w-2xl">
              From medicine to clay, Shivangi’s journey is one of quiet transformation — a path shaped by curiosity, cultural immersion, and a deep reverence for the beauty found in imperfection.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-[#EDD8B4] shadow-lg self-end w-full lg:w-[420px] mt-8"
            >
              <div className="font-semibold text-[#652810] mb-2">Shivangi's Journey</div>
              <div className="text-3xl text-[#C85428] mb-4">“</div>
              <blockquote className="font-['Playfair_Display'] text-2xl md:text-[1.7rem] leading-[1.6] text-[#442D1C] italic mb-8">

                Hi, I’m Shivangi — the hands and heart behind Bashō.
Bashō is a Japanese word that means “a place.” For me, it is my happy place — a space where time slows, intention matters, and every moment with clay is cherished.
Each piece created here is shaped by hand, guided by instinct, and finished with patience — making no two forms ever the same. They carry individuality, just as people do.
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-['Playfair_Display'] text-xl text-[#652810]">Shivangi</div>

                  <div className="text-[#442D1C]/60 text-sm">Founder & Ceramic Artisan</div>
                </div>
                <div className="text-[#442D1C]/40">— The beginning of Bashō</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-xl bg-gradient-to-r from-[#442D1C]/5 to-transparent border-l-4 border-[#8E5022]"
            >
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
    <div className="mt-4 flex flex-col items-center gap-3">
      <div
        className="inline-flex flex-col items-center justify-center bg-white/90 rounded-2xl px-6 py-4 shadow-md"
        style={{ maxWidth: '260px' }}
      >
        <div
          className="relative"
          style={{ width: '140px', height: '140px' }}
        >
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={captions[index]}
            className="w-full h-full rounded-full object-cover border-4 border-[#EDD8B4] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        <div className="mt-3 flex items-center gap-4">
          <div className="flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full border border-[#C85428]/40 ${
                  i === index ? 'bg-[#C85428]' : 'bg-transparent'
                }`}
                aria-label={`Show founder photo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Founder_journey;
