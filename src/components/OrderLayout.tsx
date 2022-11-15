import { Order } from '@prisma/client';
import Head from 'next/head';
import { trpc } from '~/utils/trpc';

export interface OrderProps {
  orderInfo: Order;
}

export const OrderLayout = ({ orderInfo }: OrderProps) => {
  const utils = trpc.useContext();
  const drinks = trpc.drink.byOrderId.useQuery({ orderId: orderInfo.id });

  const markOrderAsDone = trpc.orders.markAsComplete.useMutation({
    async onSuccess() {
      await utils.orders.all.invalidate();
    },
  });

  function markAsDone(id: number) {
    markOrderAsDone.mutate({ id });
  }

  return (
    <div className="w-full h-full">
      <Head>
        <title>Current Orders</title>
      </Head>

      <div className="flex flex-col w-full h-full">
        <h4 className="font-medium text-center py-1">{orderInfo.name}</h4>
        {drinks.data?.map((drink) => (
          <>
            <div
              className="flex flex-row items-center justify-center w-full"
              key={drink.id}
            >
              <p>{drink.size}</p>
              <p>{drink.milk}</p>
              <p className="">{drink.type}</p>
              <p className="border rounded-full px-4 py-2">{drink.sugar}</p>
            </div>
            <button
              className="border-2 border-green-500 text-black hover:text-white hover:bg-green-400"
              onClick={() => markAsDone(orderInfo.id)}
            >
              COMPLETE
            </button>
          </>
        ))}
      </div>
    </div>
  );
};
