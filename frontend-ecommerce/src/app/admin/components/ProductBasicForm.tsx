"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

interface ProductBasicFormProps {
  id: number;
  product: any;
  onUpdated: () => void;
}

export default function ProductBasicForm({
  id,
  product,
  onUpdated,
}: ProductBasicFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setBrand(product.brand);
      setCategoryId(product.category?.id);
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/catalog/categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/catalog/products/${id}`, {
        method: "PATCH",
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
        toast.success("Product Updated Successfully");
        onUpdated();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" shadow-olive-400 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-5">Product Information</h2>

      <form onSubmit={handleSubmit} className="space-y-5 ">
        <div>
          <label className="font-semibold text-gray-700">Name</label>

          <input
            className="border-2 border-gray-100 rounded w-full p-3 shadow-md shadow-olive-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Description</label>

          <textarea
            className="border-2 border-gray-100 rounded w-full p-3 shadow-md shadow-olive-400"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Brand</label>

          <input
            className="border-2 border-gray-100 rounded w-full p-3 shadow-md shadow-olive-400"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Category</label>

          <select
            className="border-2 border-gray-100 rounded w-full p-3 shadow-md shadow-olive-400"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
