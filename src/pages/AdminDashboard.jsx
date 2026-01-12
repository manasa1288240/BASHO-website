import { useEffect, useState } from "react";
import ProductList from "../components/admin/ProductList";
import WorkshopList from "../components/admin/WorkshopList";
import OrderList from "../components/admin/OrderList";
import CustomerList from "../components/admin/CustomerList"; 
// ✅ STEP 1: Import the new GalleryManager component
import GalleryManager from "../components/admin/GalleryManager"; 
import "../styles/admin.css"; 

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  const [stats, setStats] = useState({
    totalRevenue: "₹45,231",
    activeOrders: "12",
    workshopSignups: "24",
    gstCollected: "₹8,141"
  });

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
            className={activeTab === "workshops" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("workshops")}
          >
            <span className="icon">🎨</span> Workshops
          </button>
          <button 
            className={activeTab === "customers" ? "nav-item active" : "nav-item"}
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
        </nav>
      </aside>

      <main className="admin-main-view">
        <header className="admin-top-bar">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
          <div className="admin-profile">
            <span>Shivangi (Admin)</span>
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
          {/* ✅ STEP 2: Replace the "Coming Soon" div with the actual component */}
          {activeTab === "gallery" && <GalleryManager />}
        </section>
      </main>
    </div>
  );
}