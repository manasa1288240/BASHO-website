import { useState, useEffect } from "react";

// ✅ Use env API url (works in Vercel + local)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api/admin/products`;

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function ProductForm({ onSaved, product, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    gstPercent: "18",
    stock: "",
    images: "",
    isCustomisable: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: Array.isArray(product.images)
          ? product.images.join(", ")
          : product.images,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        gstPercent: "18",
        stock: "",
        images: "",
        isCustomisable: false,
      });
    }
  }, [product]);

  async function handleSubmit(e) {
    e.preventDefault();

    const method = product ? "PUT" : "POST";
    const url = product ? `${API_BASE}/${product._id}` : API_BASE;

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      gstPercent: Number(formData.gstPercent),
      images: String(formData.images || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("❌ Non-JSON response:", text);
        alert(`Server error (${res.status}): ${text || "No response"}`);
        return;
      }

      if (data.success) {
        alert(`Product ${product ? "updated" : "added"} successfully!`);
        onSaved?.();

        if (!product) {
          setFormData({
            name: "",
            description: "",
            category: "",
            price: "",
            gstPercent: "18",
            stock: "",
            images: "",
            isCustomisable: false,
          });
        }
      } else {
        alert(data.message || data.error || "Failed to save product");
      }
    } catch (err) {
      console.error("❌ Product submission error:", err);
      alert("Error saving product: " + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pro-form-grid">
      <div>
        <label>Product Name</label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Category</label>
        <select
          value={formData.category || ""}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        >
          <option value="">Select Category</option>
          <option value="Mugs">Mugs</option>
          <option value="Plates">Plates</option>
          <option value="Platter/Cheeseboard">Platter/Cheeseboard</option>
          <option value="Bowls">Bowls</option>
          <option value="Vase">Vase</option>
          <option value="Fancy">Fancy</option>
          <option value="Picasso Limited Collection">
            Picasso Limited Collection
          </option>
        </select>
      </div>

      <div className="full-width">
        <label>Description</label>
        <textarea
          rows="3"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label>Base Price (₹)</label>
        <input
          type="number"
          value={formData.price || ""}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Stock Quantity</label>
        <input
          type="number"
          value={formData.stock || ""}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
      </div>

      <div>
        <label>GST % (Default: 18)</label>
        <input
          type="number"
          value={formData.gstPercent || "18"}
          onChange={(e) =>
            setFormData({ ...formData, gstPercent: e.target.value })
          }
          min="0"
          max="100"
        />
      </div>

      <div className="full-width">
        <label>Image URLs (comma separated)</label>
        <input
          type="text"
          value={formData.images || ""}
          onChange={(e) =>
            setFormData({ ...formData, images: e.target.value })
          }
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">
          {product ? "Update Product" : "Save Product"}
        </button>

        {product && (
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
