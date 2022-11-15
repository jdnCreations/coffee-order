import { Order } from '@prisma/client';
import { trpc } from '~/utils/trpc';
import CustomersCurrentOrder from './CustomersCurrentOrder';

const CustomerSection = ({ orderId }: { orderId: number }) => {
  const currentOrder = trpc.orders.byId.useQuery({ id: orderId });
  const hasDrink = trpc.orders.hasDrink.useQuery({ id: orderId });

  const utils = trpc.useContext();

  const confirmOrder = trpc.orders.confirm.useMutation({
    async onSuccess() {
      await utils.orders.all.invalidate();
      // re render the page
      window.location.reload();
    },
  });

  const confirm = () => {
    confirmOrder.mutate({ id: orderId });
  };

  return (
    <div className="my-8 flex flex-col items-center">
      <h2>Hello {currentOrder.data?.name}</h2>

      {/* show their current order */}
      <h3 className="font-medium text-2xl">Current Order</h3>
      <div className="mx-2 border w-1/2">
        {hasDrink.data ? (
          <>
            <CustomersCurrentOrder orderInfo={currentOrder.data as Order} />
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
