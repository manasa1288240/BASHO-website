import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";
const API_BASE = `${API_URL}/api/admin/testimonials`;

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    rating: 5,
    image: "",
  });

  async function load() {
    try {
      const res = await fetch(API_BASE, { headers: authHeader() });
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      role: "",
      message: "",
      rating: 5,
      image: "",
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
        alert(isEditing ? "Testimonial Updated!" : "Testimonial Saved!");
        resetForm();
        load();
      } else {
        const errText = await res.text();
        console.error("Save failed:", errText);
        alert("Failed to save testimonial");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving testimonial");
    }
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setFormData({
      name: t.name || "",
      role: t.role || "",
      message: t.message || "",
      rating: t.rating || 5,
      image: t.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="content-card-pro">
      <div className="section-header">
        <h3>Testimonials Management</h3>
      </div>

      <form onSubmit={handleSave} className="pro-form-grid">
        <div>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Shivangi"
          />

          <label>Role / Tag</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g. Workshop Participant"
          />

          <label>Message</label>
          <textarea
            rows="3"
            value={formData.message}
            required
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Write the testimonial..."
          />
        </div>

        <div>
          <label>Rating (1 - 5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: Number(e.target.value) })
            }
          />

          <label>Image URL (optional)</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingId ? "Update Testimonial" : "Save Testimonial"}
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
        </div>
      </form>

      <div className="section-header" style={{ marginTop: "40px" }}>
        <h3>All Testimonials</h3>
      </div>

      <table className="pro-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Rating</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {testimonials.map((t) => (
            <tr key={t._id}>
              <td style={{ fontWeight: "600" }}>{t.name}</td>
              <td>{t.role || "-"}</td>
              <td>{t.rating || 5} ⭐</td>
              <td style={{ maxWidth: "450px" }}>{t.message}</td>
              <td style={{ display: "flex", gap: "10px" }}>
                <button className="save-btn" onClick={() => startEdit(t)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={async () => {
                    if (confirm("Delete this testimonial?")) {
                      await fetch(`${API_BASE}/${t._id}`, {
                        method: "DELETE",
                        headers: authHeader(),
                      });
                      load();
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
