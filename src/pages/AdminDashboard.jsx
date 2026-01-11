import { useEffect, useState } from "react";
import ProductList from "../components/admin/ProductList";
import WorkshopList from "../components/admin/WorkshopList";
import OrderList from "../components/admin/OrderList";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  // Debugging: This will show in your console if the button click is even registered
  const handleTabChange = (tabName) => {
    console.log("Switching to tab:", tabName);
    setActiveTab(tabName);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: "85px" }}>
      {/* SIDEBAR - Added zIndex and cursor pointer to guarantee it works */}
      <div style={{ 
        width: "250px", 
        backgroundColor: "#2c3e50", 
        color: "white", 
        position: "fixed", 
        left: 0, 
        top: "85px", 
        bottom: 0,
        zIndex: 1000,
        padding: "20px 0"
      }}>
        <button 
          onClick={() => handleTabChange("products")} 
          style={sidebarBtnStyle(activeTab === "products")}
        >
          📦 Products
        </button>
        <button 
          onClick={() => handleTabChange("orders")} 
          style={sidebarBtnStyle(activeTab === "orders")}
        >
          🛒 Orders
        </button>
        <button 
          onClick={() => handleTabChange("workshops")} 
          style={sidebarBtnStyle(activeTab === "workshops")}
        >
          🎨 Workshops
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, marginLeft: "250px", padding: "30px", backgroundColor: "#f4f7f6" }}>
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px", minHeight: "80vh" }}>
          {activeTab === "products" && <ProductList />}
          {activeTab === "orders" && <OrderList />}
          {activeTab === "workshops" && <WorkshopList />}
        </div>
      </main>
    </div>
  );
}

const sidebarBtnStyle = (isActive) => ({
  width: "100%",
  padding: "15px 25px",
  backgroundColor: isActive ? "#34495e" : "transparent",
  color: isActive ? "#C4A484" : "white",
  border: "none",
  textAlign: "left",
  cursor: "pointer", // This ensures the hand icon appears
  fontSize: "16px",
  fontWeight: isActive ? "bold" : "normal",
  pointerEvents: "auto" // This forces the button to be clickable
});