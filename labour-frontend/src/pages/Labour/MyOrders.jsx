import OrderList from "./OrderList";

const MyOrders = () => {
  return (
    <OrderList mode="mine" hideDeliveredDefault={true} showFinishedSummary={true} />
  );
};

export default MyOrders;
