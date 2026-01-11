import { useState, useEffect } from 'react';
import './AdminGallery.css';

export default function AdminGallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: 'products',
    featured: false,
    description: ''
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/gallery', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch gallery');
      const data = await response.json();
      setGalleryItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const url = editing
        ? `http://localhost:5000/api/gallery/${editing}`
        : 'http://localhost:5000/api/gallery';
      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save gallery item');
      fetchGallery();
      setFormData({
        title: '',
        image: '',
        category: 'products',
        featured: false,
        description: ''
      });
      setEditing(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/gallery/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete image');
      fetchGallery();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFeatured = async (itemId, currentFeatured) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/gallery/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ featured: !currentFeatured })
      });
      if (!response.ok) throw new Error('Failed to update featured status');
      fetchGallery();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (item) => {
    setFormData(item);
    setEditing(item._id);
    setShowForm(true);
  };

  const filteredItems = galleryItems.filter(item => {
    const matchSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  if (loading) return <div className="loading">Loading gallery...</div>;

  return (
    <div className="admin-gallery">
      <h1>Gallery & Image Management</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Images</p>
          <p className="stat-value">{galleryItems.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Featured</p>
          <p className="stat-value">
            {galleryItems.filter(i => i.featured).length}
          </p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="gallery-header">
        <input
          type="text"
          placeholder="Search images by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter"
        >
          <option value="all">All Categories</option>
          <option value="products">Products</option>
          <option value="workshops">Workshops</option>
          <option value="events">Events</option>
          <option value="about">About Us</option>
        </select>
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({
              title: '',
              image: '',
              category: 'products',
              featured: false,
              description: ''
            });
          }}
        >
          {showForm ? 'Cancel' : '+ Add Image'}
        </button>
      </div>

      {showForm && (
        <form className="gallery-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Image Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Image URL *</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="products">Products</option>
                <option value="workshops">Workshops</option>
                <option value="events">Events</option>
                <option value="about">About Us</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label htmlFor="featured">Mark as Featured</label>
          </div>

          <button type="submit" className="submit-btn">
            {editing ? 'Update Image' : 'Add Image'}
          </button>
        </form>
      )}

      {filteredItems.length > 0 ? (
        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <div key={item._id} className={`gallery-item ${item.featured ? 'featured' : ''}`}>
              <div className="image-wrapper">
                <img src={item.image} alt={item.title} />
                {item.featured && <div className="featured-badge">⭐ Featured</div>}
              </div>
              <div className="item-info">
                <h3>{item.title}</h3>
                <p className="category">{item.category}</p>
                {item.description && <p className="description">{item.description}</p>}
                <div className="item-actions">
                  <button
                    className={`featured-btn ${item.featured ? 'active' : ''}`}
                    onClick={() => toggleFeatured(item._id, item.featured)}
                    title="Toggle featured status"
                  >
                    ⭐
                  </button>
                  <button className="edit-btn" onClick={() => startEdit(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteItem(item._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-items">No images found</p>
      )}
    </div>
  );
}
