import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/admin/ProductList";
import WorkshopList from "../components/admin/WorkshopList";
import OrderList from "../components/admin/OrderList";
import CustomerList from "../components/admin/CustomerList"; 
// ✅ STEP 1: Import the new GalleryManager component
import GalleryManager from "../components/admin/GalleryManager"; 
import "../styles/admin.css"; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: "₹0",
    activeOrders: "0",
    workshopSignups: "0",
    gstCollected: "₹0"
  });

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("basho_user") || "{}");
    const adminToken = localStorage.getItem("admin_token");

    if (!user.isAdmin || !adminToken) {
      console.log("❌ Not authorized as admin");
      navigate("/auth");
      return;
    }

    setAdminUser(user);
    setLoading(false);
    
    // Fetch dashboard stats
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      
      // Fetch users to get order data
      const usersRes = await fetch("http://localhost:5000/api/auth/all-users", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      
      const usersData = await usersRes.json();
      const users = usersData.users || [];
      
      // Calculate total revenue and active orders
      let totalRevenue = 0;
      let activeOrders = 0;
      let totalGST = 0;
      
      users.forEach(user => {
        if (user.orders && user.orders.length > 0) {
          activeOrders += user.orders.length;
          user.orders.forEach(order => {
            if (order.items) {
              order.items.forEach(item => {
                if (item.product && item.product.price) {
                  const itemPrice = item.product.price * item.qty;
                  totalRevenue += itemPrice;
                  
                  // Calculate GST
                  const gstPercent = item.product.gstPercent || 18;
                  totalGST += (itemPrice * gstPercent) / 100;
                }
              });
            }
          });
        }
      });
      
      // Fetch workshops count
      const workshopsRes = await fetch("http://localhost:5000/api/admin/workshops", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      
      const workshopsData = await workshopsRes.json();
      const workshopCount = Array.isArray(workshopsData) ? workshopsData.length : 0;
      
      // Update stats
      setStats({
        totalRevenue: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        activeOrders: activeOrders.toString(),
        workshopSignups: workshopCount.toString(),
        gstCollected: `₹${totalGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep default values if fetch fails
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("basho_user");
    localStorage.removeItem("basho_token");
    localStorage.removeItem("admin_token");
    navigate("/auth");
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
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
          <button 
            className="nav-item logout-btn"
            onClick={handleLogout}
          >
            <span className="icon">🚪</span> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main-view">
        <header className="admin-top-bar">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
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
          {/* ✅ STEP 2: Replace the "Coming Soon" div with the actual component */}
          {activeTab === "gallery" && <GalleryManager />}
        </section>
      </main>
    </div>
  );
}