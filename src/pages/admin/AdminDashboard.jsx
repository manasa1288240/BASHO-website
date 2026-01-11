import { useState, useEffect } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkshops: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // Fetch users count
      const usersRes = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => null);
      
      // Fetch workshops count
      const workshopsRes = await fetch('http://localhost:5000/api/workshops', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => null);

      // Fetch products count
      const productsRes = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => null);

      const users = usersRes?.ok ? await usersRes.json() : [];
      const workshops = workshopsRes?.ok ? await workshopsRes.json() : [];
      const products = productsRes?.ok ? await productsRes.json() : [];

      // Calculate stats
      const totalRevenue = workshops
        .filter(w => w.paymentStatus === 'completed')
        .reduce((sum, w) => sum + (w.amount || 0), 0) +
        products
        .filter(p => p.paymentStatus === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalUsers: users.length || 0,
        totalWorkshops: workshops.length || 0,
        totalProducts: products.length || 0,
        totalRevenue: totalRevenue || 0,
        recentBookings: workshops.slice(0, 5) || [],
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      // Set placeholder stats
      setStats({
        totalUsers: 0,
        totalWorkshops: 0,
        totalProducts: 0,
        totalRevenue: 0,
        recentBookings: [],
      });
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Workshops</h3>
            <p className="stat-value">{stats.totalWorkshops}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="recent-section">
        <h2>Recent Workshop Bookings</h2>
        {stats.recentBookings.length > 0 ? (
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.name}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>
                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${booking.paymentStatus}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No recent bookings</p>
        )}
      </div>

      {error && <p className="error-message">Note: {error}</p>}
    </div>
  );
}
