import { trpc } from '~/utils/trpc';
import { NextPageWithLayout } from './_app';

const CurrentOrders: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const drinksQuery = trpc.drink.all.useQuery();

  const markDrinkAsDone = trpc.drink.markAsComplete.useMutation({
    async onSuccess() {
      await utils.drink.all.invalidate();
    },
  });

  function markAsDone(id: number) {
    console.log(`Marking ${id} as done`);
    markDrinkAsDone.mutate({ id });
  }

  return (
    <div>
      <h3>Current Drinks</h3>
      {drinksQuery.data?.map((drink) => (
        <div key={drink.id}>
          <h4>{drink.name}</h4>
          <p>
            {drink.size} {drink.milk} {drink.type} {drink.sugar} sugar
          </p>
          <button onClick={() => markAsDone(drink.id)}>COMPLETE</button>
        </div>
      ))}
    </div>
  );
};

export default CurrentOrders;
