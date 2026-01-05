import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import featuredProducts from "../data/products";
import "../styles/ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState(featuredProducts);
  const [activeFilter, setActiveFilter] = useState("All");

  const getProductImage = (product) => {
    // Prefer explicit image on the object (static data)
    if (product.image) return product.image;

    // Fallback: match backend product by name to static featured product to reuse its image
    const staticMatch = featuredProducts.find((p) => p.name === product.name);
    if (staticMatch?.image) return staticMatch.image;

    // Last resort: if backend sends an images array, try first entry as-is
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    return "";
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(featuredProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products, using static featured products:", err);
        setProducts(featuredProducts);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => {
          const category = product.category || "";
          return (
            typeof category === "string" &&
            category.toLowerCase() === activeFilter.toLowerCase()
          );
        });

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

      
      {/* FILTERS */}
      <div className="filters">
        {["All", "Bowls", "Plates", "Cups"].map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <section className="grid">
        {filteredProducts.map((product) => {
          const title = product.title || product.name;
          const category = product.category;
          const imageSrc = getProductImage(product);

          return (
            <div key={product._id || product.id || product.name} className="product-card">
              <div className="img-wrap">
                <img src={imageSrc} alt={title} />
                <div className="hover-info">
                  <p>{product.description}</p>
                </div>
                <span className="price">{product.price}</span>
              </div>

              {category && <span className="category">{category}</span>}
              <h3>{title}</h3>
            </div>
          );
        })}
      </section>

      <Footer />
    </div>
  );
}
