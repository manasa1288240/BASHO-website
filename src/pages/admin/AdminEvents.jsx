import { useState, useEffect } from 'react';
import './AdminEvents.css';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    image: '',
    status: 'upcoming'
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
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
        ? `http://localhost:5000/api/events/${editing}`
        : 'http://localhost:5000/api/events';
      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save event');
      fetchEvents();
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
        image: '',
        status: 'upcoming'
      });
      setEditing(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete event');
      fetchEvents();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (event) => {
    setFormData(event);
    setEditing(event._id);
    setShowForm(true);
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="admin-events">
      <h1>Events & Exhibitions Management</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Events</p>
          <p className="stat-value">{events.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Upcoming</p>
          <p className="stat-value">
            {events.filter(e => e.status === 'upcoming').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Ongoing</p>
          <p className="stat-value">
            {events.filter(e => e.status === 'ongoing').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Completed</p>
          <p className="stat-value">
            {events.filter(e => e.status === 'completed').length}
          </p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="events-header">
        <input
          type="text"
          placeholder="Search events by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search"
        />
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({
              title: '',
              description: '',
              date: '',
              location: '',
              capacity: '',
              image: '',
              status: 'upcoming'
            });
          }}
        >
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {showForm && (
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {editing ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      )}

      {filteredEvents.length > 0 ? (
        <div className="events-container">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              {event.image && (
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                </div>
              )}
              <div className="event-content">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span className={`status-badge status-${event.status}`}>
                    {event.status?.toUpperCase()}
                  </span>
                </div>

                <p className="event-location">📍 {event.location}</p>
                <p className="event-date">📅 {new Date(event.date).toLocaleDateString()}</p>

                {event.capacity && (
                  <p className="event-capacity">👥 Capacity: {event.capacity}</p>
                )}

                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}

                <div className="event-actions">
                  <button className="edit-btn" onClick={() => startEdit(event)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteEvent(event._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-events">No events found</p>
      )}
    </div>
  );
}
