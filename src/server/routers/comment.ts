/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  name: true,
  text: true,
  createdAt: true,
  updatedAt: true,
});

export const commentRouter = router({
  byPostId: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { postId } = input;
      const comments = await prisma.comment.findMany({
        select: defaultCommentSelect,
        where: {
          postId,
        },
      });
      return comments;
    }),
  create: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        text: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const comment = await prisma.comment.create({
        data: input,
        select: defaultCommentSelect,
      });
      return comment;
    }),
});
