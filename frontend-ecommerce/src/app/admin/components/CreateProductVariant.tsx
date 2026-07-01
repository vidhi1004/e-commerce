"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";

interface ProductVariant {
  id: number;
  sku: string;
  size: string;
  price: number;
  color: string;
}

interface VariantFormProps {
  productId: number;
  variant?: ProductVariant;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function VariantForm({
  productId,
  variant,
  onSuccess,
  onCancel,
}: VariantFormProps) {
  const [sku, setSku] = useState("");
  const [size, setSize] = useState("XS");
  const [price, setPrice] = useState(0);
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = !!variant;

  useEffect(() => {
    if (variant) {
      setSku(variant.sku);
      setSize(variant.size);
      setPrice(variant.price);
      setColor(variant.color);
    }
  }, [variant]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        isEdit
          ? `${API_BASE_URL}/catalog/variants/${variant!.id}`
          : `${API_BASE_URL}/catalog/variants`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            ...(isEdit ? {} : { productId }),
            sku,
            size,
            price,
            color,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEdit
            ? "Variant Updated Successfully"
            : "Variant Created Successfully",
        );

        if (!isEdit) {
          setSku("");
          setSize("XS");
          setPrice(0);
          setColor("");
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
        {isEdit ? "Update Variant" : "Add Variant"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">SKU</label>

          <input
            className="w-full border rounded-md p-2 border-gray-200 shadow-md shadow-olive-400"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Size</label>

          <select
            className="w-full border rounded-md p-2  border-gray-200 shadow-md shadow-olive-400"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Price
          </label>

          <input
            type="number"
            className="w-full border rounded-md p-2 border-gray-200 shadow-md shadow-olive-400"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Color
          </label>

          <input
            className="w-full border rounded-md p-2  border-gray-200 shadow-md shadow-olive-400"
            value={color}
            onChange={(e) => setColor(e.target.value)}
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
                ? "Update Variant"
                : "Add Variant"}
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
