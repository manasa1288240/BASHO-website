import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ShopContext = createContext(null);

const API_BASE = "http://localhost:5000";

export function ShopProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("basho_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("basho_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("basho_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const getCurrentUserEmail = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("basho_user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.email || null;
    } catch {
      return null;
    }
  };

  // On load, if a user is logged in, hydrate cart/wishlist/history from backend
  useEffect(() => {
    const email = getCurrentUserEmail();
    if (!email) return;

    const loadFromServer = async () => {
      try {
        const [cartRes, wishlistRes, historyRes] = await Promise.all([
          axios.get(`${API_BASE}/api/cart`, { params: { email } }),
          axios.get(`${API_BASE}/api/wishlist`, { params: { email } }),
          axios.get(`${API_BASE}/api/cart/history`, { params: { email } }),
        ]);

        // Cart: map populated documents into lightweight items used by UI
        if (Array.isArray(cartRes.data?.cart)) {
          setCart(
            cartRes.data.cart.map((item) => ({
              id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              qty: item.qty,
            }))
          );
        }

        // Wishlist: store just product IDs
        if (Array.isArray(wishlistRes.data?.wishlist)) {
          setWishlist(wishlistRes.data.wishlist.map((p) => p._id));
        }

        // History: flatten orders into individual purchased items
        if (Array.isArray(historyRes.data?.history)) {
          const flattened = [];
          historyRes.data.history.forEach((order) => {
            (order.items || []).forEach((i) => {
              flattened.push({
                id: i.product._id,
                name: i.product.name,
                price: i.product.price,
                qty: i.qty,
                purchasedAt: order.purchasedAt,
              });
            });
          });
          setHistory(flattened);
        }
      } catch (err) {
        console.error("[Shop] Failed to sync state from server", err);
      }
    };

    loadFromServer();
  }, []);

  // helpers
  const getProductKey = (product) => product._id || product.id || product.name;

  const toggleWishlist = async (product) => {
    const id = getProductKey(product);
    if (!id) return;

    // Update local state immediately for snappy UI
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    // Persist to backend if user is logged in
    const email = getCurrentUserEmail();
    if (!email) return;
    try {
      await axios.post(`${API_BASE}/api/wishlist/toggle`, {
        email,
        productId: product._id || product.id || id,
      });
    } catch (err) {
      console.error("[Shop] Failed to toggle wishlist on server", err);
    }
  };

  const addToCart = async (product) => {
    const id = getProductKey(product);
    if (!id) return;

    // Local state update
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id,
          name: product.title || product.name,
          price: product.price,
          qty: 1,
        },
      ];
    });

    const email = getCurrentUserEmail();
    if (!email) return;
    try {
      await axios.post(`${API_BASE}/api/cart/add`, {
        email,
        productId: product._id || product.id || id,
      });
    } catch (err) {
      console.error("[Shop] Failed to add to cart on server", err);
    }
  };

  const removeFromCart = async (id) => {
    // Update local state immediately
    setCart((prev) => prev.filter((item) => item.id !== id));

    const email = getCurrentUserEmail();
    if (!email) return;

    try {
      await axios.post(`${API_BASE}/api/cart/remove`, {
        email,
        productId: id,
      });
    } catch (err) {
      console.error("[Shop] Failed to remove from cart on server", err);
    }
  };

  const markAsPurchased = async (id) => {
    let purchasedItem = null;

    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === id);
      if (!item) return prevCart;

      purchasedItem = item;

      setHistory((prevHistory) => [
        ...prevHistory,
        {
          ...item,
          purchasedAt: new Date().toISOString(),
        },
      ]);

      return prevCart.filter((i) => i.id !== id);
    });

    const email = getCurrentUserEmail();
    if (!email || !purchasedItem) return;

    try {
      await axios.post(`${API_BASE}/api/cart/purchase`, {
        email,
        productId: purchasedItem.id,
      });
    } catch (err) {
      console.error("[Shop] Failed to record purchase on server", err);
    }
  };

  // persistence
  useEffect(() => {
    try {
      localStorage.setItem("basho_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem("basho_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("basho_history", JSON.stringify(history));
    } catch {}
  }, [history]);

  const value = {
    wishlist,
    cart,
    history,
    toggleWishlist,
    addToCart,
    removeFromCart,
    markAsPurchased,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return ctx;
}
