import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';
import { OrderLayout } from '~/components/OrderLayout';

const CurrentOrders: NextPageWithLayout = () => {
  const submittedOrders = trpc.orders.submitted.useQuery();

  return (
    <div>
      <h3 className="font-bold text-2xl">Current Drinks</h3>
      {submittedOrders.data?.map((order) => (
        <div key={order.id}>
          <OrderLayout orderInfo={order} />
        </div>
      ))}
    </div>
  );
};

export default CurrentOrders;
