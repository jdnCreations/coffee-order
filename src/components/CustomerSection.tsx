import { Order } from '@prisma/client';
import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import CustomersCurrentOrder from './CustomersCurrentOrder';

const CustomerSection = ({ orderId }: { orderId: number }) => {
  const { data, refetch, isLoading } = trpc.orders.byId.useQuery({
    id: orderId,
  });
  const [order, setOrder] = useState(data);
  // const currentOrder = trpc.orders.byId.useQuery({ id: orderId });
  const hasDrink = trpc.orders.hasDrink.useQuery({ id: orderId });

  useEffect(() => {
    console.log('useeffect running');
    setOrder(data);
  }, [data]);

  const utils = trpc.useContext();

  function refreshOrders() {
    console.log('Should be refreshing orders');
    refetch().then((data) => {
      setOrder(data?.data);
    });
  }

  const confirmOrder = trpc.orders.confirm.useMutation({
    async onSuccess() {
      await utils.orders.all.invalidate();
      refreshOrders();
    },
  });

  const confirm = () => {
    confirmOrder.mutate({ id: orderId });
  };

  return (
    <div className="my-8 flex flex-col items-center">
      <h2>Hello {data?.name}</h2>

      {/* show their current order */}
      <h3 className="font-medium text-2xl">Current Order</h3>
      {isLoading && <p>Loading...</p>}
      <div className="mx-2 border w-1/2">
        {hasDrink.data ? (
          <>
            <CustomersCurrentOrder orderInfo={order as Order} />
            <button
              className="rounded-md px-4 py-2 mb-4 border-2 hover:border-gray-800"
              onClick={confirm}
            >
              Confirm Order
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CustomerSection;
