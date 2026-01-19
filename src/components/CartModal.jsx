import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import CheckoutForm from "./CheckoutForm";
import { calculateCartTotal, getNumericPrice } from "../utils/priceCalculations";
import "./CartModal.css";

export default function CartModal({ onClose }) {
  const { items, removeProduct } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const products = items.products || [];
  const workshops = items.workshops || [];
  const allItems = [...products, ...workshops];

  // Calculate cart total with GST and shipping
  const totals = calculateCartTotal(items, {});
  const total = totals?.grandTotal || 0;

  if (showCheckout) {
    return (
      <CheckoutForm
        items={allItems}
        total={total}
        totals={totals}
        onClose={onClose}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-modal-content">
          {allItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {allItems.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <div className="item-details">
                      <h3>{item.name || item.title}</h3>
                      <p className="item-price">₹{getNumericPrice(item.price).toFixed(2)}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeProduct(item.id || item._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{totals?.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="summary-row">
                  <span>Weight:</span>
                  <span>{totals?.totalWeight?.toFixed(3) || "0.000"} kg</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>₹{totals?.shippingCharge?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="summary-row">
                  <span>CGST (6%):</span>
                  <span>₹{totals?.cgst?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="summary-row">
                  <span>SGST (6%):</span>
                  <span>₹{totals?.sgst?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="summary-row total">
                  <span>Grand Total:</span>
                  <span>₹{totals?.grandTotal?.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
