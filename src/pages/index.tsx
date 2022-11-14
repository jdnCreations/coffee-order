import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

enum DrinkType {
  flatwhite = 'flatwhite',
  latte = 'latte',
  espresso = 'espresso',
  dblespresso = 'dblespresso',
  longmac = 'longmac',
  shortmac = 'shortmac',
  cappuccino = 'cappuccino',
}

enum Size {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

enum Milk {
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
  sugar: string;
}

const IndexPage: NextPageWithLayout = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const utils = trpc.useContext();

  const [orderId, setOrderId] = useState<number>(-1);
  // const [orderersName, setOrderersName] = useState<string>();

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => setOrderId(data.id),
  });

  const addDrink = trpc.drink.create.useMutation({
    async onSuccess() {
      await utils.drink.all.invalidate();
    },
  });

  const confirmOrder = trpc.orders.confirm.useMutation({
    async onSuccess() {
      await utils.orders.all.invalidate();
      console.log('order confirmed');
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (!orderId) return console.log('NO ORDER ID');

    addDrink.mutate({
      orderId: orderId as number,
      type: data.drinkType,
      size: data.size,
      milk: data.milk,
      sugar: data.sugar,
    });
  };

  const customerName: SubmitHandler<IFormInput> = (data) => {
    // setOrderersName(data.name);
    createOrder.mutate({ name: data.name });
  };

  const confirm = () => {
    confirmOrder.mutate({ id: orderId });
  };

  return (
    <div className="text-center w-full align-center">
      <h1 className="font-bold text-3xl my-8">COFFEE</h1>

      <hr className="my-4" />

      <h2 className="font-medium text-2xl">Your current order</h2>

      <div className="my-8">order goes here</div>

      <button
        className=" rounded-md px-4 py-2 mb-4 border-2 hover:border-gray-800"
        onClick={confirm}
      >
        Confirm Order
      </button>

      {orderId == -1 && (
        <>
          <h3 className="font-medium text-2xl my-2">Create an Order</h3>
          <form onSubmit={handleSubmit(customerName)}>
            <label htmlFor="name">Name</label>
            <input
              className="py-2 px-2 border-2 rounded-md"
              {...register('name')}
              type="text"
            />
            <button
              className="border-2 border-dark-gray-800 rounded-sm px-4 py-2 hover:border-gray-800"
              type="submit"
            >
              New Order
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
            className="w-1/4 text-center border-2 hover:border-gray-800"
            {...register('drinkType')}
          >
            <option value={DrinkType.flatwhite}>Flat White</option>
            <option value={DrinkType.latte}>Latte</option>
            <option value={DrinkType.espresso}>Espresso</option>
            <option value={DrinkType.dblespresso}>Double Espresso</option>
            <option value={DrinkType.longmac}>Long Macchiato</option>
            <option value={DrinkType.shortmac}>Short Macchiato</option>
            <option value={DrinkType.cappuccino}>Cappuccino</option>
          </select>
          <label htmlFor="size">Size</label>
          <select
            className="w-1/4 text-center border-2 hover:border-gray-800"
            {...register('size')}
          >
            <option value={Size.small}>Small</option>
            <option value={Size.medium}>Medium</option>
            <option value={Size.large}>Large</option>
          </select>
          <label htmlFor="milk">Milk</label>
          <select
            className="w-1/4 text-center border-2 hover:border-gray-800"
            {...register('milk')}
          >
            <option value={Milk.skim}>Skim</option>
            <option value={Milk.oat}>Oat</option>
            <option value={Milk.soy}>Soy</option>
            <option value={Milk.almond}>Almond</option>
            <option value={Milk.whole}>Whole</option>
          </select>
          <label htmlFor="sugar">Sugar</label>
          <input
            className="w-1/4 text-center border-2 hover:border-gray-800"
            {...register('sugar')}
            type="number"
          />
          <button className="rounded-md border-2 w-1/4 py-2 my-2" type="submit">
            Add to Order
          </button>
        </form>
      )}
    </div>
  );
};

export default IndexPage;
