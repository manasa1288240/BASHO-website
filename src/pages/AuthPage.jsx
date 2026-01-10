import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const otpRefs = useRef([]);

  const [step, setStep] = useState("login"); // login | otp
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (step === "otp" && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return name[0] + "•••@" + domain;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const value = inputRef.current.value.trim();

    if (!value) {
      inputRef.current.setCustomValidity("Please enter email");
      inputRef.current.reportValidity();
      return;
    }

    if (!isEmail(value)) {
      inputRef.current.setCustomValidity("Enter valid email");
      inputRef.current.reportValidity();
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: value,
      });
      setContact(value);
      setStep("otp");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otp = otpRefs.current.map((el) => el?.value).join("");

    if (otp.length !== 6) {
      setMessage("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: contact,
          otp,
        }
      );

      localStorage.setItem(
        "basho_user",
        JSON.stringify(res.data.user)
      );

      // 🔥 ONLY ADDITION (fixes refresh issue)
      window.dispatchEvent(new Event("basho-login"));

      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-branding">
          <div className="branding-content">
            <h1 className="branding-title">Welcome to Basho</h1>
            <p className="branding-subtitle">
              Discover the art of Japanese pottery and craftsmanship
            </p>
            <div className="branding-divider"></div>
            <p className="branding-description">
              Join our community to explore handcrafted pottery,
              exclusive workshops, and timeless ceramics.
            </p>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {step === "login" && (
              <>
                <h2 className="auth-title">Login or Sign Up</h2>
                <p className="auth-subtitle">
                  Enter your email to continue
                </p>

                <form onSubmit={handleLoginSubmit} noValidate>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      ref={inputRef}
                      type="email"
                      className="auth-input"
                      placeholder="your@email.com"
                      disabled={loading}
                      onInput={() => {
                        inputRef.current.setCustomValidity("");
                        setMessage("");
                      }}
                    />
                  </div>

                  <button className="auth-btn" disabled={loading}>
                    {loading ? "Sending..." : "Continue"}
                  </button>
                </form>

                {message && <p className="auth-error">{message}</p>}
              </>
            )}

            {step === "otp" && (
              <>
                <h2 className="auth-title">Verify Email</h2>
                <p className="auth-subtitle">
                  Code sent to <strong>{maskEmail(contact)}</strong>
                </p>

                <div className="otp-container">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      className="otp-input"
                      maxLength="1"
                      disabled={loading}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                        if (e.target.value && otpRefs.current[i + 1]) {
                          otpRefs.current[i + 1].focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <button
                  className="auth-btn"
                  onClick={handleVerify}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>

                {message && <p className="auth-error">{message}</p>}

                <button
                  className="auth-back-btn"
                  disabled={loading}
                  onClick={() => {
                    setStep("login");
                    setContact("");
                    setMessage("");
                    inputRef.current?.focus();
                  }}
                >
                  ← Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
