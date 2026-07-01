"use client";

import { useEffect, useState } from "react";
import { ProductResponseInterface } from "../../user/interface/productResponse.interface";
import { ProductInterface } from "../../user/interface/product.interface";
import ProductTable from "./ProductTable";
import Link from "next/link";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

export function ProductComponent() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error("Administrative session missing or expired. Please sign in.");
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/catalog/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data: ProductResponseInterface = await response.json();
        console.log(data);
        if (response.ok) {
          setProducts(data.products);
        } else {
          toast.error("something went wrong");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(products);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <div className="flex justify-between items-center mb-4 px-4 m-4">
          <h1 className="text-2xl font-bold text-gray-500">Products</h1>
          <Link
            href="products/create"
            className="bg-blue-500 text-white px-5 py-2.5 shadow-md rounded-md hover:bg-blue-800 transition-colors font-medium text-sm"
          >
            Create Product
          </Link>
        </div>

        <div className="w-full">
          <ProductTable products={products} />
        </div>
      </div>
    );
  }
}
