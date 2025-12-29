import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const STORAGE_KEY = "basho_cart_v1";
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { products: [], workshops: [] };
    } catch (e) {
      return { products: [], workshops: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  // Listen for login events to merge cart with server
  useEffect(() => {
    const onLogin = async (e) => {
      const { token, user } = e?.detail || {};
      try {
        const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (local && (local.products?.length || local.workshops?.length)) {
          // TODO: call backend /cart/merge with token
          // For now, pretend merge succeeded and clear local storage
          console.info("Merging local cart to server for user", user?.contact || user?.id);
          // In a real app, POST /cart/merge with auth header and replace local with server response
          localStorage.removeItem(STORAGE_KEY);
          setItems({ products: [], workshops: [] });
        }
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener("basho:login", onLogin);
    return () => window.removeEventListener("basho:login", onLogin);
  }, []);

  const addProduct = (product) => {
    setItems((cur) => ({ ...cur, products: [...cur.products, product] }));
  };

  const removeProduct = (productId) => {
    setItems((cur) => ({ ...cur, products: cur.products.filter((p) => p.id !== productId) }));
  };

  const clearCart = () => setItems({ products: [], workshops: [] });

  const addWorkshop = (workshop) => {
    setItems((cur) => ({ ...cur, workshops: [...cur.workshops, workshop] }));
  };

  return (
    <CartContext.Provider value={{ items, addProduct, removeProduct, clearCart, addWorkshop }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
