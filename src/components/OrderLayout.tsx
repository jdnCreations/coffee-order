import { Order } from '@prisma/client';
import Head from 'next/head';
import { trpc } from '~/utils/trpc';

interface OrderProps {
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

      <div className="flex flex-col gap-4 w-full h-full">
        <h4 className="font-medium">{orderInfo.name}</h4>
        {drinks.data?.map((drink) => (
          <div
            className="flex flex-row items-center justify-center w-full"
            key={drink.id}
          >
            <p className="">{drink.type}</p>
            <p>{drink.size}</p>
            <p>{drink.milk}</p>
            <p className="border rounded-full px-4 py-2">{drink.sugar}</p>
          </div>
        ))}
        <button
          className="border-2 bg-green-700 text-orange hover:text-red-200"
          onClick={() => markAsDone(orderInfo.id)}
        >
          COMPLETE
        </button>
      </div>
    </div>
  );
};
