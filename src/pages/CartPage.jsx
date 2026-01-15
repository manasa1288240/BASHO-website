import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import CheckoutForm from "../components/CheckoutForm";
import featuredProducts from "../data/products";
import pot3 from "../assets/pot3.png";
import "../styles/CartWishlist.css";

const safeArray = (v) => (Array.isArray(v) ? v : []);

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, history = [], increaseQty, decreaseQty, removeFromCart } =
    useShop();
  const [products, setProducts] = useState(featuredProducts);
  const [showCheckout, setShowCheckout] = useState(false);
  const safeCart = Array.isArray(cart) ? cart : [];
  const safeHistory = Array.isArray(history) ? history : [];

  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Load full product data so we can show images in the cart
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
    if (!product) return pot3;
    if (product.image) return product.image;

    const staticMatch = featuredProducts.find((p) => p.name === product.name);
    if (staticMatch?.image) return staticMatch.image;

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    return pot3;
  };

  const getNumericPrice = (price) => {
    if (typeof price === "number") return price;
    const numericPrice = parseFloat(String(price).replace(/[^\d.-]/g, ""));
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  const cartIsEmpty = safeCart.length === 0;

  // Get cart items with full product data
  const cartItems =
    safeCart.map((item) => {
      const product = products.find((p) => getProductKey(p) === item.id);
      return {
        ...product,
        name: product?.title || product?.name || item.name,
        price: getNumericPrice(product?.price ?? item.price ?? 0),
        id: item.id,
        qty: item.qty ?? 1,
      };
    }) || [];

  const total = cartItems.reduce((sum, item) => {
    return sum + getNumericPrice(item.price) * item.qty;
  }, 0);

  if (showCheckout) {
    return (
      <CheckoutForm
        items={cartItems}
        total={total}
        onClose={() => {
          setShowCheckout(false);
          navigate("/");
        }}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

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
          <span role="img" aria-label="cart">
            🛒
          </span>{" "}
          Your Cart
        </h2>

        {cartIsEmpty ? (
          <p>No items in cart.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => {
                const imageSrc = getProductImage(item);

                return (
                  <li key={item.id} className="cart-item">
                    <img src={imageSrc} alt={item.name} className="item-thumb" />
                    <div className="item-main">
                      <div className="item-title">{item.name}</div>
                      <div className="item-meta">
                        Price: ₹{getNumericPrice(item.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="item-actions">
                      {/* Quantity controls */}
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => decreaseQty(item.id)}
                          disabled={item.qty <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="qty-count">{item.qty}</span>

                        <button
                          className="qty-btn"
                          onClick={() => increaseQty(item.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Item subtotal */}
                      <div className="item-subtotal">
                        ₹{(getNumericPrice(item.price) * item.qty).toFixed(2)}
                      </div>

                      {/* Remove */}
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-summary-section">
              <div className="summary-total">
                <span>Total:</span>
                <span className="total-amount">₹{total.toFixed(2)}</span>
              </div>
              <button
                className="checkout-btn"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}

        <h3>Purchase History</h3>
        {safeHistory.length === 0 ? (
          <p>No previous purchases.</p>
        ) : (
          <ul className="history-list">
            {safeHistory.map((item, idx) => {
              const product = products.find((p) => getProductKey(p) === item.id);
              const title = product?.title || product?.name || item.name;
              const imageSrc = getProductImage(product);

              return (
                <li key={idx} className="history-item">
                  <img src={imageSrc} alt={title} className="item-thumb" />
                  <div className="item-main">
                    <div className="item-title">{title}</div>
                    <div className="item-meta">
                      Quantity: {item.qty} · Purchased on{" "}
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
