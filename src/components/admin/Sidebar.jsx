import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>BASHO ADMIN</h2>
      </div>
      <nav className="sidebar-nav">
        <Link
          to="/admin/dashboard"
          className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
        >
          <span className="icon">📊</span>
          Dashboard
        </Link>
        <Link
          to="/admin/users"
          className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
        >
          <span className="icon">👥</span>
          Users
        </Link>
        <Link
          to="/admin/workshops"
          className={`nav-link ${isActive('/admin/workshops') ? 'active' : ''}`}
        >
          <span className="icon">📚</span>
          Workshops
        </Link>
        <Link
          to="/admin/products"
          className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}
        >
          <span className="icon">📦</span>
          Products
        </Link>
        <Link
          to="/admin/orders"
          className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
        >
          <span className="icon">🛒</span>
          Orders
        </Link>
        <Link
          to="/admin/payments"
          className={`nav-link ${isActive('/admin/payments') ? 'active' : ''}`}
        >
          <span className="icon">💳</span>
          Payments
        </Link>
        <Link
          to="/admin/customers"
          className={`nav-link ${isActive('/admin/customers') ? 'active' : ''}`}
        >
          <span className="icon">🧑</span>
          Customers
        </Link>
        <Link
          to="/admin/events"
          className={`nav-link ${isActive('/admin/events') ? 'active' : ''}`}
        >
          <span className="icon">🎭</span>
          Events
        </Link>
        <Link
          to="/admin/gallery"
          className={`nav-link ${isActive('/admin/gallery') ? 'active' : ''}`}
        >
          <span className="icon">🖼️</span>
          Gallery
        </Link>
        <Link
          to="/admin/testimonials"
          className={`nav-link ${isActive('/admin/testimonials') ? 'active' : ''}`}
        >
          <span className="icon">⭐</span>
          Testimonials
        </Link>
        <Link
          to="/admin/settings"
          className={`nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
        >
          <span className="icon">⚙️</span>
          Settings
        </Link>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}
