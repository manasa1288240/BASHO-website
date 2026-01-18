import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Footer from "../components/Footer";
import "./GalleryPage.css";

const GalleryPage = () => {
  const API_URL =
    import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  const [activeTab, setActiveTab] = useState("all");
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH from MongoDB
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/api/gallery`);

        // Expecting backend to return array like:
        // [{ imageUrl: "...", category: "product" | "workshop" | "event" }]
        const mapped = (res.data || []).map((i) => ({
          _id: i._id,
          imageUrl: i.imageUrl,
          type: i.category,
        }));

        setGalleryImages(mapped);
      } catch (err) {
        console.error("❌ Failed to load gallery images:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [API_URL]);

  const visibleImages =
    activeTab === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.type === activeTab);

  return (
    <>
      <section className="gallery-page">
        <div className="gallery-story-intro">
          <h1>Our Story in Clay</h1>
          <p>Every piece unfolds as you scroll</p>
        </div>

        {/* FILTER TABS */}
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

        {/* LOADING */}
        {loading && (
          <p style={{ textAlign: "center", opacity: 0.7, marginTop: "30px" }}>
            Loading gallery...
          </p>
        )}

        {/* EMPTY */}
        {!loading && visibleImages.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.7, marginTop: "30px" }}>
            No images found in this category.
          </p>
        )}

        {/* GALLERY */}
        <div
          className={`masonry-container ${
            activeTab === "event" ? "event-grid" : ""
          }`}
        >
          {visibleImages.map((img, index) => (
            <motion.div
              key={img._id || index}
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
