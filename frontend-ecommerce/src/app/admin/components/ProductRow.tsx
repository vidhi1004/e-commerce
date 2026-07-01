import Link from "next/link";

function ProductRow({ product }) {
  return (
    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border border-gray-200 shadow-md">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-heading whitespace-nowrap"
      >
        {product.images[0]?.imageUrl}
      </th>
      <td className="px-6 py-4">{product.name}</td>
      <td className="px-6 py-4">{product.brand}</td>
      <td className="px-6 py-4">{product.category.name}</td>
      <td className="px-6 py-4">{product.variants?.[0].price}</td>
      <td className="px-6 py-4">
        <Link
          href={`products/${product.id}/edit`}
          className="font-medium text-fg-brand hover:text-blue-500"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
}

export default ProductRow;
