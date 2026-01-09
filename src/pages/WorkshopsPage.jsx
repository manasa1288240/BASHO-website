import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import workshopsData from "../data/workshops";
import "../styles/WorkshopsPage.css";

export default function WorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="workshops-page">
      {/* FEATURED HEADER */}
      <div className="featured-header">
        <div className="featured-container">
          <div className="featured-subtitle">Learn & Create</div>
          <h1 className="featured-title">POTTERY WORKSHOPS</h1>
          <div className="featured-divider"></div>
        </div>
      </div>

      {/* WORKSHOPS GRID */}
      <section className="grid">
        {workshopsData.map((workshop) => (
          <div 
            key={workshop.id} 
            className="product-card workshop-card-item"
            onClick={() => setSelectedWorkshop(workshop)}
          >
            <div className="img-wrap">
              <img src={workshop.image} alt={workshop.title} />
              
              <div className="hover-info">
                <p>{workshop.description}</p>
              </div>
              
              <span className="price">{workshop.price}</span>
              <span className="duration-badge">{workshop.duration}</span>
            </div>
            
            <span className="category">{workshop.level}</span>
            <h3>{workshop.title}</h3>
          </div>
        ))}
      </section>

      {/* WORKSHOP DETAIL MODAL */}
      {selectedWorkshop && (
        <WorkshopDetailModal 
          workshop={selectedWorkshop} 
          onClose={() => setSelectedWorkshop(null)} 
        />
      )}
      
      <Footer />
    </div>
  );
}

function WorkshopDetailModal({ workshop, onClose }) {
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    participants: "1",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Extract price number
      const priceNumber = parseInt(workshop.price.replace('₹', '').replace(',', ''));
      const totalAmount = priceNumber * parseInt(formData.participants || 1);

      // Step 1: Create Razorpay order
      const orderRes = await fetch("http://localhost:5000/api/workshops/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          receipt: `workshop-${Date.now()}`
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error);

      // Step 2: Open Razorpay checkout
      const options = {
        key: "rzp_test_S1ra8fUDoBRjlX", // Your Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "BASHO",
        description: `${workshop.title} Workshop Booking`,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        handler: async (response) => {
          // Step 3: Verify payment and save booking
          try {
            const bookingData = {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              workshopType: workshop.title,
              preferredDate: formData.date,
              participants: formData.participants,
              message: formData.message
            };

            const verifyRes = await fetch("http://localhost:5000/api/workshops/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Booking confirmed! Payment successful. You'll receive a confirmation email shortly.");
              onClose();
            } else {
              alert("Payment verification failed: " + verifyData.message);
            }
          } catch (err) {
            console.error(err);
            alert("Error processing booking. Please contact support.");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            alert("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {!showBooking ? (
          <div className="workshop-detail">
            <div className="workshop-detail-image">
              <img src={workshop.image} alt={workshop.title} />
              <span className="detail-price">{workshop.price}</span>
            </div>
            
            <div className="workshop-detail-info">
              <span className="detail-category">{workshop.level}</span>
              <h2 className="detail-title">{workshop.title}</h2>
              
              <div className="detail-meta">
                <div className="meta-item">
                  <strong>Duration:</strong> {workshop.duration}
                </div>
                <div className="meta-item">
                  <strong>Max Participants:</strong> {workshop.maxParticipants}
                </div>
              </div>
              
              <p className="detail-description">{workshop.description}</p>
              
              <div className="detail-section">
                <h3>What's Included</h3>
                <ul className="includes-list">
                  {workshop.includes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="detail-section">
                <h3>Available Schedule</h3>
                <ul className="schedule-list">
                  {workshop.schedule.map((time, i) => (
                    <li key={i}>{time}</li>
                  ))}
                </ul>
              </div>
              
              <button 
                className="book-now-btn"
                onClick={() => setShowBooking(true)}
              >
                Book This Workshop
              </button>
            </div>
          </div>
        ) : (
          <div className="booking-form-container">
            <button 
              className="back-btn"
              onClick={() => setShowBooking(false)}
            >
              ← Back to Details
            </button>
            
            <h2 className="form-title">Book: {workshop.title}</h2>
            <p className="form-subtitle">Fill in your details and we'll confirm your spot</p>
            
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <select 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  >
                    <option value="">Select a date</option>
                    {workshop.schedule.map((time, i) => (
                      <option key={i} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Number of Participants *</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={workshop.maxParticipants}
                    required
                    value={formData.participants}
                    onChange={(e) => setFormData({...formData, participants: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Special Requests or Questions</label>
                <textarea 
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Any dietary restrictions, specific goals, or questions..."
                />
              </div>
              
              <div className="form-footer">
                <p className="form-note">
                  Total: <strong>{workshop.price}</strong> × {formData.participants} = 
                  <strong> ₹{parseInt(workshop.price.replace('₹', '').replace(',', '')) * parseInt(formData.participants || 1)}</strong>
                </p>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Processing..." : "Pay & Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}