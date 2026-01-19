// import React, { useState } from 'react';

// export default function ContactUs() {
//   const [rating, setRating] = useState(0);
//   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
//   const [reviewText, setReviewText] = useState('');

//   const handleContactSubmit = async (e) => {
//     e.preventDefault();
//     // Replace '/api/contact' with your actual backend endpoint
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://basho-backend.onrender.com'}/api/contact`, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(formData),
// });
//       if (response.ok) {
//         alert("Message has been sent successfully!");
//         setFormData({ name: '', email: '', message: '' });
//       }
//     } catch (err) {
//       alert("Failed to send message.");
//     }
//   };

//   const handleReviewSubmit = async () => {
//     if (rating === 0) return alert("Please select a star rating!");
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://basho-backend.onrender.com'}/api/reviews`, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ rating, review: reviewText }),
// });
//       if (response.ok) {
//         alert("Review has been written successfully!");
//         setRating(0);
//         setReviewText('');
//       }
//     } catch (err) {
//       alert("Failed to submit review.");
//     }
//   };

//   return (
//     <div className="contact-page" style={{ padding: '120px 20px', maxWidth: '1000px', margin: '0 auto' }}>
//       <header style={{ textAlign: 'center', marginBottom: '50px' }}>
//         <h1 style={{ fontSize: '2.5rem', color: '#442d1c' }}>Want to know more? Reach out to us</h1>
//         <p style={{ color: '#666' }}>We'd love to hear from you. Fill out the form below or leave us a review!</p>
//       </header>

//       <div className="contact-container" style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
//           gap: '50px', 
//           alignItems: 'start' 
//       }}>
//         {/* Contact Form */}
//         <section style={{ textAlign: 'left', padding: '10px' }}>
//           <h2 style={{ marginBottom: '20px', color: '#442d1c' }}>Send a Message</h2>
//           <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//             <input 
//               type="text" placeholder="Name" style={inputStyle} required 
//               value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
//             />
//             <input 
//               type="email" placeholder="Email" style={inputStyle} required 
//               value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
//             />
//             <textarea 
//               placeholder="How can we help?" rows="5" style={inputStyle} required
//               value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
//             ></textarea>
//             <button type="submit" style={buttonStyle}>Send Message</button>
//           </form>
//         </section>

//         {/* Review Section */}
//         <section style={{ background: '#f9f7f2', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
//           <h2 style={{ marginBottom: '10px', color: '#442d1c' }}>Write a Review</h2>
//           <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>Share your Basho experience with others.</p>
          
//           <div style={{ marginBottom: '20px' }}>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <span key={star} onClick={() => setRating(star)}
//                 style={{ cursor: 'pointer', fontSize: '2rem', color: star <= rating ? '#8e5022' : '#ccc' }}>★</span>
//             ))}
//           </div>

//           <textarea 
//             placeholder="Your feedback..." rows="4" style={{ ...inputStyle, background: 'white' }}
//             value={reviewText} onChange={(e) => setReviewText(e.target.value)}
//           ></textarea>
//           <button onClick={handleReviewSubmit} type="button" 
//             style={{ ...buttonStyle, background: '#8e5022', marginTop: '15px', width: '100%' }}>
//             Submit Review
//           </button>
//         </section>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   padding: '12px 15px',
//   border: '1px solid #e0d9cf',
//   borderRadius: '8px',
//   fontSize: '1rem',
//   width: '100%', 
//   boxSizing: 'border-box', // Crucial for alignment
//   fontFamily: 'inherit',
//   backgroundColor: '#fff'
// };

// const buttonStyle = {
//   padding: '12px',
//   background: '#442d1c',
//   color: 'white',
//   border: 'none',
//   borderRadius: '4px',
//   cursor: 'pointer',
//   fontWeight: 'bold'
// };
// --------------------------------------------
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';

