import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AuthPage.css";

export default function AdminLogin() {
  // Prefill with the admin account you created
  const [email, setEmail] = useState("admin@123.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/admin-login`, {
        email,
        password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("basho_token", res.data.token);
        navigate("/admin");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <h2 className="auth-title">Admin Sign In</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div style={{ marginTop: 16, fontSize: 13, color: "#555" }}>
              <p style={{ margin: 0 }}>
                Tip: Use the admin credentials shown below to sign in.
              </p>
              <p style={{ margin: "6px 0", fontWeight: 600 }}>
                Email: admin@123.com &nbsp; | &nbsp; Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
