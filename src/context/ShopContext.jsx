import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const API_BASE = "https://basho-backend.onrender.com";

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

        if (Array.isArray(wishlistRes.data?.wishlist)) {
          setWishlist(wishlistRes.data.wishlist.map((p) => p._id));
        }

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

  useEffect(() => {
    const onLogout = () => {
      setCart([]);
      setWishlist([]);
      setHistory([]);

      localStorage.removeItem("basho_cart");
      localStorage.removeItem("basho_wishlist");
      localStorage.removeItem("basho_history");
    };

    window.addEventListener("basho:logout", onLogout);
    return () => window.removeEventListener("basho:logout", onLogout);
  }, []);

  const getProductKey = (product) => product._id || product.id || product.name;

  const toggleWishlist = async (product) => {
    const id = getProductKey(product);
    if (!id) return;

    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    const email = getCurrentUserEmail();
    if (!email) return;

    try {
      await axios.post(`${API_BASE}/api/wishlist/toggle`, { email, productId: id });
    } catch (err) {
      console.error("[Shop] Failed to toggle wishlist", err);
    }
  };

  const addToCart = async (product) => {
    const id = getProductKey(product);
    if (!id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing)
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );

      return [...prev, { id, name: product.title || product.name, price: product.price, qty: 1 }];
    });

    const email = getCurrentUserEmail();
    if (!email) return;

    try {
      await axios.post(`${API_BASE}/api/cart/add`, { email, productId: id });
    } catch (err) {
      console.error("[Shop] Failed to add to cart", err);
    }
  };

  const increaseQty = async (id) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );

    const email = getCurrentUserEmail();
    if (!email) return;

    try {
      await axios.post(`${API_BASE}/api/cart/add`, { email, productId: id });
    } catch (err) {
      console.error("[Shop] Failed to increase qty", err);
    }
  };

  const decreaseQty = async (id) => {
    let removed = false;

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          if (item.qty === 1) {
            removed = true;
            return null;
          }
          return { ...item, qty: item.qty - 1 };
        })
        .filter(Boolean)
    );

    const email = getCurrentUserEmail();
    if (!email) return;

    try {
      if (removed) {
        await axios.post(`${API_BASE}/api/cart/remove`, { email, productId: id });
      } else {
        await axios.post(`${API_BASE}/api/cart/decrease`, { email, productId: id });
      }
    } catch (err) {
      console.error("[Shop] Failed to decrease qty", err);
    }
  };

  const removeFromCart = async (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    const email = getCurrentUserEmail();
    if (!email) return;

    try {
      await axios.post(`${API_BASE}/api/cart/remove`, { email, productId: id });
    } catch (err) {
      console.error("[Shop] Failed to remove from cart", err);
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
        { ...item, purchasedAt: new Date().toISOString() },
      ]);

      return prevCart.filter((i) => i.id !== id);
    });

    const email = getCurrentUserEmail();
    if (!email || !purchasedItem) return;

    try {
      await axios.post(`${API_BASE}/api/cart/purchase`, { email, productId: purchasedItem.id });
    } catch (err) {
      console.error("[Shop] Failed to record purchase", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("basho_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("basho_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("basho_history", JSON.stringify(history));
  }, [history]);

  const value = {
    wishlist,
    cart,
    history,
    toggleWishlist,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    markAsPurchased,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within a ShopProvider");
  return ctx;
}
