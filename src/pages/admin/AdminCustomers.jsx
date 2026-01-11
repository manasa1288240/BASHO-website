import { useState, useEffect } from 'react';
import './AdminCustomers.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/users/${customerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete customer');
      fetchCustomers();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (customer) => {
    setEditingId(customer._id);
    setEditForm(customer);
  };

  const updateCustomer = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (!response.ok) throw new Error('Failed to update customer');
      fetchCustomers();
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);
    const matchRole = filterRole === 'all' || (customer.role || 'customer') === filterRole;
    return matchSearch && matchRole;
  });

  if (loading) return <div className="loading">Loading customers...</div>;

  return (
    <div className="admin-customers">
      <h1>Customer Database</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Customers</p>
          <p className="stat-value">{customers.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Users</p>
          <p className="stat-value">
            {customers.filter(c => c.isActive !== false).length}
          </p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">All Users</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {filteredCustomers.length > 0 ? (
        <div className="customers-container">
          {filteredCustomers.map((customer) => (
            <div key={customer._id} className="customer-card">
              {editingId === customer._id ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    />
                  </div>
                  <div className="edit-actions">
                    <button className="save-btn" onClick={updateCustomer}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="customer-header">
                    <div>
                      <h3>{customer.name}</h3>
                      <p className="role">{customer.role || 'Customer'}</p>
                    </div>
                  </div>

                  <div className="customer-info">
                    <div className="info-item">
                      <label>Email</label>
                      <p>{customer.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{customer.phone || '-'}</p>
                    </div>
                    <div className="info-item">
                      <label>Joined Date</label>
                      <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="info-item">
                      <label>Status</label>
                      <p className="status">
                        {customer.isActive !== false ? '✓ Active' : '✗ Inactive'}
                      </p>
                    </div>
                  </div>

                  {customer.address && (
                    <div className="customer-address">
                      <label>Address</label>
                      <p>{customer.address}</p>
                    </div>
                  )}

                  <div className="customer-actions">
                    <button className="edit-btn" onClick={() => startEdit(customer)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteCustomer(customer._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-customers">No customers found</p>
      )}
    </div>
  );
}
