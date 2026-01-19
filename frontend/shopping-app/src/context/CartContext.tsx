import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
    sale?: { original: number; current: number };
  } | null;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  subTotal: number;
  total: number;
  shipping: number;
  taxes: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQty: (cartItemId: string, qty: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const shipping = 10;
  const taxRate = 0.08;

  const subTotal = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  const taxes = subTotal * taxRate;
  const total = subTotal + shipping + taxes;

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      const res = await fetch("http://localhost:3000/api/cart/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      setCartItems((prev) => {
        const existing = prev.find((item) => item.productId?._id === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId?._id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          fetchCart();
          return prev;
        }
      });
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  const updateQty = async (cartItemId: string, qty: number) => {
    if (qty < 1) return;

    try {
      const res = await fetch(`http://localhost:3000/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: qty }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity: qty } : item
        )
      );
    } catch (error) {
      console.error("Update qty error:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subTotal,
        total,
        shipping,
        taxes,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
