"use client";

import { CategoryInterface } from "@/app/user/interface/category.interface";

interface CategoryRowProps {
  category: CategoryInterface;
  onEdit: (category: CategoryInterface) => void;
}

function CategoryRow({ category, onEdit }: CategoryRowProps) {
  return (
    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border border-gray-300 shadow-md">
      <td className="px-6 py-4">{category.id}</td>

      <td className="px-6 py-4">{category.name}</td>

      <td className="px-6 py-4">{category.description}</td>

      <td className="px-6 py-4">
        <button
          onClick={() => onEdit(category)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}

export default CategoryRow;
