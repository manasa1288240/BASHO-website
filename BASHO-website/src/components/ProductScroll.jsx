import { Link } from "react-router-dom";
import pot1 from "../assets/pot1.png";
import pot2 from "../assets/pot2.png";
import pot3 from "../assets/pot3.png";

export default function ProductScroll() {
  const products = [
    { img: pot1, name: "Ceramic Bowl", price: "$48" },
    { img: pot2, name: "Tea Cup Set", price: "$65" },
    { img: pot3, name: "Vase Collection", price: "$85" },
  ];

  return (
    <section id="products" className="product-section">
      <h2 className="section-title">Our Collection</h2>
      <p className="section-subtitle">
        Each piece is lovingly crafted by hand, embracing the beauty of imperfection
      </p>

      <div className="products-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
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
      </div>

      <div className="section-button-wrapper">
        <Link to="/products" className="more-button">
          View All Products
        </Link>
      </div>
    </section>
  );
}