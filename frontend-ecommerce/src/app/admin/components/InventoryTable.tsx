"use client";

interface Inventory {
  id: number;
  stock: number;
  reservedStock: number;
  productVariantId: number;
}

interface Variant {
  id: number;
  sku: string;
  size: string;
  color: string;
  inventory: Inventory;
}

interface InventoryTableProps {
  variants: Variant[];
  onEdit: (inventory: Inventory) => void;
}

function InventoryTable({ variants, onEdit }: InventoryTableProps) {
  return (
    <div className="relative overflow-x-auto border-2 border-gray-400 shadow-gray-400 rounded-lg p-6 shadow-md">
      <table className="w-full text-sm text-left shadow-xl shadow-olive-400">
        <thead className="bg-gray-200 shadow-md">
          <tr>
            <th className="px-6 py-3">SKU</th>
            <th className="px-6 py-3">Size</th>
            <th className="px-6 py-3">Color</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Reserved Stock</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {variants.map((variant) => (
            <tr
              key={variant.id}
              className="border border-gray-200 hover:bg-gray-300"
            >
              <td className="px-6 py-4">{variant.sku}</td>

              <td className="px-6 py-4">{variant.size}</td>

              <td className="px-6 py-4">{variant.color}</td>

              <td className="px-6 py-4">{variant.inventory?.stock ?? "-"}</td>

              <td className="px-6 py-4">
                {variant.inventory?.reservedStock ?? "-"}
              </td>

              <td className="px-6 py-4">
                {variant.inventory ? (
                  <button
                    onClick={() => onEdit(variant.inventory)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                ) : (
                  <span className="text-gray-400">No Inventory</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
