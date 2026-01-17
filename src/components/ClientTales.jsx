import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./ClientTales.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

export default function ClientTales() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [videoReels, setVideoReels] = useState([]);

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const videoSectionRef = useRef(null);

  /* -------------------- LOAD WRITTEN TESTIMONIALS -------------------- */
  useEffect(() => {
    const loadWritten = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/testimonials`);
        const data = await res.json();

        if (data.success) {
          setReviews(data.testimonials || []);
        }
      } catch (err) {
        console.error("Failed to load written testimonials:", err);
      }
    };

    loadWritten();
  }, []);

  /* -------------------- LOAD VIDEO TESTIMONIALS -------------------- */
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/video-testimonials`);
        const data = await res.json();

        if (data.success) {
          setVideoReels(data.reels || []);
          setActiveReelIndex(0);
        }
      } catch (err) {
        console.error("Failed to load video testimonials:", err);
      }
    };

    loadVideo();
  }, []);

  /* 🔁 AUTO SCROLL EVERY 3s */
  useEffect(() => {
    if (hovered) return;
    if (!reviews.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hovered, reviews.length]);

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
    if (!videoReels.length) return;

    const reel = videoReels[activeReelIndex];
    if (!reel) return;

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
  }, [activeReelIndex, videoReels]);

  const next = () => {
    if (!reviews.length) return;
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    if (!reviews.length) return;
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextReel = () => {
    if (!videoReels.length) return;
    setActiveReelIndex((prev) => (prev + 1) % videoReels.length);
  };

  const prevReel = () => {
    if (!videoReels.length) return;
    setActiveReelIndex((prev) => (prev - 1 + videoReels.length) % videoReels.length);
  };

  return (
    <>
      {/* WRITTEN TESTIMONIALS */}
      <section className="client-tales">
        <h1 className="client-title">Client Tales</h1>
        <p className="client-subtitle">Words shared from the Basho community</p>

        {!reviews.length ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No testimonials added yet.
          </p>
        ) : (
          <div className="carousel-wrapper">
            <button className="arrow left" onClick={prev}>
              ‹
            </button>

            <div
              className="carousel-viewport"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
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
            </div>

            <button className="arrow right" onClick={next}>
              ›
            </button>
          </div>
        )}
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section className="video-testimonials" ref={videoSectionRef}>
        <h2 className="video-title">Video Testimonials</h2>
        <p className="video-subtitle">Watch what our Basho community shared</p>

        {!videoReels.length ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No video testimonials added yet.
          </p>
        ) : (
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
                style={{
                  animation: "fadeInScale 0.4s ease-in-out forwards",
                }}
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
        )}
      </section>
    </>
  );
}
