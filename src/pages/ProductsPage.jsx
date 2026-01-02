import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Failed to fetch products:", err)
      );
  }, []);

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase() ===
              activeFilter.toLowerCase()
        );

  return (
    <div>
      <Navbar />

      {/* FEATURED HEADER */}
      <div className="featured-header">
        <div className="featured-container">
          <div className="featured-subtitle">Handcrafted</div>
          <h1 className="featured-title">CERAMIC COLLECTION</h1>
          <div className="featured-divider"></div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h2>
            Timeless <em>ceramics</em>
          </h2>
          <p className="hero-desc">
            Thoughtfully crafted pieces inspired by Japanese
            aesthetics and slow living.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <div className="filters">
        {[
          "All",
          "Mugs",
          "Bowls",
          "Plates",
          "Platter",
          "Vase",
          "Fancy",
        ].map((filter) => (
          <button
            key={filter}
            className={
              activeFilter === filter ? "active" : ""
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="product-card"
          >
            <div className="img-wrap">
              {/* IMAGE PLACEHOLDER ONLY */}
              <div className="image-placeholder"></div>

              <span className="price">
                {product.price}
              </span>

              <div className="hover-info">
                <p>
                  {product.description ||
                    "Handcrafted ceramic piece"}
                </p>
              </div>
            </div>

            <span className="category">
              {product.category}
            </span>
            <h3 className="product-name">
              {product.name}
            </h3>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
