// import { ProductInterface } from "@/app/interface/product.interface";

// interface ProductCardProps {
//   product: ProductInterface;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   return (
//     <ul key={product.id}>
//       <li>{product.id}</li>
//       <li>{product.name}</li>
//       <li>{product.description}</li>
//       <li>{product.brand}</li>
//       <li>{product.category?.name}</li>
//       <img src={product.images?.[0]?.imageUrl} alt={product.name} width={200} />
//     </ul>
//   );
// }

//new

// import { ProductInterface } from "@/app/user/interface/product.interface";
// import Link from "next/link";
// import Image from "next/image";

// interface ProductCardProps {
//   product: ProductInterface;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   return (
//     <div className="group relative flex flex-row">
//       <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md max-w-sm">
//         <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
//           {product.category?.name && (
//             <span className="absolute top-3 left-3 z-10 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-gray-700 shadow-xs">
//               {product.category.name}
//             </span>
//           )}
//           <Image
//             src={
//               product.images?.[0]?.imageUrl
//                 ? `${product.images[0].imageUrl}?w=700&q=100&auto=format&fit=crop`
//                 : "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&q=100&auto=format&fit=crop"
//             }
//             alt={product.name}
//             fill
//             sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
//             className="object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//         </div>

//         {/* Product Details Content */}
//         <div className="flex flex-1 flex-col p-4">
//           {product.brand && (
//             <span className="text-xs font-semibold tracking-wide uppercase text-blue-600 mb-1">
//               {product.brand}
//             </span>
//           )}

//           <Link
//             href={`products/${product.id}`}
//             className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors"
//           >
//             {product.name}
//           </Link>

//           <p className="mt-1 text-sm text-gray-500 line-clamp-2 flex-1">
//             {product.description}
//           </p>

//           <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
//             <span className="text-xs font-mono text-gray-400">
//               ID: #{product.id}
//             </span>
//             <Link
//               href={`products/${product.id}`}
//               className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
//             >
//               View Details
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { ProductInterface } from "@/app/user/interface/product.interface";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: ProductInterface;
}

export function ProductCard({ product }: ProductCardProps) {
  // Safe computation of display price matching architecture schemas
  const activePrice = product.variants?.[0]?.price ?? "N/A";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Aspect locked image container frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-gray-950">
        {product.category?.name && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
            {product.category.name}
          </span>
        )}
        <Image
          src={
            product.images?.[0]?.imageUrl ||
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80"
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-102"
          priority={false}
        />
      </div>

      {/* Meta specifications details container block */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          {product.brand && (
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              {product.brand}
            </span>
          )}
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            ID: #{product.id}
          </span>
        </div>

        <Link
          href={`/user/products/${product.id}`}
          className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
        >
          {product.name}
        </Link>

        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-1 leading-relaxed">
          {product.description}
        </p>

        {/* Unified pricing context footer bar hook */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              Price
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {typeof activePrice === "number"
                ? `₹${activePrice.toLocaleString("en-IN")}`
                : activePrice}
            </p>
          </div>

          <Link
            href={`/user/products/${product.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/80 px-3.5 py-2 rounded-lg transition-all duration-200"
          >
            Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
