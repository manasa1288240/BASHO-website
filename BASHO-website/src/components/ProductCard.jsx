export default function ProductCard({ product }) {
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
    </div>
  );
}
