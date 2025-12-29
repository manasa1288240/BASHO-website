import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import "../styles/ProductsPage.css";

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Vases", "Bowls", "Mugs", "Planters", "Plates"];

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <div className="products-page">
      <Navbar />
      
      {/* FEATURED COLLECTION HEADER */}
      <div className="featured-header">
        <div className="featured-container">
          <h1 className="featured-title">Featured Collection</h1>
          <div className="featured-subtitle">Handcrafted Pieces of ART</div>
          
          <div className="featured-divider"></div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-main-title">
            Where tradition <span className="highlight">meets</span> modern simplicity
          </h2>
          <div className="hero-columns">
            <div className="hero-column">
              <p className="hero-text">
                Our artisans honor centuries-old techniques
              </p>
            </div>
            <div className="hero-column">
              <p className="hero-text">
                while creating pieces that belong in contemporary homes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="filters-container">
        <div className="filters">
          {["All", "Vases", "Bowls", "Mugs", "Planters", "Plates"].map((f) => (
            <button 
              key={f} 
              className={activeFilter === f ? "active" : ""}
              onClick={() => setActiveFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="grid">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
      
      <Footer />
    </div>
  );
}