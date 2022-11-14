import { Order } from '@prisma/client';
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
    <div>
      <h4>{orderInfo.name}</h4>
      {drinks.data?.map((drink) => (
        <div key={drink.id}>
          <h5>{drink.type}</h5>
          <h5>{drink.size}</h5>
          <h5>{drink.milk}</h5>
          <h5>{drink.sugar}</h5>
        </div>
      ))}
      <button onClick={() => markAsDone(orderInfo.id)}>COMPLETE</button>
    </div>
  );
};
