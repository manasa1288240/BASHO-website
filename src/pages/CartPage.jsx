import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import featuredProducts from "../data/products";
import pot3 from "../assets/pot3.png";
import "../styles/CartWishlist.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, history, markAsPurchased } = useShop();
  const [products, setProducts] = useState(featuredProducts);

  // Load full product data so we can show images in the cart
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

  const getProductKey = (product) => product._id || product.id || product.name;

  const getProductImage = (product) => {
    if (!product) return pot3;
    if (product.image) return product.image;

    const staticMatch = featuredProducts.find((p) => p.name === product.name);
    if (staticMatch?.image) return staticMatch.image;

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    return pot3;
  };

  const handlePurchase = (productId) => {
    markAsPurchased(productId);
  };

  const cartIsEmpty = !cart || cart.length === 0;

  return (
    <div className="cart-screen">
      <div className="cart-page">
        <button
          type="button"
          className="cart-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2>
          <span role="img" aria-label="cart">🛒</span> Your Cart
        </h2>

      {cartIsEmpty ? (
        <p>No items in cart.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => {
            const product = products.find((p) => getProductKey(p) === item.id);
            const title = product?.title || product?.name || item.name;
            const imageSrc = getProductImage(product);

            return (
              <li key={item.id} className="cart-item">
                <img
                  src={imageSrc}
                  alt={title}
                  className="item-thumb"
                />
                <div className="item-main">
                  <div className="item-title">{title}</div>
                  <div className="item-meta">
                    Quantity: {item.qty} · Price: {item.price}
                  </div>
                </div>
                <div className="item-actions">
                  <button
                    className="pill-btn primary"
                    onClick={() => handlePurchase(item.id)}
                  >
                    Purchase
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h3>Purchase History</h3>
      {(!history || history.length === 0) ? (
        <p>No previous purchases.</p>
      ) : (
        <ul className="history-list">
          {history.map((item, idx) => {
            const product = products.find((p) => getProductKey(p) === item.id);
            const title = product?.title || product?.name || item.name;
            const imageSrc = getProductImage(product);

            return (
              <li key={idx} className="history-item">
                <img
                  src={imageSrc}
                  alt={title}
                  className="item-thumb"
                />
                <div className="item-main">
                  <div className="item-title">{title}</div>
                  <div className="item-meta">
                    Quantity: {item.qty} · Purchased on {" "}
                    {item.purchasedAt
                      ? new Date(item.purchasedAt).toLocaleDateString()
                      : "recently"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      </div>
    </div>
  );
};

export default CartPage;
