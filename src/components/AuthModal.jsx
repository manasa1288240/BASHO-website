import { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./AuthModal.css";

export default function AuthModal({ open, onClose, onLoginSuccess }) {
  // ✅ Backend base URL (works in Vercel + local)
  const API_URL = import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  const inputRef = useRef(null);
  const otpRefs = useRef([]);
  const [step, setStep] = useState("login"); // login | otp
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("login");
      setContact("");
      setMessage("");
      otpRefs.current = [];
    }
  }, [open]);

  useEffect(() => {
    if (step === "otp" && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  if (!open) return null;

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
      await axios.post(`${API_URL}/api/auth/send-otp`, {
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
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: contact,
        otp,
      });

      // ✅ SAVE LOGIN STATE
      localStorage.setItem("basho_user", JSON.stringify(res.data.user));

      if (onLoginSuccess) onLoginSuccess(res.data.user);

      onClose();
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>
          ×
        </button>

        {step === "login" && (
          <>
            <h2 className="auth-title">Login or Sign up</h2>
            <p className="auth-subtitle">Please enter your email to continue</p>

            <form onSubmit={handleLoginSubmit} noValidate>
              <input
                ref={inputRef}
                type="email"
                className="auth-input"
                placeholder="Email address"
                onInput={() => {
                  inputRef.current.setCustomValidity("");
                  setMessage("");
                }}
                disabled={loading}
              />

              <button className="auth-btn" disabled={loading}>
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>

            {message && <p className="auth-error">{message}</p>}
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="auth-title">Verify your email</h2>
            <p className="auth-subtitle">
              Enter the code sent to <br />
              <strong>{maskEmail(contact)}</strong>
            </p>

            <div className="otp-boxes">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className="otp-input"
                  maxLength="1"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value && otpRefs.current[i + 1]) {
                      otpRefs.current[i + 1].focus();
                    }
                  }}
                />
              ))}
            </div>

            <button className="auth-btn" onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>

            {message && <p className="auth-error">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}
