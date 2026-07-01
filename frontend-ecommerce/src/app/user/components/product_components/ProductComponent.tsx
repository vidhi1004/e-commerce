"use client";

import { useEffect, useState } from "react";
import { ProductResponseInterface } from "../../interface/productResponse.interface";
import { ProductInterface } from "../../interface/product.interface";
import { ProductCard } from "./ProductCard";
import { API_BASE_URL } from "../../../../../lib/api";
import { toast } from "sonner";

export function ProductComponent() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }
}
