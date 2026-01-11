import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", formData.email);
      
      const res = await fetch("http://localhost:5000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Server returned non-JSON response. Status:", res.status);
        setError("Backend server error. Make sure it's running on port 5000.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok || !data.token) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_email", data.email);

      console.log("Login successful, redirecting...");
      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>BASHO Admin</h1>
          <p>Secure Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@basho.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials:</p>
          <p>Email: admin@basho.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
