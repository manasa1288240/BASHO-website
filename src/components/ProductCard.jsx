import { useState } from "react";
import ProductQuickViewModal from "./ProductQuickViewModal";

export default function ProductCard({ product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleCardClick = () => {
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="product-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
        <div className="img-wrap">
          <img src={product.image} alt={product.name} />

          <div className="hover-info">
            <p>{product.description}</p>
          </div>

          <span className="price">{product.price}</span>
        </div>

        <div className="product-info">
          <span className="category">{product.category}</span>
          <h3>{product.name}</h3>
        </div>
      </div>

      {/* Modal Popup */}
      <ProductQuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
