import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
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

  // ================= SEND OTP =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const value = inputRef.current.value.trim();

    if (!value) {
      inputRef.current.setCustomValidity("Please fill in this field");
      inputRef.current.reportValidity();
      return;
    }

    if (!isEmail(value)) {
      inputRef.current.setCustomValidity("Enter a valid email address");
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

  // ================= VERIFY OTP =================
  const handleVerify = async () => {
    const otp = otpRefs.current.map((el) => el?.value).join("");

    if (otp.length !== 6) {
      setMessage("Please enter the 6-digit OTP");
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

      // ✅ SAVE LOGIN STATE
      localStorage.setItem(
        "basho_user",
        JSON.stringify(res.data.user)
      );

      // Redirect to home after successful login
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-container">
        {/* LEFT SECTION - BRANDING */}
        <div className="auth-branding">
          <div className="branding-content">
            <h1 className="branding-title">Welcome to Basho</h1>
            <p className="branding-subtitle">
              Discover the art of Japanese pottery and craftsmanship
            </p>
            <div className="branding-divider"></div>
            <p className="branding-description">
              Join our community to explore handcrafted pottery, exclusive workshops, and the timeless beauty of traditional Japanese ceramics.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION - FORM */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {step === "login" && (
              <>
                <h2 className="auth-title">Login or Sign Up</h2>
                <p className="auth-subtitle">
                  Enter your email to get started
                </p>

                <form onSubmit={handleLoginSubmit} noValidate>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      ref={inputRef}
                      type="email"
                      className="auth-input"
                      placeholder="your@email.com"
                      onInput={() => {
                        inputRef.current.setCustomValidity("");
                        setMessage("");
                      }}
                      disabled={loading}
                    />
                  </div>

                  <button className="auth-btn" disabled={loading}>
                    {loading ? "Sending..." : "Continue"}
                  </button>
                </form>

                {message && <p className="auth-error">{message}</p>}

                <p className="auth-terms">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </>
            )}

            {step === "otp" && (
              <>
                <h2 className="auth-title">Verify Your Email</h2>
                <p className="auth-subtitle">
                  We've sent a code to<br />
                  <strong>{maskEmail(contact)}</strong>
                </p>

                <div className="otp-container">
                  <div className="otp-boxes">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        className="otp-input"
                        maxLength="1"
                        placeholder={String(i + 1)}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                          if (e.target.value && otpRefs.current[i + 1]) {
                            otpRefs.current[i + 1].focus();
                          }
                        }}
                        disabled={loading}
                      />
                    ))}
                  </div>
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
                  type="button"
                  className="auth-back-btn"
                  onClick={() => {
                    setStep("login");
                    setContact("");
                    setMessage("");
                    inputRef.current?.focus();
                  }}
                  disabled={loading}
                >
                  ← Back to Email
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
