import PaymentRow from "./PaymentRow";

function PaymentTable({ payments }) {
  return (
    <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-md rounded-base border-2 border-gray-100">
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
              Order Id
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Payment Status
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Transaction Id
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Paymnet Mode
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
