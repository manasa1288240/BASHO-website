import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./ClientTales.css";

const videoReels = [
  {
    id: 1,
    reelUrl:
      "https://www.instagram.com/reel/DGAYFhoopSx/?igsh=MXFqdWl3bzZ0dWV3dA==",
  },
  {
    id: 2,
    reelUrl: "https://www.instagram.com/reel/DGF7sIsoqs-/?igsh=cHY5ZTRnbHdyYmlx",
  },
  {
    id: 3,
    reelUrl: "https://www.instagram.com/reel/DG7KPPGTL6h/?igsh=MTRiNDVuOGt2N28xMQ==",
  },
  {
    id: 4,
    reelUrl: "https://www.instagram.com/reel/DHsYbQsRmnb/?igsh=MTM3MmF2aHV6ajVtaA==",
  },
];

export default function ClientTales() {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const videoSectionRef = useRef(null);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  /* ✅ FETCH TESTIMONIALS FROM MONGODB */
  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch(`${API_URL}/api/admin/testimonials`);
        const data = await res.json();

        if (data.success) {
          setReviews(data.testimonials || []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
        setReviews([]);
      }
    }

    loadTestimonials();
  }, [API_URL]);

  /* 🔁 AUTO SCROLL EVERY 3s */
  useEffect(() => {
    if (hovered) return;
    if (!reviews.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hovered, reviews]);

  /* 📜 LOAD INSTAGRAM EMBED SCRIPT */
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setTimeout(() => {
        if (window.instgrm?.Embeds?.process) {
          window.instgrm.Embeds.process();
        }
      }, 500);
    };

    document.body.appendChild(script);
  }, []);

  /* 👁️ PROCESS INSTAGRAM EMBEDS WHEN ACTIVE REEL CHANGES */
  useEffect(() => {
    const reel = videoReels[activeReelIndex];

    const reelEmbed = document.querySelector(".reel-embed");
    if (!reelEmbed) return;

    const embedUrl = reel.reelUrl;

    reelEmbed.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${embedUrl}" data-instgrm-version="14"></blockquote>`;

    const processEmbed = () => {
      if (window.instgrm?.Embeds?.process) {
        try {
          window.instgrm.Embeds.process();
        } catch (error) {
          console.error("Error processing Instagram embed:", error);
        }
      }
    };

    processEmbed();

    const timer1 = setTimeout(processEmbed, 300);
    const timer2 = setTimeout(processEmbed, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeReelIndex]);

  const next = () => {
    if (!reviews.length) return;
    setIndex((index + 1) % reviews.length);
  };

  const prev = () => {
    if (!reviews.length) return;
    setIndex((index - 1 + reviews.length) % reviews.length);
  };

  const nextReel = () =>
    setActiveReelIndex((prev) => (prev + 1) % videoReels.length);

  const prevReel = () =>
    setActiveReelIndex((prev) => (prev - 1 + videoReels.length) % videoReels.length);

  return (
    <>
      <section className="client-tales">
        <h1 className="client-title">Client Tales</h1>
        <p className="client-subtitle">Words shared from the Basho community</p>

        <div className="carousel-wrapper">
          <button className="arrow left" onClick={prev}>
            ‹
          </button>

          <div
            className="carousel-viewport"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {!reviews.length ? (
              <div className="testimonial-card">
                <p className="testimonial-text">
                  “No testimonials yet. Be the first to share your Basho experience!”
                </p>
                <div className="testimonial-author">
                  <strong>BASHO</strong>
                  <span>Community</span>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  className="testimonial-card"
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="testimonial-text">“{reviews[index].message}”</p>

                  <div className="testimonial-author">
                    <strong>{reviews[index].name}</strong>
                    <span>{reviews[index].role}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <button className="arrow right" onClick={next}>
            ›
          </button>
        </div>
      </section>

      <section className="video-testimonials" ref={videoSectionRef}>
        <h2 className="video-title">Video Testimonials</h2>
        <p className="video-subtitle">Watch what our Basho community shared</p>

        <div className="reel-display-container">
          <button
            className="reel-nav-btn reel-nav-prev"
            onClick={prevReel}
            aria-label="Previous reel"
          >
            ‹
          </button>

          <div className="reel-card">
            <div
              className="reel-content"
              style={{ animation: "fadeInScale 0.4s ease-in-out forwards" }}
            >
              <div className="reel-embed" />
            </div>
          </div>

          <button
            className="reel-nav-btn reel-nav-next"
            onClick={nextReel}
            aria-label="Next reel"
          >
            ›
          </button>
        </div>
      </section>
    </>
  );
}
