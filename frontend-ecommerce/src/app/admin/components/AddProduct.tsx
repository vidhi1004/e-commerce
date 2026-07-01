"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const { isAuthenticated } = useAuthGuard();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error("Administrative session missing or expired. Please sign in.");
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/catalog/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setCategories(data.categories);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/catalog/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          description,
          brand,
          categoryId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product Created Successfully");

        console.log(data);

        setName("");
        setDescription("");
        setBrand("");
        setCategoryId(0);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 border border-gray-200 rounded-lg p-8 shadow-xl  shadow-olive-400">
      <h1 className="text-3xl font-bold mb-6">Create Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium">Product Name</label>

          <input
            className="w-full border border-gray-200  shadow-md shadow-olive-400 rounded-md p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            rows={5}
            className="w-full border border-gray-200  shadow-md shadow-olive-400 rounded-md p-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Brand</label>

          <input
            className="w-full border border-gray-200  shadow-md shadow-olive-400 rounded-md p-3"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Category</label>

          <select
            className="w-full border rounded-md p-3  border-gray-200  shadow-md shadow-olive-400"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value={0}>Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full shadow-md"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
