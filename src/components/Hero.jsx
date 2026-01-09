import claybg from "../assets/claybg.jpg";
import pottery from "../assets/pottery.jpg";
import "./Hero.css";

export default function Hero() {
  return (
    <div id="home" className="hero-split">
      {/* Left Side - Images */}
      <div className="hero-left">
        <div className="hero-image-container">
          <img src={claybg} alt="Clay Background" className="hero-clay-bg" />
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="hero-right">
        <div className="hero-content">
          {/* Japanese Title */}
          <h1 className="japanese-title">場所</h1>
          
          {/* Definition */}
          <div className="basho-definition">
            <div className="definition-label">BASHO</div>
            <div className="definition-details">
              <span className="pronunciation">noun</span>
              <span className="pronunciation-sep">•</span>
              <span className="pronunciation">/bä-shō/</span>
            </div>
            <p className="definition-meaning">
              A place where joy, creativity, and comfort naturally unfold
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}