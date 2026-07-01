import OrderRow from "./orderRow";

function OrderTable({ orders }) {
  return (
    <>
      <h2 className="text-4xl font-semibold text-gray-600 text-center mb-4">
        Order
      </h2>

      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-2xl rounded-base border-2 border-gray-200">
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="bg-gray-100 border-2 border-gray-100 shadow-md">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                Id
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                User Id
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                No. Of Items
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OrderTable;
