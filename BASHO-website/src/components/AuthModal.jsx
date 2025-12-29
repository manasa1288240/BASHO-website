import { useRef, useState } from "react";
import "./AuthModal.css";

export default function AuthModal({ open, onClose }) {
  const inputRef = useRef(null);
  const otpRefs = useRef([]);
  const [step, setStep] = useState("login"); // login | otp
  const [contact, setContact] = useState("");

  if (!open) return null;

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isMobile = (v) => /^[6-9]\d{9}$/.test(v);

  const maskContact = (v) => {
    if (isEmail(v)) {
      const [name, domain] = v.split("@");
      return name[0] + "•••@" + domain;
    }
    return v.slice(0, 2) + "•••••" + v.slice(-2);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    inputRef.current.setCustomValidity("");

    if (!value) {
      inputRef.current.setCustomValidity("Please fill in this field");
      inputRef.current.reportValidity();
      return;
    }

    if (!isEmail(value) && !isMobile(value)) {
      inputRef.current.setCustomValidity(
        "Enter a valid email or 10-digit mobile number"
      );
      inputRef.current.reportValidity();
      return;
    }

    setContact(value);
    setStep("otp"); // 👉 DIRECT TRANSITION
  };

  const handleOtpChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "");
    e.target.value = val;
    if (val && i < 5) otpRefs.current[i + 1].focus();
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>×</button>

        {step === "login" && (
          <>
            <h2 className="auth-title">Login or Sign up</h2>
            <p className="auth-subtitle">
              Please enter your mobile number or email to continue
            </p>

            <form onSubmit={handleLoginSubmit} noValidate>
              <input
                ref={inputRef}
                type="text"
                className="auth-input"
                placeholder="Mobile number or Email"
                onInput={() => inputRef.current.setCustomValidity("")}
              />

              <button className="auth-btn" type="submit">
                Continue
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="auth-title">Verify your contact</h2>
            <p className="auth-subtitle">
              Enter the 6-digit code sent to <br />
              <strong>{maskContact(contact)}</strong>
            </p>

            <div className="otp-boxes">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  onChange={(e) => handleOtpChange(e, i)}
                />
              ))}
            </div>

            <button className="auth-btn">
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
}
