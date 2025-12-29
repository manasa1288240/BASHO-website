import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("basho_user")) || null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("basho_token") || null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (token && !user) {
      try {
        const stored = JSON.parse(localStorage.getItem("basho_user"));
        if (stored) setUser(stored);
      } catch (e) {}
    }
  }, [token]);

  const openLoginModal = (action) => {
    if (action && typeof action === "function") setPendingAction(() => action);
    console.info("[Auth] openLoginModal called", { hasAction: !!action });
    setLoginModalOpen(true);
  };
  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setPendingAction(null);
  };

  const sendOtp = async (contact) => {
    const requestId = "req_" + Date.now();
    const otp = "1234";
    const payload = { requestId, contact, otp, createdAt: Date.now() };
    sessionStorage.setItem("basho_otp_request", JSON.stringify(payload));
    console.info("[Auth] sendOtp stored:", payload);
    await new Promise((r) => setTimeout(r, 600));
    return { requestId };
  };

  const verifyOtp = async ({ requestId, otp }) => {
    await new Promise((r) => setTimeout(r, 600));
    const stored = JSON.parse(sessionStorage.getItem("basho_otp_request") || "null");
    console.info("[Auth] verifyOtp checking stored:", stored, "against", { requestId, otp });
    if (!stored || stored.requestId !== requestId) throw new Error("Invalid request");
    if (stored.otp !== otp) throw new Error("Invalid OTP");

    const newUser = { id: "user_" + Date.now(), contact: stored.contact, name: "" };
    const fakeToken = "token_" + Date.now();
    localStorage.setItem("basho_token", fakeToken);
    localStorage.setItem("basho_user", JSON.stringify(newUser));
    setToken(fakeToken);
    setUser(newUser);

    try {
      window.dispatchEvent(new CustomEvent("basho:login", { detail: { token: fakeToken, user: newUser } }));
    } catch (e) {}

    sessionStorage.removeItem("basho_otp_request");
    setLoginModalOpen(false);
    const action = pendingAction;
    setPendingAction(null);
    if (action) setTimeout(() => action(), 20);
    return { user: newUser };
  };

  const logout = () => {
    localStorage.removeItem("basho_token");
    localStorage.removeItem("basho_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loginModalOpen,
        openLoginModal,
        closeLoginModal,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;