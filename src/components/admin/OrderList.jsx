import { useEffect, useState } from "react";

// ✅ Use env API url (works in Vercel + local)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api/admin/orders`;

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch(API_BASE, { headers: { ...authHeader() } });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (err) {
      console.error("Order load failed:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    try {
      const res = await fetch(`${API_BASE}/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ shippingStatus: newStatus }),
      });

      if (res.ok) loadOrders();
      else alert("Failed to update status");
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status");
    }
  }

  return (
    <div className="content-card-pro">
      <div className="section-header">
        <h3>Order Tracking & GST Management</h3>
      </div>

      <table className="pro-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Details</th>
            <th>Items</th>
            <th>Financials (INR)</th>
            <th>Payment Status</th>
            <th>Shipping Control</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="6"
                style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}
              >
                Loading orders...
              </td>
            </tr>
          ) : orders.length > 0 ? (
            orders.map((order) => {
              const totalAmount = Number(order.totalAmount || 0);

              // Automatic GST calculation for your records
              const gstValue = (totalAmount * 0.18).toFixed(2);

              return (
                <tr key={order._id}>
                  <td>
                    <code style={{ color: "#64748b" }}>
                      #{String(order._id || "").slice(-6).toUpperCase()}
                    </code>
                  </td>

                  <td>
                    <div style={{ fontWeight: "600" }}>
                      {order.customerName || "Customer"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {order.shippingAddress?.city || "Local Pickup"}
                    </div>
                  </td>

                  <td>{order.items?.length || 0} Units</td>

                  <td>
                    <div style={{ fontWeight: "700" }}>₹{totalAmount}</div>
                    <div style={{ fontSize: "10px", color: "#10b981" }}>
                      GST (18%): ₹{gstValue}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`status-pill ${
                        order.paymentStatus === "Paid"
                          ? "status-paid"
                          : "status-pending"
                      }`}
                    >
                      {order.paymentStatus || "Pending"}
                    </span>
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={order.shippingStatus || "Processing"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="Processing">⏳ Processing</option>
                      <option value="Shipped">🚚 Shipped</option>
                      <option value="Delivered">✅ Delivered</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}
              >
                No orders found. Once customers buy your pottery, they will
                appear here.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
