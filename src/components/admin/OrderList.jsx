import { useState, useEffect } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  // Example: Fetch orders from your API
  // useEffect(() => { fetch('/api/admin/orders').then(...) }, []);

  return (
    <div className="order-list">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
            <th style={{ padding: 12 }}>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through your real data here */}
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: 12 }}>#BS-9901</td>
            <td>Sample Customer</td>
            <td>Oct 24, 2023</td>
            <td><span style={{ background: "#fff3cd", padding: "4px 8px", borderRadius: 4 }}>Pending</span></td>
            <td>₹1,200</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}