import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/admin/workshop-events";

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function WorkshopList() {
  const [workshops, setWorkshops] = useState([]);
  const [formData, setFormData] = useState({
    title: "", 
    description: "", 
    date: "", 
    time: "",
    duration: "",
    price: "", 
    image: "", 
    category: "",
    capacity: "10"
  });

  async function load() {
    try {
      const res = await fetch(API_BASE, { headers: { ...authHeader() } });
      const data = await res.json();
      if (data.success) setWorkshops(data.workshops);
    } catch (err) { console.error("Load failed:", err); }
  }

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
  e.preventDefault();
  
  // Validation: Ensure required fields aren't empty
  if (!formData.title || !formData.category || !formData.date || !formData.price) {
    alert("Please fill required fields: Title, Category, Date, Price");
    return;
  }

  // Transform data: Convert strings from inputs into Numbers for the Schema
  const submissionData = {
    ...formData,
    price: Number(formData.price),
    capacity: Number(formData.capacity) || 10
  };

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        ...authHeader() 
      },
      body: JSON.stringify(submissionData) // Use the transformed data
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert("✅ Workshop Saved Successfully!");
      setFormData({ title: "", description: "", date: "", time: "", duration: "", price: "", image: "", category: "", capacity: "10" });
      load();
    } else {
      // This will now show the specific error message from the backend catch block
      alert("Error: " + (data.error || "Failed to save workshop"));
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("Connection Error: Check if your backend is running on Port 5000");
  }
};

  return (
    <div className="content-card-pro">
      <div className="section-header">
        <h3>Workshops Management</h3>
      </div>
      
      <form onSubmit={handleSave} className="pro-form-grid">
        <div>
          <label>Workshop Title</label>
          <input type="text" value={formData.title} required
            onChange={e => setFormData({...formData, title: e.target.value})} 
            placeholder="e.g. Weekend Wheel Throwing" />
          
          {/* CATEGORY CHANGED FROM SELECT TO TEXT INPUT */}
          <label>Category</label>
          <input 
            type="text" 
            value={formData.category} 
            onChange={e => setFormData({...formData, category: e.target.value})} 
            placeholder="e.g. Couple Pottery, Family Session, etc." 
            required
          />

          <label>Description</label>
          <textarea rows="3" value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div>
          <label>Price (₹)</label>
          <input type="number" value={formData.price} required
            onChange={e => setFormData({...formData, price: e.target.value})} />
          
          <label>Event Date</label>
          <input type="date" value={formData.date} required
            onChange={e => setFormData({...formData, date: e.target.value})} />

          <label>Time</label>
          <input type="time" value={formData.time}
            onChange={e => setFormData({...formData, time: e.target.value})} />

          <label>Duration</label>
          <input type="text" value={formData.duration}
            onChange={e => setFormData({...formData, duration: e.target.value})}
            placeholder="e.g. 2 hours" />

          <label>Capacity (Seats)</label>
          <input type="number" value={formData.capacity} 
            onChange={e => setFormData({...formData, capacity: e.target.value})} />

          <label>Cover Image URL</label>
          <input type="text" value={formData.image} 
            onChange={e => setFormData({...formData, image: e.target.value})} 
            placeholder="https://..." />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">Save Workshop</button>
        </div>
      </form>

      <div className="section-header" style={{ marginTop: '40px' }}>
        <h3>Active Workshops</h3>
      </div>
      <table className="pro-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Price + GST</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workshops.map((w) => {
            const gst = (w.price * 0.18).toFixed(0);
            return (
              <tr key={w._id}>
                <td style={{ fontWeight: '600' }}>{w.title}</td>
                <td>{w.time || '-'}</td>
                <td>{w.duration || '-'}</td>
                <td><span className="badge-category">{w.category}</span></td>
                <td>{new Date(w.date).toLocaleDateString()}</td>
                <td>₹{w.price} <small style={{color:'green'}}>(+₹{gst})</small></td>
                <td>{w.capacity} Seats</td>
                <td>
                  <button className="delete-btn" onClick={async () => {
                    if(confirm("Delete this workshop?")) {
                      await fetch(`${API_BASE}/${w._id}`, { method: "DELETE", headers: { ...authHeader() } });
                      load();
                    }
                  }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}