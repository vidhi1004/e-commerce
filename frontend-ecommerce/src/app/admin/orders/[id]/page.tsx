import OrderDetailComponent from "../../components/OrderDetail";

interface OrderDetail {
  params: {
    id: number;
  };
}

async function OrderDetails({ params }: OrderDetail) {
  const { id } = await params;
  return <OrderDetailComponent id={Number(id)} />;
}

export default OrderDetails;
