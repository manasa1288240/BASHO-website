import { useCart } from "../contexts/CartContext";

export default function ProductCard({ product }) {
  const { addProduct } = useCart();

  const handleAddToCart = () => {
    addProduct(product);
    alert(`${product.name || product.title} added to cart!`);
  };

  return (
    <div className="product-card">
      <div className="img-wrap">
        <img src={product.image} alt={product.name} />

        <div className="hover-info">
          <p>{product.description}</p>
        </div>

        <span className="price">{product.price}</span>
      </div>

      <span className="category">{product.category}</span>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
}
