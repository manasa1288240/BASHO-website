import { useState, useEffect } from 'react';
import './AdminWorkshops.css';

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/workshops', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch workshops');

      const data = await response.json();
      setWorkshops(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workshopId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/workshops/${workshopId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete workshop');

      setWorkshops(workshops.filter(w => w._id !== workshopId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = 
      workshop.workshopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || workshop.paymentStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading workshops...</div>;
  }

  return (
    <div className="admin-workshops">
      <div className="workshops-header">
        <h1>Workshop Bookings</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by workshop or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {filteredWorkshops.length > 0 ? (
        <div className="workshops-table-container">
          <table className="workshops-table">
            <thead>
              <tr>
                <th>Workshop Name</th>
                <th>Participant Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Participants</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkshops.map((workshop) => (
                <tr key={workshop._id}>
                  <td>{workshop.workshopName || 'N/A'}</td>
                  <td>{workshop.name || 'N/A'}</td>
                  <td>{workshop.email || 'N/A'}</td>
                  <td>{workshop.phone || 'N/A'}</td>
                  <td>{workshop.preferredDate ? new Date(workshop.preferredDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{workshop.participants || 1}</td>
                  <td>
                    <span className={`status-badge status-${workshop.paymentStatus}`}>
                      {workshop.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td>₹{workshop.amount || 0}</td>
                  <td className="actions">
                    <button
                      className="btn btn-view"
                      onClick={() => console.log('View:', workshop)}
                      title="View details"
                    >
                      👁️
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => setDeleteConfirm(workshop._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>

                    {deleteConfirm === workshop._id && (
                      <div className="confirm-delete">
                        <p>Delete this booking?</p>
                        <button
                          className="btn-confirm"
                          onClick={() => handleDelete(workshop._id)}
                        >
                          Yes
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No workshop bookings found</p>
      )}

      <p className="count-info">Total: {filteredWorkshops.length} bookings</p>
    </div>
  );
}
