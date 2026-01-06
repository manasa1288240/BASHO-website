import { useState } from "react";
import "../styles/WorkshopsPage.css"; // modal + form styles already there

export default function CustomOrderForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    itemType: "",
    otherItem: "",
    quantity: 1,
    size: "",
    customSize: "",
    color: "",
    usage: [],
    idea: "",
    timeline: "",
    budget: "",
    acknowledge: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "usage") {
      setFormData((prev) => {
        if (checked) return { ...prev, usage: [...prev.usage, value] };
        return { ...prev, usage: prev.usage.filter((u) => u !== value) };
      });
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.itemType ||
      !formData.color ||
      !formData.idea ||
      !formData.acknowledge
    ) {
      alert("Please fill all required fields and acknowledge the terms.");
      return;
    }

    // Normally send to backend here...
    console.log("Custom Order Submitted:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          <div className="booking-form-container">
            <h2 className="form-title">Thank You!</h2>
            <p className="form-subtitle">
              We’ve received your custom order request. We’ll get back to you within 24–48 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="booking-form-container">
          <h2 className="form-title">Custom Pottery Order</h2>
          <p className="form-subtitle">Tell us what you’d like, and we’ll craft it for you.</p>

          <form className="booking-form" onSubmit={handleSubmit}>
            {/* Customer Details */}
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>City / Location</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Pottery Details */}
            <div className="form-group">
              <label>Type of Item *</label>
              <select
                name="itemType"
                required
                value={formData.itemType}
                onChange={handleChange}
              >
                <option value="">Select an item</option>
                <option value="Bowl">Bowl</option>
                <option value="Plate">Plate</option>
                <option value="Cup / Mug">Cup / Mug</option>
                <option value="Vase">Vase</option>
                <option value="Dinner Set">Dinner Set</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Other">Other</option>
              </select>
              {formData.itemType === "Other" && (
                <input
                  type="text"
                  name="otherItem"
                  placeholder="Specify other item"
                  value={formData.otherItem}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Size / Dimensions</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                >
                  <option value="">Select size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Custom">Custom</option>
                </select>
                {formData.size === "Custom" && (
                  <input
                    type="text"
                    name="customSize"
                    placeholder="Enter dimensions (cm / inches)"
                    value={formData.customSize}
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Color / Finish *</label>
              <select
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
              >
                <option value="">Select color / finish</option>
                <option value="Natural clay">Natural clay</option>
                <option value="White">White</option>
                <option value="Earthy brown">Earthy brown</option>
                <option value="Pastel">Pastel</option>
                <option value="Glossy">Glossy</option>
                <option value="Matte">Matte</option>
                <option value="Speckled">Speckled</option>
                <option value="Artist's choice">Artist's choice</option>
              </select>
            </div>

            <div className="form-group">
                <label>Usage (optional)</label>
                <div className="form-group-checkboxes">
                    {["Decorative","Daily use","Microwave safe","Gift item"].map(u => (
                    <label key={u}>
                        <input
                            type="checkbox"
                            name="usage"
                            value={u}
                            checked={formData.usage.includes(u)}
                            onChange={handleChange}
                        /> 
                        {u}
                    </label>
                    ))}
                </div>
            </div>


            {/* Idea Description */}
            <div className="form-group">
              <label>Describe Your Idea *</label>
              <textarea
                name="idea"
                required
                value={formData.idea}
                onChange={handleChange}
                placeholder="Describe shape, patterns, or story behind it..."
              />
            </div>

            {/* Timeline & Budget */}
            <div className="form-row">
              <div className="form-group">
                <label>Expected Delivery Time</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                >
                  <option value="">Select timeline</option>
                  <option value="No rush">No rush</option>
                  <option value="2–3 weeks">2–3 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div className="form-group">
                <label>Budget Range</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="">Select budget</option>
                  <option value="₹1,000–₹2,000">₹1,000–₹2,000</option>
                  <option value="₹2,000–₹5,000">₹2,000–₹5,000</option>
                  <option value="₹5,000+">₹5,000+</option>
                  <option value="Open to suggestion">Open to suggestion</option>
                </select>
              </div>
            </div>

            {/* Acknowledge */}
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="acknowledge"
                  checked={formData.acknowledge}
                  onChange={handleChange}
                  required
                />{" "}
                I understand that custom pottery prices may vary based on design, size, and effort.
              </label>
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-btn">
                Request Custom Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
