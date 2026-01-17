import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("basho_user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("basho_token"));
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (token && !user) {
      try {
        const stored = JSON.parse(localStorage.getItem("basho_user"));
        if (stored) setUser(stored);
      } catch {}
    }
  }, [token, user]);

  const openLoginModal = (action) => {
    if (action && typeof action === "function") {
      setPendingAction(() => action);
    }
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setPendingAction(null);
  };

  const sendOtp = async (contact) => {
    const requestId = "req_" + Date.now();
    const otp = "1234";

    sessionStorage.setItem(
      "basho_otp_request",
      JSON.stringify({ requestId, contact, otp, createdAt: Date.now() })
    );

    await new Promise((r) => setTimeout(r, 600));
    return { requestId };
  };

  const verifyOtp = async ({ requestId, otp }) => {
    await new Promise((r) => setTimeout(r, 600));
    const stored = JSON.parse(sessionStorage.getItem("basho_otp_request"));

    if (!stored || stored.requestId !== requestId) {
      throw new Error("Invalid request");
    }
    if (stored.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    const newUser = {
      id: "user_" + Date.now(),
      contact: stored.contact,
      name: "",
      role: "user",
    };

    const fakeToken = "token_" + Date.now();

    localStorage.setItem("basho_token", fakeToken);
    localStorage.setItem("basho_user", JSON.stringify(newUser));

    setToken(fakeToken);
    setUser(newUser);

    sessionStorage.removeItem("basho_otp_request");
    setLoginModalOpen(false);

    if (pendingAction) {
      setTimeout(() => pendingAction(), 20);
      setPendingAction(null);
    }

    return { user: newUser };
  };

  const logout = () => {
    localStorage.removeItem("basho_token");
    localStorage.removeItem("basho_user");

    localStorage.removeItem("cart");
    localStorage.removeItem("basho_cart");
    localStorage.removeItem("basho_cart_items");

    setToken(null);
    setUser(null);

    window.dispatchEvent(new Event("basho-clear-cart"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
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
