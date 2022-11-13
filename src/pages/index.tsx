import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import { Fragment } from 'react';
import type { AppRouter } from '~/server/routers/_app';
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

  const addDrink = trpc.drink.create.useMutation({
    async onSuccess() {
      await utils.drink.all.invalidate();
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    // console.log(data);
    console.log(typeof data.sugar);
    addDrink.mutate({
      name: data.name,
      type: data.drinkType,
      size: data.size,
      milk: data.milk,
      sugar: data.sugar,
    });
  };

  return (
    <>
      <h1>COFFEE</h1>

      <hr />

      <h3>Add a Drink</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input {...register('name')} type="text" />
        <label htmlFor="drinkType">Drink Type</label>
        <select {...register('drinkType')}>
          <option value={DrinkType.flatwhite}>Flat White</option>
          <option value={DrinkType.latte}>Latte</option>
          <option value={DrinkType.espresso}>Espresso</option>
          <option value={DrinkType.dblespresso}>Double Espresso</option>
          <option value={DrinkType.longmac}>Long Macchiato</option>
          <option value={DrinkType.shortmac}>Short Macchiato</option>
          <option value={DrinkType.cappuccino}>Cappuccino</option>
        </select>
        <label htmlFor="size">Size</label>
        <select {...register('size')}>
          <option value={Size.small}>Small</option>
          <option value={Size.medium}>Medium</option>
          <option value={Size.large}>Large</option>
        </select>
        <label htmlFor="milk">Milk</label>
        <select {...register('milk')}>
          <option value={Milk.skim}>Skim</option>
          <option value={Milk.oat}>Oat</option>
          <option value={Milk.soy}>Soy</option>
          <option value={Milk.almond}>Almond</option>
          <option value={Milk.whole}>Whole</option>
        </select>
        <label htmlFor="sugar">Sugar</label>
        <input {...register('sugar')} type="number" />
        <button type="submit">Add</button>
      </form>
    </>
  );
};

export default IndexPage;
