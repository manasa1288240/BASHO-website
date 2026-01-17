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
    const res = await fetch(API_BASE, { headers: authHeader() });
    const data = await res.json();
    if (data.success) setWorkshops(data.workshops);
  }

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Workshop saved!");
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
      load();
    } else {
      alert("Failed to save workshop");
    }
  };

  return (
    <div className="content-card-pro">
      <h3>Workshop Management</h3>

      {/* ADD WORKSHOP FORM */}
      <form onSubmit={handleSave} className="pro-form-grid">
        <input
          placeholder="Workshop Title"
          value={formData.title}
          required
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />

        <input
          placeholder="Category"
          value={formData.category}
          required
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          type="date"
          value={formData.date}
          required
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
        />

        <input
          placeholder="Time (e.g. 11:00 AM – 1:00 PM)"
          value={formData.time}
          onChange={(e) =>
            setFormData({ ...formData, time: e.target.value })
          }
        />

        <input
          placeholder="Duration (e.g. 2 hrs)"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          required
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
        />

        <input
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={(e) =>
            setFormData({ ...formData, capacity: e.target.value })
          }
        />

        <button type="submit">Save Workshop</button>
      </form>

      {/* WORKSHOP LIST */}
      <table className="pro-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Capacity</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {workshops.map((w) => (
            <tr key={w._id}>
              <td>{w.title}</td>
              <td>{new Date(w.date).toLocaleDateString()}</td>
              <td>{w.time || "Flexible"}</td>
              <td>{w.duration || "2 hrs"}</td>
              <td>₹{w.price}</td>
              <td>{w.capacity}</td>
              <td>
                <button
                  onClick={async () => {
                    if (confirm("Delete this workshop?")) {
                      await fetch(`${API_BASE}/${w._id}`, {
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
