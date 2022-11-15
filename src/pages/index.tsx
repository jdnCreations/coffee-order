import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { OrderLayout } from '~/components/OrderLayout';
import { Order } from '@prisma/client';
import CustomerSection from '~/components/CustomerSection';

enum DrinkType {
  flatwhite = 'flatwhite',
  latte = 'latte',
  espresso = 'espresso',
  dblespresso = 'dblespresso',
  longmac = 'longmac',
  shortmac = 'shortmac',
  cappuccino = 'cappuccino',
  longblack = 'longblack',
}

enum Size {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

enum ToppedUp {
  full = 'full',
  half = '1/2',
  quarter = '1/4',
  threeQuarter = '3/4',
}

enum Milk {
  none = 'none',
  skim = 'skim',
  oat = 'oat',
  soy = 'soy',
  almond = 'almond',
  whole = 'whole',
}

interface IFormInput {
  name: string;
  drinkType: DrinkType;
  size: Size;
  milk: Milk;
  toppedUp: ToppedUp;
  sugar: string;
}

const IndexPage: NextPageWithLayout = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const utils = trpc.useContext();

  const [orderId, setOrderId] = useState<number>(-1);

  const currentOrder = trpc.orders.byId.useQuery({ id: orderId });

  const [orderersName, setOrderersName] = useState<string>();

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => setOrderId(data.id),
  });

  const addDrink = trpc.drink.create.useMutation({
    async onSuccess() {
      await utils.drink.all.invalidate();
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (!orderId) return console.log('NO ORDER ID');

    addDrink.mutate({
      orderId: orderId as number,
      type: data.drinkType,
      size: data.size,
      milk: data.milk,
      toppedUp: data.toppedUp,
      sugar: data.sugar,
    });
  };

  const customerName: SubmitHandler<IFormInput> = (data) => {
    setOrderersName(data.name);
    createOrder.mutate({ name: data.name });
  };

  return (
    <div className="text-center w-full align-center">
      <h1 className="font-bold text-3xl my-8">COFFEE</h1>
      <hr className="my-4" />

      {orderId === -1 ? null : <CustomerSection orderId={orderId} />}

      {orderId == -1 && (
        <>
          <h3 className="font-medium text-2xl my-2 pb-2">Create an Order</h3>
          <form
            className="flex flex-row items-center justify-center gap-2"
            onSubmit={handleSubmit(customerName)}
          >
            <label htmlFor="name">Name</label>
            <input
              className="py-2 px-2 border-2 rounded-md hover:border-gray-800"
              {...register('name')}
              type="text"
            />
            <button
              className="border-2 border-dark-gray-800 bg-white rounded-md px-4 py-2 hover:border-green-500"
              type="submit"
            >
              Create Order
            </button>
          </form>
        </>
      )}
      {orderId != -1 && (
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="drinkType">Drink Type</label>
          <select
            className="w-1/4 text-center border-2 hover:border-gray-800 rounded-md"
            {...register('drinkType')}
          >
            <option value={DrinkType.flatwhite}>Flat White</option>
            <option value={DrinkType.latte}>Latte</option>
            <option value={DrinkType.espresso}>Espresso</option>
            <option value={DrinkType.dblespresso}>Double Espresso</option>
            <option value={DrinkType.longmac}>Long Macchiato</option>
            <option value={DrinkType.shortmac}>Short Macchiato</option>
            <option value={DrinkType.cappuccino}>Cappuccino</option>
            <option value={DrinkType.longblack}>Long Black</option>
          </select>
          <label htmlFor="size">Size</label>
          <select
            className="w-1/4 text-center border-2 hover:border-gray-800 rounded-md"
            {...register('size')}
          >
            <option value={Size.small}>Small</option>
            <option value={Size.medium}>Medium</option>
            <option value={Size.large}>Large</option>
          </select>
          <label htmlFor="milk">Milk</label>
          <select
            className="w-1/4 text-center border-2 hover:border-gray-800 rounded-md"
            {...register('milk')}
          >
            <option value={Milk.whole}>Whole</option>
            <option value={Milk.skim}>Skim</option>
            <option value={Milk.oat}>Oat</option>
            <option value={Milk.soy}>Soy</option>
            <option value={Milk.almond}>Almond</option>
            <option value={Milk.none}>None</option>
          </select>
          <label htmlFor="toppedUp">Topped Up</label>
          <select
            className="w-1/4 text-center border-2 hover:border-gray-800 rounded-md"
            {...register('toppedUp')}
          >
            <option value={ToppedUp.full}>Full</option>
            <option value={ToppedUp.threeQuarter}>3/4</option>
            <option value={ToppedUp.half}>1/2</option>
            <option value={ToppedUp.quarter}>1/4</option>
          </select>

          <label htmlFor="sugar">Sugar</label>
          <input
            className="w-1/4 text-center border-2 hover:border-gray-800 rounded-md"
            {...register('sugar')}
            type="number"
          />
          <button
            className="rounded-md border-2 w-1/4 py-2 my-2 bg-white hover:border-green-500"
            type="submit"
          >
            Add to Order
          </button>
        </form>
      )}
    </div>
  );
};

export default IndexPage;
