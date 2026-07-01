import Link from "next/link";

function ProductRow({ order }) {
  return (
    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-2 border-gray-100 shadow-md">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-heading whitespace-nowrap border-2 border-gray-100"
      >
        {order.id}
      </th>
      <td className="px-6 py-4 border-2 border-gray-100">{order.userId}</td>
      <td className="px-6 py-4 border-2 border-gray-100">
        {order.totalAmount}
      </td>
      <td className="px-6 py-4 border-2 border-gray-100">{order.status}</td>
      <td className="px-6 py-4 border-2 border-gray-100">
        {order.items.length}
      </td>
      <td className="px-6 py-4 border-2 border-gray-100">
        <Link
          href={`orders/${order.id}`}
          className="font-medium text-fg-brand hover:text-blue-600 active:text-blue-600"
        >
          View Details
        </Link>
      </td>
    </tr>
  );
}

export default ProductRow;
