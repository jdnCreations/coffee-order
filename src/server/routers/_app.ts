import { ordersRouter } from './order';
/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { commentRouter } from './comment';
import { drinksRouter } from './drink';
import { postRouter } from './post';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  orders: ordersRouter,
  drink: drinksRouter,
});

export type AppRouter = typeof appRouter;