export default function ContactUs() {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [reviewText, setReviewText] = useState('');

  // --- BACKEND LOGIC (PRESERVED) ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="contact-page-wrapper" style={{ backgroundColor: '#fffcf9', minHeight: '100vh' }}>
      <div className="contact-page" style={{ padding: '140px 20px 80px', maxWidth: '1250px', margin: '0 auto' }}>
        
        <motion.header {...fadeInUp} style={{ textAlign: 'center', marginBottom: '70px' }}>
          <span style={{ color: '#C85428', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem', fontWeight: 'bold' }}>Get in Touch</span>
          <h1 style={{ fontSize: '3rem', color: '#442D1C', fontFamily: '"Playfair Display", serif', marginTop: '10px' }}>Let’s start a conversation</h1>
          <div style={{ width: '70px', height: '2px', backgroundColor: '#EDD8B4', margin: '20px auto' }}></div>
        </motion.header>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px' }}>
          
          {/* Column 1: Studio Details */}
          <motion.section {...fadeInUp} transition={{ delay: 0.2 }} style={cardStyle}>
            <h3 style={titleStyle}>The Studio</h3>
            
            <div style={{ ...infoItemStyle, alignItems: 'flex-start', marginTop: '10px' }}>
              <MapPin size={24} color="#8E5022" style={{ marginTop: '3px', flexShrink: 0 }} />
              <p style={{ margin: 0, lineHeight: '1.7', fontSize: '1rem' }}>311, Silent Zone, Gavier, Dumas Road, Surat-395007, India</p>
            </div>
            
            <a href="https://wa.me/919879575601" target="_blank" rel="noopener noreferrer" style={linkResetStyle}>
              <div style={infoItemStyle}>
                <MessageCircle size={24} color="#8E5022" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '1rem' }}>+91 98795 75601 (WhatsApp)</p>
              </div>
            </a>

            <div style={infoItemStyle}>
              <Mail size={24} color="#8E5022" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '1rem' }}>bashobyyshivangi@gmail.com</p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '35px', borderTop: '1px solid #EDD8B4' }}>
              <p style={{ marginBottom: '15px', fontWeight: 'bold', color: '#442D1C' }}>Follow our process</p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <a href="https://www.instagram.com/bashobyyshivangi/" target="_blank" rel="noopener noreferrer" style={{ color: '#652810' }}>
                  <Instagram style={{ cursor: 'pointer' }} size={30} />
                </a>
                <a href="https://wa.me/919879575601" target="_blank" rel="noopener noreferrer" style={{ color: '#652810' }}>
                  <MessageCircle style={{ cursor: 'pointer' }} size={30} />
                </a>
              </div>
            </div>
          </motion.section>

          {/* Column 2: Contact Form */}
          <motion.section {...fadeInUp} transition={{ delay: 0.4 }} style={cardStyle}>
            <h3 style={titleStyle}>Send a Message</h3>
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <input type="text" placeholder="Your Name" style={inputStyle} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Your Email" style={inputStyle} required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <textarea placeholder="How can we help?" rows="5" style={inputStyle} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              <button type="submit" style={mainButtonStyle}>Send Message</button>
            </form>
          </motion.section>

          {/* Column 3: Review Section */}
          <motion.section {...fadeInUp} transition={{ delay: 0.6 }} style={{ ...cardStyle, backgroundColor: '#442D1C', color: '#EDD8B4' }}>
            <h3 style={{ ...titleStyle, color: '#EDD8B4' }}>Share the Love</h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '25px' }}>How was your Bashō experience?</p>
            <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onClick={() => setRating(star)} style={{ cursor: 'pointer', fontSize: '2.2rem', color: star <= rating ? '#EDD8B4' : '#652810' }}>★</span>
              ))}
            </div>
            <textarea placeholder="Your feedback..." rows="4" style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: '#652810' }} value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
            <button onClick={handleReviewSubmit} type="button" style={reviewButtonStyle}>Submit Review</button>
          </motion.section>

        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const cardStyle = {
  padding: '50px 35px',
  borderRadius: '28px',
  backgroundColor: '#fff',
  boxShadow: '0 18px 40px rgba(68, 45, 28, 0.05)',
  border: '1px solid rgba(237, 216, 180, 0.5)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '520px' 
};

const titleStyle = {
  fontSize: '1.65rem',
  color: '#442D1C',
  fontFamily: '"Playfair Display", serif',
  marginBottom: '30px'
};

const infoItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  marginBottom: '25px',
  color: '#652810'
};

const linkResetStyle = {
  textDecoration: 'none',
  color: 'inherit'
};

const inputStyle = {
  padding: '16px 18px',
  border: '1px solid #EDD8B4',
  borderRadius: '12px',
  fontSize: '0.95rem',
  width: '100%',
  backgroundColor: '#fffcf9',
  outline: 'none',
  fontFamily: 'inherit'
};

const mainButtonStyle = {
  padding: '16px',
  background: '#8E5022',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: '0.3s ease',
  boxShadow: '0 5px 15px rgba(142, 80, 34, 0.2)'
};

const reviewButtonStyle = {
  ...mainButtonStyle,
  background: '#EDD8B4',
  color: '#442D1C',
  marginTop: '15px',
  width: '100%'
};