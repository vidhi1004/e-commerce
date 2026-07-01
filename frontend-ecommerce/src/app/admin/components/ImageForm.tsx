"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";

interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface ImageFormProps {
  productId: number;
  image?: ProductImage;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ImageForm({
  productId,
  image,
  onSuccess,
  onCancel,
}: ImageFormProps) {
  const isEdit = !!image;

  const [imageUrl, setImageUrl] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) {
      setImageUrl(image.imageUrl);
      setIsPrimary(image.isPrimary);
      setDisplayOrder(image.displayOrder);
    }
  }, [image]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        isEdit
          ? `${API_BASE_URL}/catalog/images/${image!.id}`
          : `${API_BASE_URL}/catalog/images`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(
            isEdit
              ? {
                  productId,
                  imageUrl,
                  isPrimary,
                  displayOrder,
                }
              : {
                  productId,
                  imageUrl,
                  isPrimary,
                  displayOrder,
                },
          ),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEdit ? "Image Updated Successfully" : "Image Added Successfully",
        );

        if (!isEdit) {
          setImageUrl("");
          setIsPrimary(false);
          setDisplayOrder(0);
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
    <div className="border-2 border-gray-400  shadow-gray-400 rounded-lg p-6 shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Update Image" : "Add Image"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Image URL
          </label>

          <input
            type="url"
            className="w-full border rounded-md p-2 border-gray-200 shadow-md shadow-olive-400"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Primary Image
          </label>

          <select
            className="w-full border rounded-md p-2 border-gray-200 shadow-md shadow-olive-400"
            value={String(isPrimary)}
            onChange={(e) => setIsPrimary(e.target.value === "true")}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Display Order
          </label>

          <input
            type="number"
            className="w-full border rounded-md p-2 border-gray-200 shadow-md shadow-olive-400"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 bg-blue-500 text-white rounded-md py-2 hover:bg-blue-700"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Image"
                : "Add Image"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 text-gray-900 border border-gray-100 shadow-md rounded-md py-2 bg-gray-200 font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
