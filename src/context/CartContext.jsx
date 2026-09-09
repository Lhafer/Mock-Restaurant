/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from "react";

export const CartContext = createContext(null);

function getStoredCart(storageKey) {
  try {
    const storedCart = window.localStorage.getItem(storageKey);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

export function CartProvider({ storageKey, children }) {
  const [cartItems, setCartItems] = useState(() => getStoredCart(storageKey));

  function saveCart(nextItems) {
    setCartItems(nextItems);
    window.localStorage.setItem(storageKey, JSON.stringify(nextItems));
  }

  function addItem(item) {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      saveCart(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
      return;
    }

    saveCart([
      ...cartItems,
      {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
      },
    ]);
  }

  function changeQuantity(itemId, quantity) {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    saveCart(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    );
  }

  function removeItem(itemId) {
    saveCart(cartItems.filter((item) => item.id !== itemId));
  }

  const clearCart = useCallback(() => {
    setCartItems([]);
    window.localStorage.setItem(storageKey, JSON.stringify([]));
  }, [storageKey]);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        addItem,
        changeQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
