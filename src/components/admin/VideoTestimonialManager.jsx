import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";
const API_BASE = `${API_URL}/api/admin/video-testimonials`;

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function VideoTestimonialManager() {
  const [reels, setReels] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    reelUrl: "",
  });

  async function load() {
    try {
      const res = await fetch(API_BASE, { headers: authHeader() });
      const data = await res.json();
      if (data.success) setReels(data.reels || []);
    } catch (err) {
      console.error("Load reels failed:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Video testimonial saved!");
        setFormData({ title: "", reelUrl: "" });
        load();
      } else {
        const errText = await res.text();
        console.error("Save failed:", errText);
        alert("Failed to save video testimonial");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving reel link");
    }
  };

  return (
    <div className="content-card-pro">
      <div className="section-header">
        <h3>Video Testimonials (Instagram Reels)</h3>
      </div>

      <form onSubmit={handleSave} className="pro-form-grid">
        <div>
          <label>Reel URL *</label>
          <input
            type="text"
            value={formData.reelUrl}
            required
            onChange={(e) =>
              setFormData({ ...formData, reelUrl: e.target.value })
            }
            placeholder="https://www.instagram.com/reel/xxxxx/"
          />
        </div>

        <div>
          <label>Title (optional)</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g. Workshop Review"
          />

          <div className="form-actions" style={{ marginTop: "20px" }}>
            <button type="submit" className="save-btn">
              Save Reel Link
            </button>
          </div>
        </div>
      </form>

      <div className="section-header" style={{ marginTop: "40px" }}>
        <h3>Saved Reels</h3>
      </div>

      <table className="pro-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Reel URL</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reels.map((r) => (
            <tr key={r._id}>
              <td style={{ fontWeight: "600" }}>{r.title || "-"}</td>
              <td style={{ maxWidth: "500px", wordBreak: "break-word" }}>
                {r.reelUrl}
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    if (confirm("Delete this reel link?")) {
                      await fetch(`${API_BASE}/${r._id}`, {
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
