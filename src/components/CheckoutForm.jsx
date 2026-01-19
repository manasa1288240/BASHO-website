import { useState, useEffect } from "react";
import { calculateCartTotal } from "../utils/priceCalculations";
import "./CheckoutForm.css";

export default function CheckoutForm({ items, total, totals, onClose, onBack }) {
  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Use provided totals or calculate if not provided
  const finalTotal = totals?.grandTotal || total;
  const displayTotals = totals || { subtotal: total, shippingCharge: 0, cgst: 0, sgst: 0, grandTotal: total };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Helper function to extract numeric price
  const getNumericPrice = (price) => {
    if (typeof price === "number") return price;
    const numericPrice = parseFloat(String(price).replace(/[^\d.-]/g, ""));
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email");
      setLoading(false);
      return;
    }

    // Validate phone
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      alert("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      setLoading(false);
      return;
    }

    try {
      // Create order
      console.log("📦 Creating order for amount:", finalTotal);

      const orderRes = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          currency: "INR",
          receipt: `order-${Date.now()}`,
        }),
      });

      if (!orderRes.ok) {
        const errorText = await orderRes.text();
        console.error("❌ Server error response:", errorText);
        throw new Error(
          `Server error: ${orderRes.status} ${orderRes.statusText}`
        );
      }

      const orderData = await orderRes.json();
      console.log("✅ Order created:", orderData);
      if (!orderData.success)
        throw new Error(
          orderData.message || orderData.error || "Failed to create order"
        );

      // Open Razorpay checkout
      const options = {
        key:
          import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_S2dB2rrkK9f1cG",
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: "BASHO",
        description: "Product Purchase",
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async (response) => {
          try {
            console.log("💳 Payment completed, verifying...", response);

            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  ...formData,
                  items: items,
                  amount: total,
                },
              }),
            });

            const verifyData = await verifyRes.json();
            console.log("✅ Verification response:", verifyData);

            if (verifyData.success) {
              setOrderPlaced(true);
            } else {
              alert(
                "Payment verification failed: " +
                  (verifyData.message || verifyData.error)
              );
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            alert("Error verifying payment: " + err.message);
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            alert("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("🔴 Payment failed:", response.error);
        setLoading(false);
        alert(
          "Payment failed: " +
            (response.error.description || "Unknown error")
        );
      });

      rzp.open();
    } catch (err) {
      console.error("🔴 Checkout error:", err);
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-overlay" onClick={onClose}>
        <div
          className="checkout-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase.</p>
            <p className="order-details">
              Your order has been confirmed and will be delivered to:
            </p>
            <p className="delivery-address">
              {formData.address}, {formData.city}, {formData.state} -{" "}
              {formData.pincode}
            </p>
            <p className="confirmation-email">
              A confirmation email has been sent to {formData.email}
            </p>
            <div className="order-items">
              <h4>Items Ordered:</h4>
              {items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <span>{item.name || item.title}</span>
                  <span>₹{getNumericPrice(item.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-total">
                <strong>Total Amount: ₹{total.toFixed(2)}</strong>
              </div>
            </div>
            <button className="close-order-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-container" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <h2>Checkout</h2>
          <div></div>
        </div>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Shipping Information */}
            <div className="form-section">
              <h3>Shipping Information</h3>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="form-section">
              <h3>Payment Information</h3>
              <p className="payment-info">
                You will be redirected to Razorpay secure payment gateway
              </p>
            </div>

            {/* Order Summary */}
            <div className="form-section order-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {items.map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <span>{item.name || item.title}</span>
                    <span>₹{getNumericPrice(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal:</span>
                  <span>₹{displayTotals.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                {displayTotals.shippingCharge > 0 && (
                  <div className="breakdown-row">
                    <span>Shipping:</span>
                    <span>₹{displayTotals.shippingCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="breakdown-row">
                  <span>CGST (6%):</span>
                  <span>₹{displayTotals.cgst?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="breakdown-row">
                  <span>SGST (6%):</span>
                  <span>₹{displayTotals.sgst?.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              <div className="summary-total">
                <span>Total Amount:</span>
                <span className="amount">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading
                ? "Processing..."
                : `Pay ₹${finalTotal.toFixed(2)} with Razorpay`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
