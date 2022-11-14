import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

export const drinksRouter = router({
  all: publicProcedure.query(async () => {
    const items = await prisma.drink.findMany({
      where: {
        completed: false,
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
        name: z.string(),
        orderId: z.number(),
        type: z.string(),
        size: z.string(),
        milk: z.string(),
        sugar: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const item = await prisma.drink.create({
        data: {
          name: input.name,
          orderId: input.orderId,
          type: input.type,
          size: input.size,
          milk: input.milk,
          sugar: input.sugar,
        },
      });
      return item;
    }),
  markAsComplete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const item = await prisma.drink.update({
        where: {
          id: input.id,
        },
        data: {
          completed: true,
        },
      });
      return item;
    }),
});
