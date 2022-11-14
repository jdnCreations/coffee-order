import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

export const ordersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const item = await prisma.order.create({
        data: {
          name: input.name,
        },
      });
      return item;
    }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const item = await prisma.order.findUnique({
        where: {
          id: input.id,
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
      const item = await prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          completed: true,
        },
      });
      return item;
    }),
  confirm: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const item = await prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          submitted: true,
        },
      });
      return item;
    }),
  all: publicProcedure.query(async () => {
    const items = await prisma.order.findMany();
    return items;
  }),
  submitted: publicProcedure.query(async () => {
    const items = await prisma.order.findMany({
      where: {
        submitted: true,
        completed: false,
      },
    });
    return items;
  }),
});
