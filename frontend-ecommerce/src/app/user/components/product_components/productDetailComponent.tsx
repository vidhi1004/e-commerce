// import { ProductInterface } from "@/app/interface/product.interface";

// interface ProductCardProps {
//   product: ProductInterface;
// }

// export function ProductDetailComponent({ product }: ProductCardProps) {
//   return (
//     <ul key={product.id}>
//       <li>{product.id}</li>
//       <li>{product.name}</li>
//       <li>{product.description}</li>
//       <li>{product.brand}</li>
//       <li>{product.category?.name}</li>
//       <img src={product.images?.[0]?.imageUrl} alt={product.name} width={200} />
//       <li>{product.variants?.[0]?.size}</li>
//     </ul>
//   );
// }

"use client";

import { useState } from "react";
import { ProductInterface } from "@/app/user/interface/product.interface";
import ReviewComponent from "../review_component/ReviewComponent";
import { CartItem } from "../cartComponent/CartComponent";
import { toast } from "sonner";
import { useCartStore } from "../../../../../lib/store/useCart";
import CheckOutComponent from "../checkoutComponent";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

interface ProductDetailProps {
  product: ProductInterface;
}

export default function ProductDetailComponent({
  product,
}: ProductDetailProps) {
  const { addToCart } = useCartStore() as any;
  const { isAuthenticated } = useAuthGuard();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.imageUrl || "",
  );

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);

  const addToWishlist = (product: ProductInterface) => {
    if (isAuthenticated === null || !isAuthenticated) {
      toast.warning("Please Log In ");
      router.push("/user/auth/login");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Your are not logged In Please Log In To add Items");
    }
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    const exists = wishlist.find(
      (item: ProductInterface) => item.id === product.id,
    );

    if (exists) {
      toast.warning("Product Already in Wishlist");
    } else {
      wishlist.push(product);
      toast.success("Product Add in Wishlist");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };
  const handleAddToCart = (product: ProductInterface) => {
    if (isAuthenticated === null || !isAuthenticated) {
      toast.warning("Please Log In ");
      router.push("/user/auth/login");
    }
    // const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // const exists = cart.find(
    //   (item: CartItem) => item.productId === selectedVariant.id,
    // );

    // if (exists) {
    //   exists.quantity += 1;
    // } else {
    const item = {
      productId: product.id,
      productVariantId: selectedVariant.id,
      productName: product.name,
      image: selectedImage,
      price: selectedVariant.price,
      quantity: 1,
    };

    addToCart(item);
    toast.success("Product Add in Cart");
  };

  // localStorage.setItem("cart", JSON.stringify(cart));
  // };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={selectedImage || "/placeholder.png"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-125 object-cover"
            />
          </div>

          <div className="flex gap-4 mt-4">
            {product.images?.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.imageUrl)}
                className="border rounded-lg overflow-hidden"
              >
                <img
                  src={image.imageUrl}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl font-bold">{product.name}</h1>

          <p className="text-gray-500">
            Brand:
            <span className="font-medium text-black ml-2">{product.brand}</span>
          </p>

          <p className="text-gray-500">
            Category:
            <span className="font-medium text-black ml-2">
              {product.category?.name}
            </span>
          </p>

          <h2 className="text-3xl font-bold text-green-700">
            ₹{selectedVariant?.price}
          </h2>

          <div>
            <h3 className="font-semibold mb-2">Available Variants</h3>

            <div className="flex flex-wrap gap-3">
              {product.variants?.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedVariant?.id === variant.id
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          <div>
            {selectedVariant?.inventory?.stock > 5 ? (
              <p className="text-green-600 font-semibold">In Stock</p>
            ) : selectedVariant?.inventory?.stock > 0 ? (
              <p className="text-amber-600 font-semibold">Only Few Left</p>
            ) : (
              <p className="text-red-600 font-semibold">Out of Stock</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={() => addToWishlist(product)}
              className="border px-6 py-3 rounded-lg active:bg-gray-600"
            >
              ❤️ Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Details</h2>
        <p className="text-gray-700">{product.description}</p>
      </div>
      <div>
        <ReviewComponent productId={product.id}></ReviewComponent>
      </div>
    </div>
  );
}
