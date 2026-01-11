import { useState, useEffect } from 'react';
import './AdminOrders.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update order');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchSearch =
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="admin-orders">
      <h1>Order & Payment Management</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card pending">
          <p className="stat-label">Pending</p>
          <p className="stat-value">{stats.pending}</p>
        </div>
        <div className="stat-card processing">
          <p className="stat-label">Processing</p>
          <p className="stat-value">{stats.processing}</p>
        </div>
        <div className="stat-card shipped">
          <p className="stat-label">Shipped</p>
          <p className="stat-value">{stats.shipped}</p>
        </div>
        <div className="stat-card delivered">
          <p className="stat-label">Delivered</p>
          <p className="stat-value">{stats.delivered}</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="orders-container">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id?.slice(-6)}</h3>
                  <p className="date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`status-badge status-${order.status}`}>
                  {order.status?.toUpperCase()}
                </span>
              </div>

              <div className="order-info">
                <div className="info-item">
                  <label>Customer</label>
                  <p>{order.customerName}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{order.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{order.phone}</p>
                </div>
                <div className="info-item">
                  <label>Total Amount</label>
                  <p className="amount">₹{order.totalAmount}</p>
                </div>
              </div>

              {order.items && (
                <div className="order-items">
                  <p className="items-label">Items:</p>
                  {order.items.map((item, idx) => (
                    <p key={idx}>• {item.name} x {item.quantity} = ₹{item.price}</p>
                  ))}
                </div>
              )}

              <div className="order-address">
                <label>Shipping Address</label>
                <p>{order.address}</p>
                <p>{order.city}, {order.state} {order.pincode}</p>
              </div>

              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-orders">No orders found</p>
      )}
    </div>
  );
}
