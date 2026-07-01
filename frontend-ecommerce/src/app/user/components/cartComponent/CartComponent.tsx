"use client";

import { useEffect, useMemo, useState } from "react";
import CheckOutComponent from "../checkoutComponent";
import { useCartStore } from "../../../../../lib/store/useCart";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface CartItem {
  productId: number;
  productVariantId: number;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

export default function CartComponent() {
  // const [cart, setCart] = useState<CartItem[]>([]);
  const [hasMounted, SetHasMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();

  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCartStore() as any;

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error("Administrative session missing or expired. Please sign in.");
      router.push("/user/auth/login");
    }
  }, [isAuthenticated, router]);
  useEffect(() => {
    // const storedCart = localStorage.getItem("cart");

    // if (storedCart) {
    //   setCart(JSON.parse(storedCart));
    // }
    SetHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="max-w-7xl mx-auto p-8">Loading your cart...</div>;
  }

  // const updateStorage = (updatedCart: CartItem[]) => {
  //   setCart(updatedCart);
  //   localStorage.setItem("cart", JSON.stringify(updatedCart));
  // };

  // const increaseQuantity = (productVariantId: number) => {
  //   const updatedCart = cart.map((item) =>
  //     item.productVariantId === productVariantId
  //       ? { ...item, quantity: item.quantity + 1 }
  //       : item,
  //   );

  //   updateStorage(updatedCart);
  // };

  // const decreaseQuantity = (productVariantId: number) => {
  //   const updatedCart = cart
  //     .map((item) =>
  //       item.productVariantId === productVariantId
  //         ? { ...item, quantity: item.quantity - 1 }
  //         : item,
  //     )
  //     .filter((item) => item.quantity > 0);

  //   updateStorage(updatedCart);
  // };

  // const removeFromCart = (productVariantId: number) => {
  //   const updatedCart = cart.filter(
  //     (item) => item.productVariantId !== productVariantId,
  //   );

  //   updateStorage(updatedCart);
  // };

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-3xl font-bold">Your Cart is Empty 🛒</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6 border border-gray-100 rounded-2xl">
          {cart.map((item) => (
            <div
              key={item.productVariantId}
              className="flex gap-6 rounded-lg p-4 shadow-2xl m-2 border border-gray-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-md "
            >
              <img
                src={item.image}
                alt={item.productName}
                width={150}
                height={150}
                className="rounded-md"
              />

              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.productName}</h2>

                  <p className="text-gray-500 mt-2">₹ {item.price}</p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => decreaseQuantity(item.productVariantId)}
                    className="border border-slate-100 px-3 py-1 rounded shadow-md active: bg-blue-300"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.productVariantId)}
                    className="border border-slate-100 px-3 py-1 rounded shadow-md active: bg-blue-300 transition-all duration-75"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold mt-4 ">
                  ₹ {item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeFromCart(item.productVariantId)}
                  className="text-red-800 text-shadow-2xl shadow-slate-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-slate-100 rounded-lg p-6 shadow-2xl h-fit">
          <h2 className="text-2xl text-shadow-gray-400 font-semibold mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4">
            <span className="text-shadow-2xs text-semibold text-gray-700">
              Total Items
            </span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between mb-6 ">
            <span className="text-shadow-2xs text-semibold  text-gray-700">
              Subtotal
            </span>
            <span>₹ {subtotal}</span>
          </div>

          <CheckOutComponent params={cart}></CheckOutComponent>
        </div>
      </div>
    </div>
  );
}
