import { useState, useEffect } from "react";

export default function WorkshopList() {
  const [workshops, setWorkshops] = useState([]);
  const [formData, setFormData] = useState({
    title: "", description: "", date: "", price: "", image: "", category: ""
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/workshop-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Workshop Posted Successfully!");
        // Refresh list logic here
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontFamily: "serif", marginBottom: "20px" }}>Workshops Management</h2>
      
      {/* ADD WORKSHOP FORM - Matches your Product layout */}
      <form onSubmit={handleSave} style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "20px", 
        background: "#fff", 
        padding: "25px", 
        borderRadius: "8px", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        marginBottom: "40px"
      }}>
        <div>
          <label style={labelStyle}>Workshop Title</label>
          <input style={inputStyle} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Intro to Pottery" />
          
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, height: "80px" }} onChange={e => setFormData({...formData, description: e.target.value})} />
          
          <label style={labelStyle}>Category</label>
          <input style={inputStyle} onChange={e => setFormData({...formData, category: e.target.value})} />
        </div>

        <div>
          <label style={labelStyle}>Price (₹)</label>
          <input type="number" style={inputStyle} onChange={e => setFormData({...formData, price: e.target.value})} />
          
          <label style={labelStyle}>Event Date</label>
          <input type="date" style={inputStyle} onChange={e => setFormData({...formData, date: e.target.value})} />

          <label style={labelStyle}>Cover Image URL</label>
          <input style={inputStyle} placeholder="https://..." onChange={e => setFormData({...formData, image: e.target.value})} />
        </div>

        <div style={{ gridColumn: "span 2" }}>
          <button type="submit" style={{ padding: "10px 25px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Save Workshop
          </button>
        </div>
      </form>

      {/* TABLE FOR EXISTING WORKSHOPS */}
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #eee", color: "#666" }}>
            <th style={{ padding: "12px" }}>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Example Data Row */}
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "12px" }}>Sample Pottery Class</td>
            <td>Pottery</td>
            <td>₹1500</td>
            <td>2026-02-15</td>
            <td><button style={{color: "red", border: "none", background: "none", cursor: "pointer"}}>Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const labelStyle = { display: "block", marginTop: "10px", fontWeight: "bold", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ddd", borderRadius: "4px" };