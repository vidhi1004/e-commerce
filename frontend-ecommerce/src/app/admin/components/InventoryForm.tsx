"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";

interface Variant {
  id: number;
  sku: string;
  size: string;
  color: string;
}

interface Inventory {
  id: number;
  stock: number;
  reservedStock: number;
  productVariantId: number;
}

interface InventoryFormProps {
  variants: Variant[];
  inventory?: Inventory;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function InventoryForm({
  variants,
  inventory,
  onSuccess,
  onCancel,
}: InventoryFormProps) {
  const isEdit = !!inventory;

  const [productVariantId, setProductVariantId] = useState(0);
  const [stock, setStock] = useState(0);
  const [reservedStock, setReservedStock] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inventory) {
      setProductVariantId(inventory.productVariantId);
      setStock(inventory.stock);
      setReservedStock(inventory.reservedStock);
    }
  }, [inventory]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        isEdit
          ? `${API_BASE_URL}/catalog/inventories/${inventory!.id}`
          : `${API_BASE_URL}/catalog/inventories`,
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
                  stock,
                  reservedStock,
                }
              : {
                  productVariantId,
                  stock,
                },
          ),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEdit
            ? "Inventory Updated Successfully"
            : "Inventory Added Successfully",
        );

        if (!isEdit) {
          setProductVariantId(0);
          setStock(0);
        }

        onSuccess?.();
      } else {
        toast.error(data.message);
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
        {isEdit ? "Update Inventory" : "Add Inventory"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Product Variant
            </label>

            <select
              className="w-full border rounded-md p-2  border-gray-200 shadow-md shadow-olive-400"
              value={productVariantId}
              onChange={(e) => setProductVariantId(Number(e.target.value))}
            >
              <option value={0}>Select Variant</option>

              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.sku} ({variant.size} - {variant.color})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Stock
          </label>

          <input
            type="number"
            className="w-full border rounded-md p-2 border-gray-200 shadow-md shadow-olive-400"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>

        {isEdit && (
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Reserved Stock
            </label>

            <input
              disabled
              className="w-full border rounded-md p-2  border-gray-200 shadow-md shadow-olive-400 bg-gray-100"
              value={reservedStock}
            />
          </div>
        )}
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
                ? "Update Inventory"
                : "Add Inventory"}
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
