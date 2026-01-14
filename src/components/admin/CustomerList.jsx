import { useEffect, useState } from "react";

// Use the correct API endpoint for your customers
const API_BASE = "http://localhost:5000/api/admin/customers";

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. FETCH FUNCTION: Connects to your real database
  async function loadCustomers() {
    try {
      setLoading(true);
      const res = await fetch(API_BASE, { headers: { ...authHeader() } });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCustomers(); }, []);

  // 2. SEARCH LOGIC: Combines name and email filtering
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-card-pro">
      {/* HEADER SECTION WITH SEARCH BAR */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h3>Customer & Student Directory</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Manage buyers and workshop participants.
          </p>
        </div>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="🔍 Search name or email..." 
            className="status-select" 
            style={{ width: "300px", padding: "10px 15px", border: "1px solid #e2e8f0" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CUSTOMER TABLE */}
      <table className="pro-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Contact Details</th>
            <th>Joined Date</th>
            <th>Total Orders</th>
            <th>Total Spent</th>
            <th>Type</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading directory...</td></tr>
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map((c) => (
              <tr key={c._id}>
                <td style={{ fontWeight: '600', color: '#1e293b' }}>{c.name}</td>
                <td>
                  <div style={{ fontSize: '13px' }}>{c.email}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.phone || "+91-XXXXXXXXXX"}</div>
                </td>
                <td style={{ fontSize: '13px' }}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td>{c.orderCount || 0} Orders</td>
                <td style={{ fontWeight: '700', color: '#0f172a' }}>₹{c.totalSpent?.toLocaleString() || 0}</td>
                <td>
                  <span className={`status-pill ${c.isStudent ? 'status-shipped' : 'in-stock'}`}>
                    {c.isStudent ? "Student" : "Buyer"}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="edit-link" 
                    onClick={() => alert(`Opening profile for ${c.name}...`)}
                    style={{ fontWeight: '600' }}
                  >
                    View Detail
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                {searchTerm ? (
                  `No customers found matching "${searchTerm}"`
                ) : (
                  "No customers registered yet. New buyers will appear here automatically."
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}