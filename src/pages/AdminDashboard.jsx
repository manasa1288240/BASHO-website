import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/admin/ProductList";
import WorkshopList from "../components/admin/WorkshopList";
import OrderList from "../components/admin/OrderList";
import CustomerList from "../components/admin/CustomerList";
import GalleryManager from "../components/admin/GalleryManager";
import "../styles/admin.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    workshopBookings: 0,
    gstCollected: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("basho_user") || "{}");
    const adminToken = localStorage.getItem("admin_token");

    if (!user.isAdmin || !adminToken) {
      navigate("/auth");
      return;
    }

    setAdminUser(user);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("basho_user");
    localStorage.removeItem("basho_token");
    localStorage.removeItem("admin_token");
    navigate("/auth");
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/stats`);
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
    );
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar-new">
        <div className="admin-logo">
          <h2>BASHO ADMIN</h2>
        </div>

        <nav className="admin-nav-links">
          <button
            className={activeTab === "products" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("products")}
          >
            <span className="icon">📦</span> Inventory
          </button>

          <button
            className={activeTab === "orders" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("orders")}
          >
            <span className="icon">🛒</span> Order Tracking
          </button>

          <button
            className={
              activeTab === "workshops" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActiveTab("workshops")}
          >
            <span className="icon">🎨</span> Workshops
          </button>

          <button
            className={
              activeTab === "customers" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActiveTab("customers")}
          >
            <span className="icon">👥</span> Customers
          </button>

          <button
            className={activeTab === "gallery" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("gallery")}
          >
            <span className="icon">🖼️</span> Gallery & Testimonials
          </button>

          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="icon">🚪</span> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main-view">
        <header className="admin-top-bar">
          <h1>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
          </h1>

          <div className="admin-profile">
            <span>{adminUser?.email || "Admin"}</span>
            <button
              className="logout-btn-small"
              onClick={handleLogout}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </header>

        <section className="stats-container">
          <div className="stat-card-pro">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">₹{Math.round(stats.totalRevenue)}</h3>
          </div>

          <div className="stat-card-pro">
            <p className="stat-label">Active Orders</p>
            <h3 className="stat-value">{stats.activeOrders}</h3>
          </div>

          <div className="stat-card-pro">
            <p className="stat-label">Workshop Bookings</p>
            <h3 className="stat-value">{stats.workshopBookings}</h3>
          </div>

          <div className="stat-card-pro">
            <p className="stat-label">GST Collected</p>
            <h3 className="stat-value">₹{Math.round(stats.gstCollected)}</h3>
          </div>
        </section>

        <section className="content-card-pro">
          {activeTab === "products" && <ProductList />}
          {activeTab === "orders" && <OrderList />}
          {activeTab === "workshops" && <WorkshopList />}
          {activeTab === "customers" && <CustomerList />}
          {activeTab === "gallery" && <GalleryManager />}
        </section>
      </main>
    </div>
  );
}
