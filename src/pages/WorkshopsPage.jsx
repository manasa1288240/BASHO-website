import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoginAlert from "../components/LoginAlert";
import workshopsData from "../data/workshops";
import "../styles/WorkshopsPage.css";

/* ================================================= */
/* HELPERS */
/* ================================================= */

function getStartDateTime(workshop) {
  if (!workshop.date || !workshop.time || workshop.date === "Flexible")
    return null;
  const startTime = workshop.time.split("–")[0].trim();
  return new Date(`${workshop.date} ${startTime}`);
}

function isCompleted(workshop) {
  const start = getStartDateTime(workshop);
  return start ? new Date() > start : false;
}

function isBookingClosed(workshop) {
  const start = getStartDateTime(workshop);
  if (!start) return false;
  return new Date() > new Date(start.getTime() - 30 * 60 * 1000); // 30 mins
}

function isFullyBooked(workshop) {
  return (workshop.bookedSeats || 0) >= (workshop.maxParticipants || 0);
}

/* ================================================= */
/* MAIN PAGE COMPONENT */
/* ================================================= */

export default function WorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();

  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  const triggerNotify = (msg, type = "info") => {
    setNotification({ msg, type });
  };

  const isLoggedIn = () => {
    return !!localStorage.getItem("basho_user");
  };

  const activeWorkshops = workshopsData
    .filter((w) => !isCompleted(w) && !w.isCustom)
    .sort((a, b) => getStartDateTime(a) - getStartDateTime(b));

  const completedWorkshops = workshopsData.filter(
    (w) => isCompleted(w) && !w.isCustom
  );

  const customWorkshop = workshopsData.find((w) => w.isCustom);

  return (
    <div className="workshops-page">
      {notification && (
        <Toast
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="featured-header">
        <div className="featured-container">
          <div className="featured-subtitle">Learn & Create</div>
          <h1 className="featured-title">POTTERY WORKSHOPS</h1>
          <div className="featured-divider"></div>
        </div>
      </div>

      <section className="workshop-section">
        <h2 className="section-label">Upcoming Sessions</h2>
        <div className="grid">
          {activeWorkshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onClick={() => setSelectedWorkshop(workshop)}
            />
          ))}

          {customWorkshop && (
            <WorkshopCard
              workshop={customWorkshop}
              onClick={() => setSelectedWorkshop(customWorkshop)}
            />
          )}
        </div>
      </section>

      {completedWorkshops.length > 0 && (
        <section className="workshop-section completed-area">
          <h2 className="section-label">Past Workshops</h2>
          <div className="grid">
            {completedWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="product-card workshop-card-item grayscale-card"
                onClick={() => setSelectedWorkshop(workshop)}
              >
                <div className="img-wrap">
                  <img src={workshop.image} alt={workshop.title} />
                  <div className="completed-overlay">Workshop Finished</div>
                </div>
                <h3>{workshop.title}</h3>
                <p className="completed-date">{workshop.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedWorkshop && (
        <WorkshopModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
          triggerNotify={triggerNotify}
          isLoggedIn={isLoggedIn}
          setShowLoginAlert={setShowLoginAlert}
          API_URL={API_URL}
        />
      )}

      {showLoginAlert && (
        <LoginAlert
          onClose={() => setShowLoginAlert(false)}
          onConfirm={() => {
            setShowLoginAlert(false);
            setSelectedWorkshop(null);
            navigate("/auth");
          }}
        />
      )}

      <Footer />
    </div>
  );
}

/* ================================================= */
/* UI COMPONENTS */
/* ================================================= */

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-message ${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️"}
        </span>
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

function WorkshopCard({ workshop, onClick }) {
  const full = isFullyBooked(workshop);

  return (
    <div className="product-card workshop-card-item" onClick={onClick}>
      <div className="img-wrap">
        <img src={workshop.image} alt={workshop.title} />
        {full && !workshop.isCustom && (
          <div className="sold-out-badge">Sold Out</div>
        )}
        <span className="price">{workshop.price}</span>
        <span className="duration-badge">{workshop.duration}</span>
      </div>
      <h3>{workshop.title}</h3>

      {!workshop.isCustom && (
        <p className={`seats-status ${full ? "text-red" : "text-green"}`}>
          {full
            ? "No seats left"
            : `${workshop.maxParticipants - workshop.bookedSeats} spots left`}
        </p>
      )}
    </div>
  );
}

function WorkshopModal({
  workshop,
  onClose,
  triggerNotify,
  isLoggedIn,
  setShowLoginAlert,
  API_URL,
}) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const closed = isBookingClosed(workshop);
  const full = isFullyBooked(workshop);

  const handleBookClick = () => {
    if (!isLoggedIn()) {
      setShowLoginAlert(true);
      return;
    }
    if (closed) {
      triggerNotify("Booking closed 30 mins before start.", "error");
    } else if (full) {
      triggerNotify("Sorry, this workshop is fully booked!", "error");
    } else {
      setShowBookingForm(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-inner-scroll">
          {workshop.isCustom ? (
            <CustomWorkshopForm triggerNotify={triggerNotify} />
          ) : (
            <>
              {!showBookingForm ? (
                <>
                  <WorkshopDetails workshop={workshop} />
                  <div className="modal-footer-btn-container">
                    <button
                      className={`book-now-btn ${
                        closed || full ? "disabled-btn" : ""
                      }`}
                      onClick={handleBookClick}
                    >
                      {closed
                        ? "Booking Closed"
                        : full
                        ? "Sold Out"
                        : "Book This Workshop"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="back-btn"
                    onClick={() => setShowBookingForm(false)}
                  >
                    ← Back
                  </button>

                  <WorkshopBookingForm
                    workshop={workshop}
                    triggerNotify={triggerNotify}
                    API_URL={API_URL}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* FORMS */
/* ================================================= */

function WorkshopBookingForm({ workshop, triggerNotify, API_URL }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.phone || !formData.email || !formData.source) {
      triggerNotify("Please fill in all fields", "error");
      setLoading(false);
      return;
    }

    try {
      triggerNotify("Creating payment order...", "info");

      // Extract numeric price
      const priceText = workshop.price.replace(/[^\d]/g, "");
      const amount = parseInt(priceText);

      if (!amount || amount <= 0) throw new Error("Invalid workshop price");

      const orderResponse = await fetch(`${API_URL}/api/workshops/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: `workshop-${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error("❌ Server error:", errorText);
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed");
      }

      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => openRazorpay(orderData);
        script.onerror = () => {
          triggerNotify("Failed to load payment gateway", "error");
          setLoading(false);
        };
        document.body.appendChild(script);
      } else {
        openRazorpay(orderData);
      }
    } catch (error) {
      console.error("🔴 Workshop booking error:", error);
      triggerNotify("Error: " + error.message, "error");
      setLoading(false);
    }
  };

  const openRazorpay = (orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_S2dB2rrkK9f1cG",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "BASHO Pottery",
      description: `${workshop.title} Workshop`,
      order_id: orderData.orderId,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      handler: async (response) => {
        try {
          triggerNotify("Verifying payment...", "info");

          const verifyResponse = await fetch(
            `${API_URL}/api/workshops/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  workshopType: workshop.title,
                  preferredDate: workshop.date,
                  participants: 1,
                  source: formData.source,
                },
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            triggerNotify(
              "✅ Workshop booked successfully! Check your email for confirmation.",
              "success"
            );
            setLoading(false);
            setTimeout(() => window.location.reload(), 2000);
          } else {
            triggerNotify(
              "Payment verification failed: " +
                (verifyData.message || "Unknown error"),
              "error"
            );
            setLoading(false);
          }
        } catch (error) {
          triggerNotify("Error verifying payment: " + error.message, "error");
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          triggerNotify("Payment cancelled", "info");
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      triggerNotify(
        "Payment failed: " + (response.error.description || "Unknown error"),
        "error"
      );
      setLoading(false);
    });

    rzp.open();
  };

  return (
    <form className="booking-form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Booking Details</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>How did you hear about us? *</label>
        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          required
        >
          <option value="">Select Option</option>
          <option value="instagram">Instagram</option>
          <option value="google">Google Search</option>
          <option value="friends">Friends/Family</option>
        </select>
      </div>

      <div className="form-summary">
        <p className="total-price">
          Total: <span>{workshop.price}</span>
        </p>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Processing..." : "Pay & Confirm"}
        </button>
      </div>
    </form>
  );
}

function CustomWorkshopForm({ triggerNotify }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="custom-form success-msg">
        <h2>Request Sent! ✅</h2>
        <p>We'll reach out soon to confirm your pottery session.</p>
      </div>
    );
  }

  return (
    <form
      className="custom-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        triggerNotify("Request sent successfully!", "success");
      }}
    >
      <h2 className="form-title">Custom Experience</h2>

      <div className="form-group">
        <label>Session Type *</label>
        <select required>
          <option value="">Select Type</option>
          <option value="one-on-one">One-on-One Session</option>
          <option value="date">Pottery Date</option>
          <option value="group">Private Group Event</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Name *</label>
          <input type="text" required />
        </div>
        <div className="form-group">
          <label>Phone *</label>
          <input type="tel" required />
        </div>
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input type="email" required />
      </div>

      <div className="form-group">
        <label>Message</label>
        <textarea rows="3"></textarea>
      </div>

      <button type="submit" className="submit-btn">
        Send Request
      </button>
    </form>
  );
}

function WorkshopDetails({ workshop }) {
  return (
    <div className="workshop-detail">
      <div className="workshop-detail-image">
        <img src={workshop.image} alt={workshop.title} />
        <span className="detail-price">{workshop.price}</span>
      </div>

      <div className="workshop-detail-info">
        <h2 className="detail-title">{workshop.title}</h2>

        <div className="detail-meta">
          <p>
            <strong>Date:</strong> {workshop.date}
          </p>
          <p>
            <strong>Time:</strong> {workshop.time}
          </p>
          <p>
            <strong>Location:</strong> {workshop.location}
          </p>
        </div>

        <p className="detail-description">{workshop.description}</p>
      </div>
    </div>
  );
}
