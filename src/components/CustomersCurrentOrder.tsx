import { trpc } from '~/utils/trpc';

const CustomersCurrentOrder = ({
  orderInfo,
}: {
  orderInfo: { id: number; name: string };
}) => {
  const drinks = trpc.drink.byOrderId.useQuery({ orderId: orderInfo.id });
  const utils = trpc.useContext();

  // TODO: Refresh order when new drink is added

  const deleteDrink = trpc.drink.delete.useMutation({
    async onSuccess() {
      await utils.orders.byId.invalidate({ id: orderInfo.id });
    },
  });

  const updateOrder = trpc.orders.decrement.useMutation({
    async onSuccess() {
      await utils.orders.byId.invalidate({ id: orderInfo.id });
    },
  });

  const deleteDrinkById = (id: number, orderId: number) => {
    deleteDrink.mutate({ id });
    updateOrder.mutate({ id: orderId });
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full my-6">
      <h4 className="font-medium">{orderInfo.name}</h4>
      {drinks.data?.map((drink) => (
        <div
          className="flex flex-row w-full text-center gap-2 items-center justify-center"
          key={drink.id}
        >
          <p className="px-2">{drink.size}</p>
          <p className="px-2">{drink.milk}</p>
          <p className="px-2">{drink.type}</p>
          <p className="border rounded-full px-4 py-2">^{drink.toppedUp}</p>
          <p className="border rounded-full px-4 py-2">{drink.sugar}</p>
          <button
            className="border  px-2 rounded-md py-1 border-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => deleteDrinkById(drink.id, drink.orderId)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default CustomersCurrentOrder;
