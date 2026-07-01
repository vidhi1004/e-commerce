import ProductRow from "./ProductRow";

function ProductTable({ products }) {
  return (
    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xl rounded-base border-2 border-gray-200">
      <table className="w-full text-sm text-left rtl:text-right text-body">
        <thead className="bg-gray-100 border-2 border-gray-100 shadow-md ">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium">
              Image
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Product name
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Brand
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Category
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Price
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((products) => (
            <ProductRow key={products.id} product={products} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
