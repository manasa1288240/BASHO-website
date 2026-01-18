import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";
const API_BASE = `${API_URL}/api/admin/customers`;

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(API_BASE, { headers: { ...authHeader() } });
      const data = await res.json();

      if (data.success) {
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="content-card-pro">
      <div className="section-header">
        <h3>Customer & Student Directory</h3>
        <p style={{ color: "#6b7280" }}>
          Users who registered, booked workshops, or placed orders.
        </p>
      </div>

      <div style={{ margin: "20px 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <table className="pro-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact</th>
              <th>Joined Date</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Workshops</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No customers found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: "600" }}>{c.name}</td>
                  <td>
                    <div style={{ fontSize: "14px" }}>
                      <div>{c.email}</div>
                      {c.phone && (
                        <div style={{ color: "#6b7280" }}>{c.phone}</div>
                      )}
                    </div>
                  </td>
                  <td>{new Date(c.joinedAt).toLocaleDateString()}</td>
                  <td>{c.totalOrders}</td>
                  <td>₹{c.totalSpent}</td>
                  <td>{c.totalWorkshops}</td>
                  <td>
                    <span className="badge-category">{c.type}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
