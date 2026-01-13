import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import CustomOrderForm from "../components/CustomOrderForm";
import featuredProducts from "../data/products";
import { useShop } from "../context/ShopContext";
import pot3 from "../assets/pot3.png";
import "../styles/ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState(featuredProducts);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const { wishlist, cart, toggleWishlist, addToCart } = useShop();
  const location = useLocation();

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

    return pot3;
  };

  // Helpers for wishlist & cart
  const getProductKey = (product) => product._id || product.id || product.name;

  const isInWishlist = (product) =>
    wishlist.includes(getProductKey(product));

  const isInCart = (product) =>
    cart.some((item) => item.id === getProductKey(product));

  // Fetch products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
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

  // ✅ FILTER + SEARCH
  const filteredProducts = products.filter((product) => {
    const title = (product.title || product.name || "").toLowerCase();
    const category = (product.category || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesCategory =
      activeFilter === "All" ||
      category === activeFilter.toLowerCase();

    const matchesSearch =
      title.includes(search) || category.includes(search);

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
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
        {[
          "All",
          "Mugs",
          "Plates",
          "Platter/Cheeseboard",
          "Bowls",
          "Vase",
          "Fancy",
          "Picasso Limited Collection",
        ].map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 🔍 SEARCH BAR */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRID */}
      <section className="grid">
        {filteredProducts.map((product) => {
          const title = product.title || product.name;
          const imageSrc = getProductImage(product);
          const inWishlist = isInWishlist(product);
          const inCart = isInCart(product);

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

              <div className="product-meta">
                <span className="category">{product.category}</span>
                <h3>{title}</h3>
              </div>

              <div className="product-actions">
                <button
                  type="button"
                  className={`wishlist-btn ${inWishlist ? "active" : ""}`}
                  onClick={() => toggleWishlist(product)}
                >
                  {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
                <button
                  type="button"
                  className={`cart-btn ${inCart ? "active" : ""}`}
                  onClick={() => addToCart(product)}
                >
                  {inCart ? "Add More" : "Add to Cart"}
                </button>
              </div>
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
