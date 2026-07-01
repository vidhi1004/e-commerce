"use client";

interface ProductVariant {
  id: number;
  sku: string;
  size: string;
  price: number;
  color: string;
}

interface ProductVariantTableProps {
  productVariants: ProductVariant[];
  onEdit: (variant: ProductVariant) => void;
}

export default function ProductVariantTable({
  productVariants,
  onEdit,
}: ProductVariantTableProps) {
  return (
    <div className="relative overflow-x-auto border-2 border-gray-400 shadow-gray-400 rounded-lg p-6 shadow-md">
      <table className="w-full text-sm text-left shadow-xl shadow-olive-400">
        <thead className="bg-gray-200 shadow-md">
          <tr>
            <th className="px-6 py-3">SKU</th>
            <th className="px-6 py-3">Size</th>
            <th className="px-6 py-3">Color</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {productVariants.map((variant) => (
            <tr
              key={variant.id}
              className="border border-gray-200 hover:bg-gray-300"
            >
              <td className="px-6 py-4">{variant.sku}</td>

              <td className="px-6 py-4">{variant.size}</td>

              <td className="px-6 py-4">{variant.color}</td>

              <td className="px-6 py-4">₹{variant.price}</td>

              <td className="px-6 py-4">
                <button
                  onClick={() => onEdit(variant)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
