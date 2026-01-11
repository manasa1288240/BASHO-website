import { useEffect, useState } from "react";

const API_BASE = "/api/admin/products";

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" } : {};
}

export default function ProductForm({ product, onSaved, onCancel }) {
  const [form, setForm] = useState({ name: "", category: "", price: "", description: "", images: [], isCustomisable: false });

  useEffect(() => {
    if (product) setForm({ ...product, images: product.images || [] });
    else setForm({ name: "", category: "", price: "", description: "", images: [], isCustomisable: false });
  }, [product]);

  async function save(e) {
    e.preventDefault();
    const method = product?._id ? "PUT" : "POST";
    const url = product?._id ? `${API_BASE}/${product._id}` : API_BASE;
    const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(form) });
    const data = await res.json();
    if (data.success) {
      onSaved && onSaved();
      onCancel && onCancel();
    } else {
      alert(data.message || data.error || "Failed to save");
    }
  }

  return (
    <form onSubmit={save} style={{ border: "1px solid #eee", padding: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div style={{ width: 160 }}>
          <label>Category</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div style={{ width: 120 }}>
          <label>Price</label>
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Images (comma separated URLs)</label>
        <input
          value={(form.images || []).join(",")}
          onChange={(e) => setForm({ ...form, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>
          <input type="checkbox" checked={form.isCustomisable} onChange={(e) => setForm({ ...form, isCustomisable: e.target.checked })} /> Customisable
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <button type="submit">Save</button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
