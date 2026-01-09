import Footer from "../components/Footer";
import "../styles/CareGuide.css";

export default function CareGuide() {
  return (
    <div className="care-page">
      <div className="featured-header">
        <div className="featured-container">
          <div className="featured-subtitle">Care & Keeping</div>
          <h1 className="featured-title">FULL CARE GUIDE</h1>
          <div className="featured-divider"></div>
        </div>
      </div>

      <section className="care-hero">
        <div className="care-container">
          <h2>How to look after your pottery</h2>
          <p>
            Our pieces are handcrafted with food-safe, lead-free glazes. With a little
            care they will remain beautiful for years — here’s how to get the best
            from them.
          </p>
        </div>
      </section>

      <section className="care-content">
        <div className="care-grid">
          <div className="care-card">
            <h3>For tableware</h3>
            <ul>
              <li>Food-safe and lead-free</li>
              <li>Microwave &amp; oven friendly (avoid thermal shock)</li>
              <li>Dishwasher friendly — top rack recommended</li>
              <li>Handwash gently with mild soap to extend longevity</li>
            </ul>
          </div>

          <div className="care-card">
            <h3>For lights &amp; artifacts</h3>
            <ul>
              <li>Clean with a damp cloth, then dry thoroughly</li>
              <li>Avoid harsh cleaners and abrasive pads</li>
            </ul>
          </div>
        </div>

        <div className="care-extra">
          <h3>Note</h3>
          <ul>
            <li>
              Our products are handmade with care — each piece has its own unique
              individuality. No two pieces are identical.
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
