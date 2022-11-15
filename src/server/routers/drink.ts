import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

export const drinksRouter = router({
  all: publicProcedure.query(async () => {
    const items = await prisma.drink.findMany({});
    return items;
  }),
  byOrderId: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const items = await prisma.drink.findMany({
        where: {
          orderId: input.orderId,
        },
      });
      return items;
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const item = await prisma.drink.findUnique({
        where: {
          id: input.id,
        },
      });
      return item;
    }),
  create: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
        type: z.string(),
        size: z.string(),
        milk: z.string(),
        toppedUp: z.string(),
        sugar: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const item = await prisma.drink.create({
        data: {
          orderId: input.orderId,
          type: input.type,
          size: input.size,
          milk: input.milk,
          toppedUp: input.toppedUp,
          sugar: input.sugar,
        },
      });
      await prisma.order.update({
        where: {
          id: input.orderId,
        },
        data: {
          drinksInOrder: {
            increment: 1,
          },
        },
      });

      return item;
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const item = await prisma.drink.delete({
        where: {
          id: input.id,
        },
      });
      return item;
    }),
});
