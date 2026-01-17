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

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    rating: "5",
    image: "",
  });

  async function load() {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();

      if (data.success) {
        setTestimonials(data.testimonials || []);
      } else {
        console.error("Load failed:", data);
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        role: formData.role,
        message: formData.message,
        rating: Number(formData.rating),
        image: formData.image,
      };

      console.log("Sending payload:", payload);

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("Raw response:", text);

      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        alert("❌ Backend did not return JSON. Check console.");
        return;
      }

      if (res.ok && data.success) {
        alert("✅ Testimonial saved!");
        setFormData({
          name: "",
          role: "",
          message: "",
          rating: "5",
          image: "",
        });
        load();
      } else {
        alert("❌ Save failed: " + (data.message || data.error || "Unknown"));
        console.error("Save failed:", data);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Error saving testimonial");
    }
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
          />

          <label>Role / Tag</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Workshop Participant"
          />

          <label>Message</label>
          <textarea
            rows="3"
            value={formData.message}
            required
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
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
              setFormData({ ...formData, rating: e.target.value })
            }
          />

          <label>Image URL (optional)</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            placeholder="https://..."
          />

          <div className="form-actions" style={{ marginTop: "20px" }}>
            <button type="submit" className="save-btn">
              Save Testimonial
            </button>
          </div>
        </div>
      </form>

      <div className="section-header" style={{ marginTop: "40px" }}>
        <h3>Saved Testimonials</h3>
      </div>

      <table className="pro-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Rating</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {testimonials.map((t) => (
            <tr key={t._id}>
              <td style={{ fontWeight: "600" }}>{t.name}</td>
              <td>{t.role || "-"}</td>
              <td>{t.rating || 5}</td>
              <td style={{ maxWidth: "400px" }}>{t.message}</td>
              <td>
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
