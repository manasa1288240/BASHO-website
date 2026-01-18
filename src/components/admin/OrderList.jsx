import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";
const API_BASE = `${API_URL}/api/admin/orders`;

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(API_BASE, { headers: { ...authHeader() } });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders load failed:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to update status");
        return;
      }

      load();
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="content-card-pro">
      <div className="section-header">
        <h3>Order Tracking & GST Management</h3>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#777" }}>
          No orders found. Once customers buy your pottery, they will appear here.
        </p>
      ) : (
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
            {orders.map((o) => (
              <tr key={o._id}>
                <td style={{ fontWeight: "600" }}>{o._id.slice(-6)}</td>

                <td>
                  <div style={{ fontSize: "14px" }}>
                    <div style={{ fontWeight: "600" }}>{o.userEmail}</div>
                    <div style={{ color: "#777", fontSize: "12px" }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                  </div>
                </td>

                <td>
                  <ul style={{ margin: 0, paddingLeft: "18px" }}>
                    {(o.items || []).map((it, idx) => (
                      <li key={idx}>
                        {it.title} × {it.qty} (₹{it.price})
                      </li>
                    ))}
                  </ul>
                </td>

                <td>
                  <div style={{ fontSize: "14px" }}>
                    <div>
                      <b>Total:</b> ₹{o.totalAmount}
                    </div>
                    <div style={{ color: "#777" }}>
                      GST: ₹{o.gstAmount || 0}
                    </div>
                    <div style={{ color: "#777" }}>
                      Shipping: ₹{o.shippingCharge || 0}
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        o.paymentStatus === "completed"
                          ? "#dcfce7"
                          : o.paymentStatus === "failed"
                          ? "#fee2e2"
                          : "#fef9c3",
                      color:
                        o.paymentStatus === "completed"
                          ? "#166534"
                          : o.paymentStatus === "failed"
                          ? "#991b1b"
                          : "#854d0e",
                      textTransform: "capitalize",
                    }}
                  >
                    {o.paymentStatus}
                  </span>
                </td>

                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
