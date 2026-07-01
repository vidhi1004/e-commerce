"use client";

import { useEffect, useState } from "react";
import { CategoryInterface } from "@/app/user/interface/category.interface";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";

interface CategoryFormProps {
  category?: CategoryInterface;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const isEdit = !!category;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        isEdit
          ? `${API_BASE_URL}/catalog/categories/${category!.id}`
          : `${API_BASE_URL}/catalog/categories`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            description,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEdit
            ? "Category Updated Successfully"
            : "Category Created Successfully",
        );

        if (!isEdit) {
          setName("");
          setDescription("");
        }

        onSuccess?.();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg p-6 mt-6 border border-gray-300 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center shadow-2xl">
        {isEdit ? "Update Category" : "Add Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Category Name
          </label>

          <input
            className="w-full border  border-gray-400 shadow-md shadow-olive-400 rounded-md p-2 "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Description
          </label>

          <textarea
            rows={4}
            className="w-full border border-gray-400 shadow-md shadow-olive-400 rounded-md p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="p-4 pt-0 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 font-semibold shadow-md"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Category"
                : "Add Category"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-100 shadow-md rounded-md py-2 bg-gray-200 font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
