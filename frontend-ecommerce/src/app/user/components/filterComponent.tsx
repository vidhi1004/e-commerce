// "use client";

// import { useEffect, useState } from "react";
// import { ProductInterface } from "../interface/product.interface";
// import { CategoryInterface } from "../interface/category.interface";
// import { ProductCard } from "./product_components/ProductCard";

// interface FilterProps {
//   products: ProductInterface[];
//   categories: CategoryInterface[];
// }

// export default function FilterComponent({ products, categories }: FilterProps) {
//   const [selectedCategory, setSelectedCategory] = useState("ALL");

//   const [searchQuery, setSearchQuery] = useState("");

//   let filterProducts;
//   if (selectedCategory === "ALL") {
//     filterProducts = products;
//   } else {
//     filterProducts = products.filter(
//       (product) => product.category.name === selectedCategory,
//     );
//   }
//   const searchResult = filterProducts.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   return (
//     <div>
//       <div className="flex justify-center">
//         <input
//           className="border-2 border-gray-500 m-4 shadow-4xl shadow-gray-400 rounded-2xl w-100"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         ></input>
//       </div>
//       <div className="flex gap-4 justify-center">
//         <button
//           onClick={() => setSelectedCategory("ALL")}
//           className="border-2 border-gray-500 shawdow-2xl rounded-2xl active: bg-blue-300/10"
//         >
//           All
//         </button>
//         {categories.map((category) => (
//           <button
//             className="border-2 border-gray-500 shawdow-2xl text-center p-4 rounded-2xl "
//             key={category.id}
//             onClick={() => {
//               setSelectedCategory(category.name);
//             }}
//           >
//             {category.name}
//           </button>
//         ))}
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//         {searchResult.map((searchResult) => (
//           <ProductCard product={searchResult}></ProductCard>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { ProductInterface } from "../interface/product.interface";
import { CategoryInterface } from "../interface/category.interface";
import { ProductCard } from "./product_components/ProductCard";

interface FilterProps {
  products: ProductInterface[];
  categories: CategoryInterface[];
}

export default function FilterComponent({
  products = [],
  categories = [],
}: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts =
    selectedCategory === "ALL"
      ? products
      : products.filter((p) => p.category?.name === selectedCategory);

  const searchResult = filteredProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
     
      <div className="relative max-w-xl mx-auto w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.601Z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search products, brands..."
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      
      <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 mask-image-inline scrollbar-none">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all shrink-0 cursor-pointer ${
            selectedCategory === "ALL"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800"
          }`}
        >
          All Collections
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all shrink-0 cursor-pointer ${
              selectedCategory === category.name
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

     
      {searchResult.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 max-w-md mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 mx-auto text-slate-300 mb-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            No items found
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try searching something else
          </p>
        </div>
      ) : (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {searchResult.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
