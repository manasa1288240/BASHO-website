import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";

const API_BASE = "/api/admin/products";

function authHeader() {
  const t = localStorage.getItem("admin_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const res = await fetch(API_BASE, { headers: { ...authHeader() } });
    const data = await res.json();
    if (data.success) setProducts(data.products);
    else alert(data.message || data.error);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!confirm("Delete product?")) return;
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { ...authHeader() } });
    const data = await res.json();
    if (data.success) load();
    else alert(data.message || data.error);
  }

  return (
    <div>
      <ProductForm onSaved={load} product={editing} onCancel={() => setEditing(null)} />

      <table style={{ width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>
                <button onClick={() => setEditing(p)}>Edit</button>
                <button onClick={() => remove(p._id)} style={{ marginLeft: 8 }}>
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
