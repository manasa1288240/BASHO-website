// Philosophy.jsx - Enhanced Version
import React from 'react';
import './Philosophy.css'; // Create this CSS file

function Philosophy() {
  const philosophyPoints = [
    {
      icon: '🌸',
      title: 'Wabi-Sabi',
      description: 'Finding beauty in imperfection and the natural cycle of growth and decay.'
    },
    {
      icon: '🎋',
      title: 'Ma (間)',
      description: 'The art of negative space and silence, creating balance through emptiness.'
    },
    {
      icon: '🫖',
      title: 'Omotenashi',
      description: 'Heartfelt hospitality and attention to detail in every interaction.'
    }
  ];

  return (
    <section id="about" className="philosophy-section">
      <div className="philosophy-container">
        <div className="philosophy-header">
          <h2 className="section-title">Our Philosophy</h2>
          <p className="section-subtitle">
            Inspired by Japanese aesthetics and the art of mindful living
          </p>
        </div>

        {/* Three-column layout */}
        <div className="philosophy-grid">
          {philosophyPoints.map((point, index) => (
            <div 
              key={index} 
              className="philosophy-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="philosophy-icon">{point.icon}</div>
              <h3 className="philosophy-card-title">{point.title}</h3>
              <p className="philosophy-card-description">{point.description}</p>
              <div className="philosophy-decoration">
                <div className="decoration-line"></div>
                <div className="decoration-dot"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main philosophy statement */}
        <div className="philosophy-statement">
          <div className="statement-container">
            <div className="japanese-text">「場所」</div>
            <blockquote className="statement-quote">
              "Basho is more than a physical space—it's an atmosphere where every element
              is intentionally curated to spark joy, foster creativity, and provide comfort
              in our increasingly digital world."
            </blockquote>
            <div className="statement-author">
              <div className="author-line"></div>
              <p>— Founders of Basho</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Philosophy;