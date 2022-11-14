import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const AllOrders: NextPageWithLayout = () => {
  const allOrders = trpc.orders.all.useQuery();

  const confirmedOrders = trpc.orders.submitted.useQuery();

  return (
    <div>
      <h3>All Orders</h3>
      {allOrders.data?.map((order) => (
        <div key={order.id}>
          <h4>{order.name}</h4>
          <p>{order.id}</p>
        </div>
      ))}

      <h3>Confirmed Orders</h3>
      {confirmedOrders.data?.map((order) => (
        <div key={order.id}>
          <h4>{order.name}</h4>
          <p>{order.id}</p>
        </div>
      ))}
    </div>
  );
};

export default AllOrders;
