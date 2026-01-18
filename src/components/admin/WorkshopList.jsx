import { useState, useEffect } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";
const API_BASE = `${API_URL}/api/admin/workshop-events`;

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function WorkshopList() {
  const [workshops, setWorkshops] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    price: "",
    image: "",
    category: "",
    capacity: "10",
  });

  async function load() {
    try {
      const res = await fetch(API_BASE, { headers: authHeader() });
      const data = await res.json();
      if (data.success) setWorkshops(data.workshops);
    } catch (err) {
      console.error("Load failed:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      price: "",
      image: "",
      category: "",
      capacity: "10",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const isEditing = !!editingId;

      const url = isEditing ? `${API_BASE}/${editingId}` : API_BASE;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isEditing ? "Workshop Updated!" : "Workshop Saved!");
        resetForm();
        load();
      } else {
        const errText = await res.text();
        console.error("Save failed:", errText);
        alert("Failed to save workshop");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving workshop");
    }
  };

  const startEdit = (w) => {
    setEditingId(w._id);

    setFormData({
      title: w.title || "",
      description: w.description || "",
      date: w.date ? new Date(w.date).toISOString().slice(0, 10) : "",
      time: w.time || "",
      duration: w.duration || "",
      price: w.price || "",
      image: w.image || "",
      category: w.category || "",
      capacity: w.capacity || "10",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="content-card-pro">
      <div className="section-header">
        <h3>Workshops Management</h3>
      </div>

      <form onSubmit={handleSave} className="pro-form-grid">
        <div>
          <label>Workshop Title</label>
          <input
            type="text"
            value={formData.title}
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g. Weekend Wheel Throwing"
          />

          <label>Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            placeholder="e.g. Couple Pottery, Family Session, etc."
            required
          />

          <label>Description</label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <label>Price (₹)</label>
          <input
            type="number"
            value={formData.price}
            required
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          <label>Event Date</label>
          <input
            type="date"
            value={formData.date}
            required
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />

          <label>Time</label>
          <input
            type="text"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            placeholder="e.g. 11:00 AM – 1:00 PM"
          />

          <label>Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            placeholder="e.g. 2 hrs"
          />

          <label>Capacity (Seats)</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
          />

          <label>Cover Image URL</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {editingId ? "Update Workshop" : "Save Workshop"}
          </button>

          {editingId && (
            <button
              type="button"
              className="delete-btn"
              style={{ marginLeft: "10px" }}
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="section-header" style={{ marginTop: "40px" }}>
        <h3>Active Workshops</h3>
      </div>

      <table className="pro-table">
        <thead>
          <tr>
            <th>Title</th>
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
            const gst = (Number(w.price) * 0.18).toFixed(0);

            return (
              <tr key={w._id}>
                <td style={{ fontWeight: "600" }}>{w.title}</td>
                <td>{new Date(w.date).toLocaleDateString()}</td>
                <td>{w.time || "Flexible"}</td>
                <td>{w.duration || "2 hrs"}</td>
                <td>
                  ₹{w.price}{" "}
                  <small style={{ color: "green" }}>(+₹{gst})</small>
                </td>
                <td>{w.capacity} Seats</td>

                <td style={{ display: "flex", gap: "10px" }}>
                  <button className="save-btn" onClick={() => startEdit(w)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={async () => {
                      if (confirm("Delete this workshop?")) {
                        await fetch(`${API_BASE}/${w._id}`, {
                          method: "DELETE",
                          headers: { ...authHeader() },
                        });
                        load();
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
