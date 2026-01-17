import { Link } from "react-router-dom";
import { useCardStackScroll } from "../hooks/useCardStackScroll";
import pot1 from "../assets/pot1.png";
import pot2 from "../assets/pot2.png";
import pot3 from "../assets/pot3.png";

export default function ProductScroll() {
  const containerRef = useCardStackScroll();

  const products = [
    { img: pot1, name: "Handmade with love, shaped with soul.", price: "" },
    { img: pot2, name: "Every piece is imperfectly perfect — just like art.", price: "" },
    { img: pot3, name: "Crafted slowly, treasured forever.", price: "" },
  ];

  return (
    <section id="products" className="product-section">
      <h2 className="section-title">Our Collection</h2>
      <p className="section-subtitle">
        Each piece is lovingly crafted by hand, embracing the beauty of imperfection
      </p>

      {/* 🔥 HORIZONTAL SCROLL CONTAINER */}
      <div className="products-scroll card-stack-container" ref={containerRef}>
        {products.map((product, index) => (
          <div key={index} className="product-card scroll-card card-stack-item">
            <div className="product-image-wrapper">
              <img
                src={product.img}
                alt={product.name}
                className="product-image"
              />
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">{product.price}</p>
            </div>
          </div>
        ))}

        {/* ⭐ CUSTOM ORDER CARD */}
        <Link to="/products#custom-order" className="product-card scroll-card custom-order-card card-stack-item">

          <div className="product-image-wrapper">
            <img
              src={pot3}
              alt="Custom Orders"
              className="product-image"
            />
          </div>

          <div className="product-info">
            <h3>Custom Orders</h3>
            <p className="product-price">Made for You</p>
          </div>
        </Link>
      </div>

      <div className="section-button-wrapper">
        <Link to="/products" className="more-button">
          View All Products
        </Link>
      </div>
    </section>
  );
}
