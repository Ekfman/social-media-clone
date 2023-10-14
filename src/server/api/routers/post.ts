import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  infiniteFeed: publicProcedure.input(
    z.object({
      limit: z.number().optional(),
      cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
    })
  ).query(async ({ input: { limit = 10, cursor }, ctx }) => {
    const currentUserId = ctx.session?.user.id

    const data = await ctx.db.post.findMany({
      take: limit + 1,
      cursor: cursor ? { createdAt_id: cursor } : undefined,
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      select: {
        id: true,
        content: true,
        createdAt: true,
        _count: {select: {likes: true}},
        likes: currentUserId == null ? false : { where: {userId: currentUserId}},
        user: {
          select: {name: true, id: true, image: true}
        }
      }
    })

    let nextCursor: typeof cursor | undefined
    if(data.length > limit) {
      const nextItem = data.pop()
      if(nextItem != null){
        nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt}
      }
    }
    return ({posts: data.map( post => {
      return {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        likeCount: post._count.likes,
        user: post.user,
        likedByMe: post.likes?.length > 0,
      }
    }), nextCursor})
  }),
  create: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input: { text }, ctx }) => {
      const post = await ctx.db.post.create({
        data: { content: text, userId: ctx.session.user.id },
      });
      return post;
    }),
});