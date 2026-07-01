"use client";

import { useState } from "react";
import { CategoryInterface } from "@/app/user/interface/category.interface";
import CategoryForm from "./CategoryForm";
import CategoryRow from "./CategoryRow";

interface CategoryTableProps {
  categories: CategoryInterface[];
  onSuccess: () => void;
}

function CategoryTable({ categories, onSuccess }: CategoryTableProps) {
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<CategoryInterface>();

  return (
    <div className="relative overflow-x-auto rounded-lg border-2 border-gray-200 shadow-xl p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-500">
          Categories
        </h1>

        {!showCategoryForm && !selectedCategory && (
          <button
            onClick={() => setShowCategoryForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            + Add Category
          </button>
        )}
      </div>

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 border border-gray-300 shadow-md">
          <tr>
            <th className="px-6 py-3 ">Id</th>
            <th className="px-6 py-3">Category Name</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={setSelectedCategory}
            />
          ))}
        </tbody>
      </table>

      {selectedCategory ? (
        <CategoryForm
          category={selectedCategory}
          onSuccess={() => {
            setSelectedCategory(undefined);
            onSuccess();
          }}
          onCancel={() => {
            setSelectedCategory(undefined);
            setShowCategoryForm(false);
          }}
        />
      ) : showCategoryForm ? (
        <CategoryForm
          onSuccess={() => {
            setShowCategoryForm(false);
            onSuccess();
          }}
          onCancel={() => {
            setShowCategoryForm(false);
          }}
        />
      ) : null}
    </div>
  );
}

export default CategoryTable;
