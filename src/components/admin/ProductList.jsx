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
    if (!confirm("Are you sure you want to delete this pottery piece?")) return;
    const res = await fetch(`${API_BASE}/${id}`, { 
      method: "DELETE", 
      headers: { ...authHeader() } 
    });
    const data = await res.json();
    if (data.success) load();
    else alert(data.message || data.error);
  }

  return (
    <div className="product-manager">
      <div className="section-header">
        <h3>{editing ? "Edit Product" : "Add New Pottery Piece"}</h3>
      </div>
      
      {/* The Form now lives inside the professional grid defined in admin.css */}
      <ProductForm 
        onSaved={load} 
        product={editing} 
        onCancel={() => setEditing(null)} 
      />

      <div className="section-header" style={{ marginTop: '40px' }}>
        <h3>Current Inventory</h3>
      </div>

      <table className="pro-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price (INR)</th>
            <th>Stock Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p._id}>
                <td style={{ fontWeight: '600' }}>{p.name}</td>
                <td><span className="badge-category">{p.category}</span></td>
                <td>₹{p.price.toLocaleString('en-IN')}</td>
                <td>
                  {/* Visual logic for stock - assumes you have a 'stock' field */}
                  <span className={p.stock > 0 ? "status-pill in-stock" : "status-pill out-stock"}>
                    {p.stock > 0 ? "Available" : "Sold Out"}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="edit-link" onClick={() => setEditing(p)}>Edit</button>
                  <button className="delete-btn" onClick={() => remove(p._id)} style={{ marginLeft: 15 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                No products found in your inventory.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}