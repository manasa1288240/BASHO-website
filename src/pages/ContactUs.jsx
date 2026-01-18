import React, { useState } from 'react';

export default function ContactUs() {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [reviewText, setReviewText] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    // Replace '/api/contact' with your actual backend endpoint
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://basho-backend.onrender.com'}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
      if (response.ok) {
        alert("Message has been sent successfully!");
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  const handleReviewSubmit = async () => {
    if (rating === 0) return alert("Please select a star rating!");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://basho-backend.onrender.com'}/api/reviews`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ rating, review: reviewText }),
});
      if (response.ok) {
        alert("Review has been written successfully!");
        setRating(0);
        setReviewText('');
      }
    } catch (err) {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="contact-page" style={{ padding: '120px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#442d1c' }}>Want to know more? Reach out to us</h1>
        <p style={{ color: '#666' }}>We'd love to hear from you. Fill out the form below or leave us a review!</p>
      </header>

      <div className="contact-container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '50px', 
          alignItems: 'start' 
      }}>
        {/* Contact Form */}
        <section style={{ textAlign: 'left', padding: '10px' }}>
          <h2 style={{ marginBottom: '20px', color: '#442d1c' }}>Send a Message</h2>
          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" placeholder="Name" style={inputStyle} required 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" placeholder="Email" style={inputStyle} required 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <textarea 
              placeholder="How can we help?" rows="5" style={inputStyle} required
              value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
            <button type="submit" style={buttonStyle}>Send Message</button>
          </form>
        </section>

        {/* Review Section */}
        <section style={{ background: '#f9f7f2', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', color: '#442d1c' }}>Write a Review</h2>
          <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>Share your Basho experience with others.</p>
          
          <div style={{ marginBottom: '20px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} onClick={() => setRating(star)}
                style={{ cursor: 'pointer', fontSize: '2rem', color: star <= rating ? '#8e5022' : '#ccc' }}>★</span>
            ))}
          </div>

          <textarea 
            placeholder="Your feedback..." rows="4" style={{ ...inputStyle, background: 'white' }}
            value={reviewText} onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <button onClick={handleReviewSubmit} type="button" 
            style={{ ...buttonStyle, background: '#8e5022', marginTop: '15px', width: '100%' }}>
            Submit Review
          </button>
        </section>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '12px 15px',
  border: '1px solid #e0d9cf',
  borderRadius: '8px',
  fontSize: '1rem',
  width: '100%', 
  boxSizing: 'border-box', // Crucial for alignment
  fontFamily: 'inherit',
  backgroundColor: '#fff'
};

const buttonStyle = {
  padding: '12px',
  background: '#442d1c',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};