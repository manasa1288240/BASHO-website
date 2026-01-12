import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
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

export default function ClientTales() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  /* 🔁 AUTO SCROLL EVERY 3s */
  useEffect(() => {
    if (hovered) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hovered]);

  const next = () => setIndex((index + 1) % reviews.length);
  const prev = () =>
    setIndex((index - 1 + reviews.length) % reviews.length);

  return (
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
  );
}
