import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductList from "../components/admin/ProductList";
import WorkshopList from "../components/admin/WorkshopList";
import OrderList from "../components/admin/OrderList";
import CustomerList from "../components/admin/CustomerList";

import GalleryManager from "../components/admin/GalleryManager";
import TestimonialManager from "../components/admin/TestimonialManager";
import VideoTestimonialManager from "../components/admin/VideoTestimonialManager";

import "../styles/admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("basho_user") || "{}");
    const adminToken = localStorage.getItem("admin_token");

    if (!user.isAdmin || !adminToken) {
      console.log("❌ Not authorized as admin");
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

  // Dummy stats (we can make it real later)
  const [stats, setStats] = useState({
    totalRevenue: "₹45,231",
    activeOrders: "12",
    workshopSignups: "24",
    gstCollected: "₹8,141",
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
    );
  }

  const getHeaderTitle = () => {
    if (activeTab === "products") return "Inventory Management";
    if (activeTab === "orders") return "Order Tracking";
    if (activeTab === "workshops") return "Workshops Management";
    if (activeTab === "customers") return "Customers Management";
    if (activeTab === "gallery") return "Gallery Management";
    if (activeTab === "testimonials") return "Testimonials Management";
    if (activeTab === "videoTestimonials") return "Video Testimonials Management";
    return "Admin Dashboard";
  };

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

          {/* ✅ NEW SEPARATE TAB: Gallery */}
          <button
            className={activeTab === "gallery" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("gallery")}
          >
            <span className="icon">🖼️</span> Gallery
          </button>

          {/* ✅ NEW SEPARATE TAB: Testimonials */}
          <button
            className={
              activeTab === "testimonials" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActiveTab("testimonials")}
          >
            <span className="icon">💬</span> Testimonials
          </button>

          {/* ✅ NEW SEPARATE TAB: Video Testimonials */}
          <button
            className={
              activeTab === "videoTestimonials" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActiveTab("videoTestimonials")}
          >
            <span className="icon">🎥</span> Video Testimonials
          </button>

          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="icon">🚪</span> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main-view">
        <header className="admin-top-bar">
          <h1>{getHeaderTitle()}</h1>

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
            <h3 className="stat-value">{stats.totalRevenue}</h3>
          </div>

          <div className="stat-card-pro">
            <p className="stat-label">Active Orders</p>
            <h3 className="stat-value">{stats.activeOrders}</h3>
          </div>

          <div className="stat-card-pro">
            <p className="stat-label">Workshops</p>
            <h3 className="stat-value">{stats.workshopSignups}</h3>
          </div>

          <div className="stat-card-pro">
            <p className="stat-label">GST Handling</p>
            <h3 className="stat-value">{stats.gstCollected}</h3>
          </div>
        </section>

        <section className="content-card-pro">
          {activeTab === "products" && <ProductList />}
          {activeTab === "orders" && <OrderList />}
          {activeTab === "workshops" && <WorkshopList />}
          {activeTab === "customers" && <CustomerList />}

          {/* ✅ Separate tab renders */}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "testimonials" && <TestimonialManager />}
          {activeTab === "videoTestimonials" && <VideoTestimonialManager />}
        </section>
      </main>
    </div>
  );
}
