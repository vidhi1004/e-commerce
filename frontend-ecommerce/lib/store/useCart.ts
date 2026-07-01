import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cart") || "[]")
      : [],

  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.find(
        (i) => i.productVariantId === item.productVariantId,
      );
      let updatedCart;

      if (exists) {
        updatedCart = state.cart.map((i) =>
          i.productVariantId === item.productVariantId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      } else {
        updatedCart = [...state.cart, item];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  removeFromCart: (productVariantId) =>
    set((state) => {
      const updatedCart = state.cart.filter(
        (item) => item.productVariantId !== productVariantId,
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  increaseQuantity: (id) =>
    set((state) => {
      const updated = state.cart.map((i) =>
        i.productVariantId === id ? { ...i, quantity: i.quantity + 1 } : i,
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return { cart: updated };
    }),

  decreaseQuantity: (id) =>
    set((state) => {
      const updated = state.cart
        .map((i) =>
          i.productVariantId === id ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updated));
      return { cart: updated };
    }),
}));
