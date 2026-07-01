import OrderDetailComponent from "@/app/user/components/order_component/OrderDetail";
interface SingleOrderProp {
  params: {
    id: number;
  };
}
async function SingleOrder({ params }: SingleOrderProp) {
  const { id } = await params;

  return (
    <div>
      <OrderDetailComponent id={id}></OrderDetailComponent>
    </div>
  );
}

export default SingleOrder;
