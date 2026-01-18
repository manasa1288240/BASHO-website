import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import featuredProducts from "../data/products";
import pot3 from "../assets/pot3.png";
import "../styles/CartWishlist.css";
import LoginModal from "../components/LoginModal";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, addToCart, toggleWishlist } = useShop();
  const [products, setProducts] = useState(featuredProducts);

  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  // ✅ Login modal control (since you imported LoginModal)
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isLoggedIn = () => {
    return !!localStorage.getItem("basho_user");
  };

  const requireLogin = (action) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    action();
  };

  // Reuse backend products if available, otherwise fall back to static data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
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
  }, [API_URL]);

  const getProductKey = (product) => product._id || product.id || product.name;

  const getProductImage = (product) => {
    if (product?.image) return product.image;

    const staticMatch = featuredProducts.find((p) => p.name === product.name);
    if (staticMatch?.image) return staticMatch.image;

    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images[0];
    }

    return pot3;
  };

  const wishlistProducts = products.filter((p) =>
    wishlist.includes(getProductKey(p))
  );

  const handleMoveToCart = (product) => {
    requireLogin(() => {
      addToCart(product);
      toggleWishlist(product);
    });
  };

  const handleRemove = (product) => {
    toggleWishlist(product);
  };

  return (
    <div className="wishlist-screen">
      <div className="wishlist-page">
        <button
          type="button"
          className="wishlist-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2>
          <span role="img" aria-label="wishlist">
            ❤️
          </span>{" "}
          Your Wishlist
        </h2>

        {wishlistProducts.length === 0 ? (
          <p>No items in wishlist.</p>
        ) : (
          <ul className="wishlist-list">
            {wishlistProducts.map((item) => {
              const title = item.title || item.name;
              const imageSrc = getProductImage(item);

              return (
                <li key={getProductKey(item)} className="wishlist-item">
                  <img src={imageSrc} alt={title} className="item-thumb" />
                  <div className="item-main">
                    <div className="item-title">{title}</div>
                    <div className="item-meta">{item.price}</div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="pill-btn primary"
                      onClick={() => handleMoveToCart(item)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="pill-btn secondary"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ✅ Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onConfirm={() => {
            setShowLoginModal(false);
            navigate("/auth");
          }}
        />
      )}
    </div>
  );
};

export default WishlistPage;
