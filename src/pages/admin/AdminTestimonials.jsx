import { useState, useEffect } from 'react';
import './AdminTestimonials.css';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/testimonials', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveTestimonial = async (testimonialId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved', featured: true })
      });
      if (!response.ok) throw new Error('Failed to approve testimonial');
      fetchTestimonials();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectTestimonial = async (testimonialId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (!response.ok) throw new Error('Failed to reject testimonial');
      fetchTestimonials();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFeatured = async (testimonialId, currentFeatured) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ featured: !currentFeatured })
      });
      if (!response.ok) throw new Error('Failed to update featured status');
      fetchTestimonials();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTestimonial = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      fetchTestimonials();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchSearch =
      testimonial.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || testimonial.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    featured: testimonials.filter(t => t.featured).length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  };

  if (loading) return <div className="loading">Loading testimonials...</div>;

  return (
    <div className="admin-testimonials">
      <h1>Testimonials Management</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card pending">
          <p className="stat-label">Pending Review</p>
          <p className="stat-value">{stats.pending}</p>
        </div>
        <div className="stat-card approved">
          <p className="stat-label">Approved</p>
          <p className="stat-value">{stats.approved}</p>
        </div>
        <div className="stat-card featured">
          <p className="stat-label">Featured</p>
          <p className="stat-value">{stats.featured}</p>
        </div>
        <div className="stat-card rejected">
          <p className="stat-label">Rejected</p>
          <p className="stat-value">{stats.rejected}</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredTestimonials.length > 0 ? (
        <div className="testimonials-container">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial._id} className={`testimonial-card status-${testimonial.status}`}>
              <div className="testimonial-header">
                <div>
                  <h3>{testimonial.customerName}</h3>
                  <p className="meta">{testimonial.email}</p>
                </div>
                <div className="badges">
                  <span className={`status-badge status-${testimonial.status}`}>
                    {testimonial.status?.toUpperCase()}
                  </span>
                  {testimonial.featured && (
                    <span className="featured-badge">⭐ FEATURED</span>
                  )}
                </div>
              </div>

              <div className="testimonial-rating">
                <div className="stars">
                  {Array(testimonial.rating || 5).fill('⭐').join('')}
                </div>
                <span className="rating-text">({testimonial.rating || 5}/5)</span>
              </div>

              <p className="testimonial-text">"{testimonial.text}"</p>

              {testimonial.productOrServiceName && (
                <p className="related-to">
                  <strong>Related to:</strong> {testimonial.productOrServiceName}
                </p>
              )}

              <p className="date">
                <small>Submitted: {new Date(testimonial.createdAt).toLocaleDateString()}</small>
              </p>

              <div className="testimonial-actions">
                {testimonial.status === 'pending' && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => approveTestimonial(testimonial._id)}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => rejectTestimonial(testimonial._id)}
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
                {testimonial.status === 'approved' && (
                  <button
                    className={`featured-btn ${testimonial.featured ? 'active' : ''}`}
                    onClick={() => toggleFeatured(testimonial._id, testimonial.featured)}
                    title="Toggle featured status"
                  >
                    {testimonial.featured ? '⭐ Unfeature' : '☆ Make Featured'}
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteTestimonial(testimonial._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-testimonials">No testimonials found</p>
      )}
    </div>
  );
}
