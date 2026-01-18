import { useEffect, useState } from "react";

// ✅ Works in Vercel + Local
const API_URL =
  import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";
const API_BASE = `${API_URL}/api/gallery`;

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "product",
  });

  async function loadGallery() {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error("Gallery load failed:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.log("Add failed:", txt);
        throw new Error("Add failed");
      }

      setFormData({ title: "", imageUrl: "", category: "product" });
      loadGallery();
    } catch (err) {
      console.error(err);
      alert("Error adding item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const txt = await res.text();
        console.log("Delete failed:", txt);
        throw new Error("Delete failed");
      }

      loadGallery();
    } catch (err) {
      console.error(err);
      alert("Error deleting image");
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredItems = items.filter((item) => {
    if (filter === "All") return true;

    const itemCat = item.category?.toLowerCase().trim() || "";
    const selectedFilter = filter.toLowerCase().trim();

    return (
      itemCat === selectedFilter ||
      itemCat === selectedFilter.replace(/s$/, "") ||
      selectedFilter === itemCat + "s"
    );
  });

  return (
    <div className="content-card-pro">
      <h3 style={{ marginBottom: "20px" }}>Gallery Management</h3>

      {/* FORM SECTION */}
      <form
        onSubmit={handleAddItem}
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: "10px",
          }}
        >
          <input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <input
            placeholder="Image URL (https://)"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            required
          />

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="product">Products</option>
            <option value="workshop">Workshops</option>
            <option value="event">Events</option>
          </select>

          <button
            type="submit"
            style={{
              background: "#3d332d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </form>

      {/* FILTER BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["All", "Products", "Workshops", "Events"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: filter === cat ? "#3d332d" : "#eee",
              color: filter === cat ? "white" : "#333",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID SECTION */}
      {loading ? (
        <p>Loading gallery...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "12px",
                border: "1px solid #eee",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/200?text=No+Image";
                }}
              />

              <p
                style={{
                  fontWeight: "bold",
                  marginTop: "8px",
                  marginBottom: "2px",
                }}
              >
                {item.title}
              </p>

              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  textTransform: "capitalize",
                }}
              >
                {item.category}
              </p>

              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  marginTop: "8px",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
