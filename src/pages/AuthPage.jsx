import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Sparkles } from "lucide-react";
import Footer from "../components/Footer";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();

  // ✅ Backend base URL (works in Vercel + local if you set .env)
  const API_URL = import.meta.env.VITE_API_URL || "https://basho-backend.onrender.com";

  const [authMode, setAuthMode] = useState("choice"); // choice | signin | signup
  const [step, setStep] = useState("email"); // email | password (signin) | otp | profile (signup)

  // Sign In State
  const [signInData, setSignInData] = useState({ email: "", password: "" });

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const otpRefs = useRef([]);
  const emailInputRef = useRef(null);
  const signInInputRef = useRef(null);

  /* ================== SIGN IN FLOWS ================== */

  const handleSignInEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!signInData.email) {
      setMessage("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
      setMessage("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      // Check if this is an admin account
      console.log("📧 Checking email:", signInData.email);

      const checkRes = await axios.post(
        `${API_URL}/api/auth/check-admin-email`,
        {
          email: signInData.email,
        }
      );

      console.log("✅ Email check response:", checkRes.data);

      if (checkRes.data.isAdmin) {
        // Admin: proceed to password step
        console.log("🔐 Admin email detected, requesting password...");
        setStep("password");
      } else if (checkRes.data.exists) {
        // Regular user: proceed to password
        console.log("👤 Regular user detected");
        setStep("password");
      } else {
        // New email: not found
        setMessage("Email not found. Please sign up instead.");
      }
      setLoading(false);
    } catch (err) {
      console.error("❌ Email check error:", err.message);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      // Fallback: still proceed to password step in case of error
      console.warn("⚠️ Proceeding to password step despite error");
      setStep("password");
      setLoading(false);
    }
  };

  const handleSignInPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!signInData.password) {
      setMessage("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/signin`, {
        email: signInData.email,
        password: signInData.password,
      });

      const user = res.data.user || {};
      localStorage.setItem("basho_user", JSON.stringify(user));
      localStorage.setItem("basho_token", res.data.token);
      if (user.isAdmin) {
        localStorage.setItem("admin_token", res.data.token);
      }

      window.dispatchEvent(new Event("basho-login"));

      if (user.isAdmin) {
        console.log("🔐 Admin signed in, redirecting to admin panel...");
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================== SIGN UP FLOWS ================== */

  const handleSignUpEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!signUpEmail) {
      setMessage("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail)) {
      setMessage("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const checkRes = await axios.post(
        `${API_URL}/api/auth/check-admin-email`,
        {
          email: signUpEmail,
        }
      );

      if (checkRes.data.exists) {
        setMessage("Email already registered. Please sign in instead.");
        setLoading(false);
        return;
      }

      // Send OTP
      await axios.post(`${API_URL}/api/auth/send-otp`, {
        email: signUpEmail,
      });

      setStep("otp");
      setLoading(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
      setLoading(false);
    }
  };

  const handleSignUpOtpVerify = async () => {
    const otp = otpRefs.current.map((el) => el?.value).join("");

    if (otp.length !== 6) {
      setMessage("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: signUpEmail,
        otp,
      });

      // OTP verified, move to profile setup
      setStep("profile");
      setLoading(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !signUpData.firstName ||
      !signUpData.lastName ||
      !signUpData.phone ||
      !signUpData.password
    ) {
      setMessage("Please fill in all fields");
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (signUpData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/update-profile`, {
        email: signUpEmail,
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        phone: signUpData.phone,
        password: signUpData.password,
      });

      const user = res.data.user || {};
      localStorage.setItem("basho_user", JSON.stringify(user));
      localStorage.setItem("basho_token", res.data.token);

      window.dispatchEvent(new Event("basho-login"));

      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const resetSignIn = () => {
    setAuthMode("choice");
    setStep("email");
    setSignInData({ email: "", password: "" });
    setMessage("");
  };

  const resetSignUp = () => {
    setAuthMode("choice");
    setStep("email");
    setSignUpEmail("");
    setSignUpData({
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setMessage("");
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
              Join our community to explore handcrafted pottery, exclusive
              workshops, and timeless ceramics.
            </p>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* CHOICE SCREEN */}
            {authMode === "choice" && (
              <>
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">
                  Choose how you'd like to proceed
                </p>

                <div className="auth-choice-buttons">
                  <button
                    className="auth-choice-btn signin-btn"
                    onClick={() => {
                      setAuthMode("signin");
                      setStep("email");
                    }}
                  >
                    <Lock className="choice-icon" size={32} />
                    <span className="choice-label">Sign In</span>
                    <span className="choice-desc">Use your password</span>
                  </button>

                  <button
                    className="auth-choice-btn signup-btn"
                    onClick={() => {
                      setAuthMode("signup");
                      setStep("email");
                    }}
                  >
                    <Sparkles className="choice-icon" size={32} />
                    <span className="choice-label">Sign Up</span>
                    <span className="choice-desc">Create new account</span>
                  </button>
                </div>
              </>
            )}

            {/* SIGN IN FLOW */}
            {authMode === "signin" && (
              <>
                {step === "email" && (
                  <>
                    <h2 className="auth-title">Sign In</h2>
                    <p className="auth-subtitle">Enter your email</p>

                    <form onSubmit={handleSignInEmailSubmit} noValidate>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          ref={emailInputRef}
                          type="email"
                          className="auth-input"
                          placeholder="your@email.com"
                          value={signInData.email}
                          onChange={(e) => {
                            setSignInData({
                              ...signInData,
                              email: e.target.value,
                            });
                            setMessage("");
                          }}
                          disabled={loading}
                        />
                      </div>

                      <button className="auth-btn" disabled={loading}>
                        {loading ? "Checking..." : "Continue"}
                      </button>
                    </form>

                    {message && <p className="auth-error">{message}</p>}

                    <button
                      className="auth-back-btn"
                      onClick={resetSignIn}
                      disabled={loading}
                    >
                      ← Back
                    </button>
                  </>
                )}

                {step === "password" && (
                  <>
                    <h2 className="auth-title">Enter Password</h2>
                    <p className="auth-subtitle">
                      Password for {signInData.email}
                    </p>

                    <form onSubmit={handleSignInPasswordSubmit} noValidate>
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          ref={signInInputRef}
                          type="password"
                          className="auth-input"
                          placeholder="••••••••"
                          value={signInData.password}
                          onChange={(e) => {
                            setSignInData({
                              ...signInData,
                              password: e.target.value,
                            });
                            setMessage("");
                          }}
                          disabled={loading}
                          autoFocus
                        />
                      </div>

                      <button className="auth-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                      </button>
                    </form>

                    {message && <p className="auth-error">{message}</p>}

                    <button
                      className="auth-back-btn"
                      onClick={() => {
                        setStep("email");
                        setSignInData({ ...signInData, password: "" });
                        setMessage("");
                      }}
                      disabled={loading}
                    >
                      ← Back
                    </button>
                  </>
                )}
              </>
            )}

            {/* SIGN UP FLOW */}
            {authMode === "signup" && (
              <>
                {step === "email" && (
                  <>
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Enter your email</p>

                    <form onSubmit={handleSignUpEmailSubmit} noValidate>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          className="auth-input"
                          placeholder="your@email.com"
                          value={signUpEmail}
                          onChange={(e) => {
                            setSignUpEmail(e.target.value);
                            setMessage("");
                          }}
                          disabled={loading}
                        />
                      </div>

                      <button className="auth-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                      </button>
                    </form>

                    {message && <p className="auth-error">{message}</p>}

                    <button
                      className="auth-back-btn"
                      onClick={resetSignUp}
                      disabled={loading}
                    >
                      ← Back
                    </button>
                  </>
                )}

                {step === "otp" && (
                  <>
                    <h2 className="auth-title">Verify Email</h2>
                    <p className="auth-subtitle">
                      Code sent to{" "}
                      <strong>
                        {signUpEmail.split("@")[0]}•••@
                        {signUpEmail.split("@")[1]}
                      </strong>
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
                            setMessage("");
                          }}
                        />
                      ))}
                    </div>

                    <button
                      className="auth-btn"
                      onClick={handleSignUpOtpVerify}
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>

                    {message && <p className="auth-error">{message}</p>}

                    <button
                      className="auth-back-btn"
                      onClick={() => {
                        setStep("email");
                        setMessage("");
                        otpRefs.current.forEach((ref) => {
                          if (ref) ref.value = "";
                        });
                      }}
                      disabled={loading}
                    >
                      ← Back
                    </button>
                  </>
                )}

                {step === "profile" && (
                  <>
                    <h2 className="auth-title">Complete Your Profile</h2>
                    <p className="auth-subtitle">Set up your account details</p>

                    <form onSubmit={handleProfileSubmit} noValidate>
                      <div className="form-row">
                        <div className="form-group">
                          <label>First Name *</label>
                          <input
                            type="text"
                            className="auth-input"
                            placeholder="John"
                            value={signUpData.firstName}
                            onChange={(e) => {
                              setSignUpData({
                                ...signUpData,
                                firstName: e.target.value,
                              });
                              setMessage("");
                            }}
                            disabled={loading}
                          />
                        </div>
                        <div className="form-group">
                          <label>Last Name *</label>
                          <input
                            type="text"
                            className="auth-input"
                            placeholder="Doe"
                            value={signUpData.lastName}
                            onChange={(e) => {
                              setSignUpData({
                                ...signUpData,
                                lastName: e.target.value,
                              });
                              setMessage("");
                            }}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          className="auth-input"
                          placeholder="+91 9999999999"
                          value={signUpData.phone}
                          onChange={(e) => {
                            setSignUpData({
                              ...signUpData,
                              phone: e.target.value,
                            });
                            setMessage("");
                          }}
                          disabled={loading}
                        />
                      </div>

                      <div className="form-group">
                        <label>Password *</label>
                        <input
                          type="password"
                          className="auth-input"
                          placeholder="••••••••"
                          value={signUpData.password}
                          onChange={(e) => {
                            setSignUpData({
                              ...signUpData,
                              password: e.target.value,
                            });
                            setMessage("");
                          }}
                          disabled={loading}
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm Password *</label>
                        <input
                          type="password"
                          className="auth-input"
                          placeholder="••••••••"
                          value={signUpData.confirmPassword}
                          onChange={(e) => {
                            setSignUpData({
                              ...signUpData,
                              confirmPassword: e.target.value,
                            });
                            setMessage("");
                          }}
                          disabled={loading}
                        />
                      </div>

                      <button className="auth-btn" disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                      </button>
                    </form>

                    {message && <p className="auth-error">{message}</p>}

                    <button
                      className="auth-back-btn"
                      onClick={() => {
                        setStep("otp");
                        setMessage("");
                      }}
                      disabled={loading}
                    >
                      ← Back
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
