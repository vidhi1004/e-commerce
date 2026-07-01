function PaymentRow({ payment }) {
  return (
    <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-2 border-gray-100 shadow-md">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-heading whitespace-nowrap "
      >
        {payment.id}
      </th>
      <td className="px-6 py-4 font-medium text-heading whitespace-nowrap">
        {payment.userId}
      </td>
      <td className="px-6 py-4 font-medium text-heading whitespace-nowrap ">
        {payment.orderId}
      </td>
      <td className="px-6 py-4 font-medium text-heading whitespace-nowrap ">
        {payment.paymentstatus}
      </td>
      <td className="px-6 py-4 font-medium text-heading whitespace-nowrap ">
        {payment.transactionId}
      </td>
      <td className="px-6 py-4 font-medium text-heading whitespace-nowrap ">
        {payment.amount}
      </td>
      <td className="px-6 py-4 font-medium text-heading whitespace-nowrap ">
        {payment.paymentMode}
      </td>
    </tr>
  );
}

export default PaymentRow;
