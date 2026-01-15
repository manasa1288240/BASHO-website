import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Footer from "../components/Footer";
import "./GalleryPage.css";

// PRODUCT images (UNCHANGED)
import img1 from "../assets/gallery/img1.png";
import img2 from "../assets/gallery/img2.png";
import img3 from "../assets/gallery/img3.png";
import img4 from "../assets/gallery/img4.png";
import img5 from "../assets/gallery/img5.png";
import img6 from "../assets/gallery/img6.png";
import img7 from "../assets/gallery/img7.png";
import img8 from "../assets/gallery/img8.png";
import img9 from "../assets/gallery/img9.png";
import img10 from "../assets/gallery/img10.png";
import img11 from "../assets/gallery/img11.png";
import img12 from "../assets/gallery/img12.png";
import img13 from "../assets/gallery/img13.png";
import img14 from "../assets/gallery/img14.png";
import img15 from "../assets/gallery/img15.png";
import img16 from "../assets/gallery/img16.png";
import img17 from "../assets/gallery/img17.png";
import img18 from "../assets/gallery/img18.png";

// PRODUCTS (static)
const productImages = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
].map((img) => ({ imageUrl: img, type: "product" }));

const GalleryPage = () => {
  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [activeTab, setActiveTab] = useState("all"); // NEW
  const [workshops, setWorkshops] = useState([]); // NEW
  const [events, setEvents] = useState([]); // NEW

  // FETCH from MongoDB
  useEffect(() => {
    axios
      .get(`${API_URL}/api/gallery`)
      .then((res) => {
        const workshopImgs = res.data
          .filter((i) => i.category === "workshop")
          .map((i) => ({ imageUrl: i.imageUrl, type: "workshop" }));

        const eventImgs = res.data
          .filter((i) => i.category === "event")
          .map((i) => ({ imageUrl: i.imageUrl, type: "event" }));

        setWorkshops(workshopImgs);
        setEvents(eventImgs);
      })
      .catch((err) => {
        console.error("❌ Failed to load gallery images:", err);
      });
  }, [API_URL]);

  // COMBINED gallery
  const allImages = [...productImages, ...workshops, ...events];

  const visibleImages =
    activeTab === "all"
      ? allImages
      : allImages.filter((img) => img.type === activeTab);

  return (
    <>
      <section className="gallery-page">
        <div className="gallery-story-intro">
          <h1>Our Story in Clay</h1>
          <p>Every piece unfolds as you scroll</p>
        </div>

        {/* FILTER TABS (NEW) */}
        <div className="gallery-tabs">
          {["all", "product", "workshop", "event"].map((tab) => (
            <button
              key={tab}
              className={`gallery-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all"
                ? "All"
                : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
            </button>
          ))}
        </div>

        {/* GALLERY */}
        <div
          className={`masonry-container ${
            activeTab === "event" ? "event-grid" : ""
          }`}
        >
          {visibleImages.map((img, index) => (
            <motion.div
              key={index}
              className="gallery-card"
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={img.imageUrl} alt={img.type} />
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GalleryPage;
