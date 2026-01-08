import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomOrderForm from "../components/CustomOrderForm";
import featuredProducts from "../data/products";
import pot3 from "../assets/pot3.png";
import { useCart } from "../contexts/CartContext";
import "../styles/ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState(featuredProducts);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const location = useLocation();
  const { addProduct } = useCart();

  const handleAddToCart = (product) => {
    addProduct(product);
    alert(`${product.title || product.name} added to cart!`);
  };

  // ✅ ALWAYS RETURN A VALID IMAGE
  const getProductImage = (product) => {
    if (product.image) return product.image;

    const staticMatch = featuredProducts.find(
      (p) => p.name === product.name
    );
    if (staticMatch?.image) return staticMatch.image;

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    return pot3; // ✅ fallback (NO broken images)
  };

  // Fetch products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch {
        setProducts(featuredProducts);
      }
    };

    loadProducts();
  }, []);

  // Auto-scroll to custom order
  useEffect(() => {
    if (location.hash === "#custom-order") {
      const el = document.getElementById("custom-order");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }, [location]);

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <div>
      <Navbar />

      {/* HEADER */}
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

      {/* GRID */}
      <section className="grid">
        {filteredProducts.map((product) => {
          const title = product.title || product.name;
          const imageSrc = getProductImage(product);

          return (
            <div
              key={product._id || product.id || product.name}
              className="product-card"
            >
              <div className="img-wrap">
                <img src={imageSrc} alt={title} />
                <div className="hover-info">
                  <p>{product.description}</p>
                </div>
                <span className="price">{product.price}</span>
              </div>

              <span className="category">{product.category}</span>
              <h3>{title}</h3>
              <button onClick={() => handleAddToCart(product)} className="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          );
        })}

        {/* CUSTOM ORDER CARD */}
        <div
          id="custom-order"
          className="product-card custom-order-card"
          onClick={() => setShowCustomForm(true)}
        >
          <div className="img-wrap">
            <img src={pot3} alt="Custom Order" />
            <div className="hover-info">
              <p>
                Looking for something unique?
                <br />
                Tell us your idea and we’ll craft it.
              </p>
            </div>
          </div>
          <span className="category">Custom</span>
          <h3>Custom Order</h3>
        </div>
      </section>

      {showCustomForm && (
        <CustomOrderForm onClose={() => setShowCustomForm(false)} />
      )}

      <Footer />
    </div>
  );
}
