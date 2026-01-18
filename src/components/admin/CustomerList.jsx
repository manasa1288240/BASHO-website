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

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  async function openDetails(id) {
    try {
      setDetailOpen(true);
      setDetailLoading(true);
      setSelectedCustomer(null);

      const res = await fetch(`${API_BASE}/${id}`, {
        headers: { ...authHeader() },
      });
      const data = await res.json();

      if (data.success) {
        setSelectedCustomer(data.customer);
      } else {
        alert(data.message || "Failed to load details");
      }
    } catch (err) {
      console.error("Detail load failed:", err);
      alert("Error loading details");
    } finally {
      setDetailLoading(false);
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
              <th>Type</th>
              <th>Action</th>
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

                  <td>
                    {c.joinedAt ? new Date(c.joinedAt).toLocaleDateString() : "-"}
                  </td>

                  <td>{c.totalOrders} Orders</td>

                  <td>₹{c.totalSpent}</td>

                  <td>
                    <span className="badge-category">{c.type}</span>
                  </td>

                  <td>
                    <button
                      onClick={() => openDetails(c._id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#2563eb",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* DETAILS MODAL */}
      {detailOpen && (
        <div
          onClick={() => setDetailOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "850px",
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0 }}>Customer Details</h3>
              <button
                onClick={() => setDetailOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>

            {detailLoading ? (
              <p>Loading details...</p>
            ) : !selectedCustomer ? (
              <p>No data found</p>
            ) : (
              <>
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ margin: "4px 0" }}>
                    <b>Name:</b> {selectedCustomer.name}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <b>Email:</b> {selectedCustomer.email}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <b>Phone:</b> {selectedCustomer.phone || "-"}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <b>Joined:</b>{" "}
                    {selectedCustomer.joinedAt
                      ? new Date(selectedCustomer.joinedAt).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
                  <div>
                    <b>Total Orders:</b> {selectedCustomer.totalOrders}
                  </div>
                  <div>
                    <b>Total Spent:</b> ₹{selectedCustomer.totalSpent}
                  </div>
                  <div>
                    <b>Workshop Bookings:</b> {selectedCustomer.totalWorkshops}
                  </div>
                </div>

                <hr style={{ margin: "16px 0" }} />

                <h4>Orders</h4>
                {selectedCustomer.orders?.length === 0 ? (
                  <p>No orders yet.</p>
                ) : (
                  <ul>
                    {selectedCustomer.orders.map((o) => (
                      <li key={o._id}>
                        ₹{o.totalAmount || o.total || 0} •{" "}
                        {new Date(o.createdAt).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                )}

                <h4 style={{ marginTop: "16px" }}>Workshop Bookings</h4>
                {selectedCustomer.workshopBookings?.length === 0 ? (
                  <p>No workshop bookings yet.</p>
                ) : (
                  <ul>
                    {selectedCustomer.workshopBookings.map((b) => (
                      <li key={b._id}>
                        {b.workshopType} • {b.preferredDate} •{" "}
                        {b.paymentStatus}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
