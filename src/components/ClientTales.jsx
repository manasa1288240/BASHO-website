import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./ClientTales.css";

const reviews = [
  {
    name: "Shivangi",
    role: "Ceramics Enthusiast",
    text:
      "Basho pieces feel deeply personal. Every cup and plate carries a warmth that makes everyday moments slower and more meaningful."
  },
  {
    name: "Shivangi",
    role: "Workshop Participant",
    text:
      "The workshops at Basho are calm, thoughtful, and grounding. It’s not just about clay, but about reconnecting with yourself."
  },
  {
    name: "Shivangi",
    role: "Long-time Customer",
    text:
      "What I love most about Basho is the honesty of the craft. Nothing feels rushed — everything feels intentional."
  }
];

const videoReels = [
  {
    id: 1,
    reelUrl: "https://www.instagram.com/reel/DGAYFhoopSx/?igsh=MXFqdWl3bzZ0dWV3dA=="
  },
  {
    id: 2,
    reelUrl: "https://www.instagram.com/reel/DGF7sIsoqs-/?igsh=cHY5ZTRnbHdyYmlx"
  },
  {
    id: 3,
    reelUrl: "https://www.instagram.com/reel/DG7KPPGTL6h/?igsh=MTRiNDVuOGt2N28xMQ=="
  },
  {
    id: 4,
    reelUrl: "https://www.instagram.com/reel/DHsYbQsRmnb/?igsh=MTM3MmF2aHV6ajVtaA=="
  }
];

export default function ClientTales() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const videoSectionRef = useRef(null);

  /* 🔁 AUTO SCROLL EVERY 3s */
  useEffect(() => {
    if (hovered) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hovered]);

  /* 📜 LOAD INSTAGRAM EMBED SCRIPT */
  useEffect(() => {
    // Remove any existing Instagram script first
    const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and load Instagram script
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Instagram script loaded");
      // Process embeds after script loads
      setTimeout(() => {
        if (window.instgrm?.Embeds?.process) {
          window.instgrm.Embeds.process();
        }
      }, 500);
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount - keep it for other components
    };
  }, []);

  /* 👁️ PROCESS INSTAGRAM EMBEDS WHEN ACTIVE REEL CHANGES */
  useEffect(() => {
    const reel = videoReels[activeReelIndex];
    
    // Get the embed container
    const reelEmbed = document.querySelector(".reel-embed");
    if (!reelEmbed) return;

    // Use the URL as-is (with ?igsh= parameter if it has it)
    const embedUrl = reel.reelUrl;
    
    reelEmbed.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${embedUrl}" data-instgrm-version="14"></blockquote>`;

    // Process embed with multiple attempts to ensure it works
    const processEmbed = () => {
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
        try {
          window.instgrm.Embeds.process();
          console.log("Instagram embed processed for reel:", activeReelIndex);
        } catch (error) {
          console.error("Error processing Instagram embed:", error);
        }
      }
    };

    // First attempt immediately
    processEmbed();

    // Second attempt after 300ms
    const timer1 = setTimeout(processEmbed, 300);
    
    // Third attempt after 600ms as a fallback
    const timer2 = setTimeout(processEmbed, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeReelIndex]);

  const next = () => setIndex((index + 1) % reviews.length);
  const prev = () =>
    setIndex((index - 1 + reviews.length) % reviews.length);

  const nextReel = () => setActiveReelIndex((prev) => (prev + 1) % videoReels.length);
  const prevReel = () => setActiveReelIndex((prev) => (prev - 1 + videoReels.length) % videoReels.length);

  return (
    <>
      <section className="client-tales">
      <h1 className="client-title">Client Tales</h1>
      <p className="client-subtitle">
        Words shared from the Basho community
      </p>

      <div className="carousel-wrapper">
        <button className="arrow left" onClick={prev}>‹</button>

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
              <p className="testimonial-text">
                “{reviews[index].text}”
              </p>

              <div className="testimonial-author">
                <strong>{reviews[index].name}</strong>
                <span>{reviews[index].role}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button className="arrow right" onClick={next}>›</button>
      </div>
    </section>

    {/* VIDEO TESTIMONIALS SECTION - PORTRAIT REEL */}
    <section className="video-testimonials" ref={videoSectionRef}>
      <h2 className="video-title">Video Testimonials</h2>
      <p className="video-subtitle">Watch what our Basho community shared</p>

      <div className="reel-display-container">
        {/* PREV ARROW */}
        <button className="reel-nav-btn reel-nav-prev" onClick={prevReel} aria-label="Previous reel">
          ‹
        </button>

        {/* CENTER PORTRAIT REEL */}
        <div className="reel-card">
          <div
            className="reel-content"
            style={{
              animation: "fadeInScale 0.4s ease-in-out forwards"
            }}
          >
            <div className="reel-embed" />
          </div>
        </div>

        {/* NEXT ARROW */}
        <button className="reel-nav-btn reel-nav-next" onClick={nextReel} aria-label="Next reel">
          ›
        </button>
      </div>
    </section>
  </>
);
}
