import { useState } from "react";
import "./CheckoutForm.css";

export default function CheckoutForm({ items, total, onClose, onBack }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode ||
      !formData.cardNumber ||
      !formData.expiryDate ||
      !formData.cvv
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email");
      return;
    }

    // Validate phone
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    // Validate card number (basic check - 16 digits)
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      alert("Please enter a valid 16-digit card number");
      return;
    }

    console.log("Order placed:", formData);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-overlay" onClick={onClose}>
        <div className="checkout-container" onClick={(e) => e.stopPropagation()}>
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase.</p>
            <p className="order-details">
              Your order has been confirmed and will be delivered to:
            </p>
            <p className="delivery-address">
              {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
            </p>
            <p className="confirmation-email">
              A confirmation email has been sent to {formData.email}
            </p>
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

              <div className="form-group">
                <label>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                  />
                </div>
              </div>
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
              <div className="summary-total">
                <span>Total Amount:</span>
                <span className="amount">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
