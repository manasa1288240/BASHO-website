import { useEffect, useState } from "react";
import ProductList from "../components/admin/ProductList";

function Nav({ onLogout }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
      <a href="/admin">Products</a>
      <a href="/admin#orders">Orders</a>
      <a href="/admin#workshops">Workshops</a>
      <a href="/admin#customers">Customers</a>
      <button onClick={onLogout} style={{ marginLeft: "auto" }}>
        Logout
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(null);

useEffect(() => {
  const t = localStorage.getItem("admin_token");
  setAuthed(!!t);
}, []);


  function logout() {
    localStorage.removeItem("admin_token");
    setAuthed(false);
    window.location.href = "/admin/login";
  }

 if (authed === null) {
  return null; // or loading spinner
}

if (!authed) {
  window.location.href = "/admin/login";
  return null;
}


  return (
    <div>
      <Nav onLogout={logout} />
      <div style={{ padding: 16 }}>
        <h1>Admin Dashboard</h1>
        <section>
          <h2>Products</h2>
          <ProductList />
        </section>
        <section id="orders">
          <h2>Orders</h2>
          <p>Orders management will be added here.</p>
        </section>
        <section id="workshops">
          <h2>Workshops</h2>
          <p>Workshop registrations management will be added here.</p>
        </section>
      </div>
    </div>
  );
}
