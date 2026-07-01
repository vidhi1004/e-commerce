"use client";

import { ProductInterface } from "@/app/user/interface/product.interface";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "../../../../../lib/store/useCart";
import Link from "next/link";
import { useAuthGuard } from "../../../hooks/useAuthGuard";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { isAuthenticated } = useAuthGuard();
  const [wishlist, setWishlist] = useState<ProductInterface[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  const { addToCart } = useCartStore() as any;

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error("Administrative session missing or expired. Please sign in.");
      router.push("/user/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedWishlist = localStorage.getItem("wishlist");

    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
    setHasMounted(true);
    if (!token) {
      toast.warning("You are not Logged In");
    }
  }, []);

  if (!hasMounted) {
    return (
      <div className="max-w-7xl mx-auto p-8">Loading your wishlist...</div>
    );
  }

  const removeFromWishlist = (id: number) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product: ProductInterface) => {
    const firstVariant = product.variants?.[0];
    const firstImage = product.images?.[0]?.imageUrl;

    if (!firstVariant) {
      toast.error("This product has no available variants.");
      return;
    }

    const item = {
      productId: product.id,
      productVariantId: firstVariant.id,
      productName: product.name,
      image: firstImage || "",
      price: firstVariant.price,
      quantity: 1,
    };

    addToCart(item);
    toast.success("Product added to cart!");
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-semibold">Your wishlist is empty ❤️</h1>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className=" border border-gray-100 rounded-lg shadow-2xl overflow-hidden flex-wrap flex-col justify-between transition-all duration-150 hover:translate-y-1 "
            >
              <div>
                <img
                  src={item.images?.[0]?.imageUrl || "/placeholder-image.png"}
                  alt={item.name}
                  className="h-60 w-full object-cover"
                />

                <div className="p-4">
                  <Link
                    className="font-semibold text-lg active:text-blue-400"
                    href={`products/${item.id}`}
                  >
                    {item.name}
                  </Link>

                  <p className="text-gray-600 mt-2">
                    ₹{item.variants?.[0]?.price ?? "N/A"}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex gap-3">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-300 transition"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
