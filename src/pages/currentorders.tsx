import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';
import { OrderLayout } from '~/components/OrderLayout';
import { useEffect, useState } from 'react';

const CurrentOrders: NextPageWithLayout = () => {
  const { data, refetch, isLoading } = trpc.orders.submitted.useQuery();
  const [orders, setOrders] = useState(data);

  useEffect(() => {
    console.log('useeffect running');
    setOrders(data);
  }, [data]);

  // when order is marked as complete, refresh the page
  function refreshOrders() {
    refetch().then((data) => {
      setOrders(data.data);
    });
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h3 className="font-bold text-2xl text-center py-4 ">Current Drinks</h3>
      {isLoading && <p>Loading...</p>}
      {orders?.map((order) => (
        <div className="border w-1/2 rounded-md" key={order.id}>
          <OrderLayout orderInfo={order} refresh={refreshOrders} />
        </div>
      ))}
    </div>
  );
};

export default CurrentOrders;
