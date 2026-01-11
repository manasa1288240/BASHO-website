import { useState, useEffect } from 'react';
import './AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : 'http://localhost:5000/api/products';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save product');
      
      fetchProducts();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete product');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', image: '', stock: '' });
    setEditingId(null);
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Product Management</h1>
        <button
          className="btn-add-product"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleInputChange}
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn-save">
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              {product.image && <img src={product.image} alt={product.name} />}
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">₹{product.price}</p>
              <p className="stock">Stock: {product.stock || 0}</p>
              <p className="description">{product.description}</p>
              <div className="actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(product)}
                >
                  ✎ Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(product._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products">No products found</p>
      )}

      <p className="product-count">Total: {filteredProducts.length} products</p>
    </div>
  );
}
