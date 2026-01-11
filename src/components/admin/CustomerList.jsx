import { useState, useEffect } from "react";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Logic to filter customers based on search input
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customer-list-container">
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p>View and manage registered customers.</p>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "12px 15px" }}>Customer Name</th>
              <th style={{ padding: "12px 15px" }}>Email</th>
              <th style={{ padding: "12px 15px" }}>Joined Date</th>
              <th style={{ padding: "12px 15px" }}>Total Orders</th>
              <th style={{ padding: "12px 15px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row - replace with {filteredCustomers.map(...)} once API is ready */}
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px 15px" }}>Manasa Reddy</td>
              <td style={{ padding: "12px 15px" }}>manasa@example.com</td>
              <td style={{ padding: "12px 15px" }}>Oct 10, 2023</td>
              <td style={{ padding: "12px 15px" }}>4</td>
              <td style={{ padding: "12px 15px" }}>
                <button style={{ color: "blue", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  View Profile
                </button>
              </td>
            </tr>
            
            {filteredCustomers.length === 0 && searchTerm && (
              <tr>
                <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  No customers found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}