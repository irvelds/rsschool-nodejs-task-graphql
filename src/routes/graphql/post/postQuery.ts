import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { IContext, IPost } from '../types/types.js';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'This is a Post data in this project',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});


export const PostQueries = {
  post: {
    type: PostType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_parent: unknown, args: IPost, { ctx }: IContext) => {
      const { id } = args;
      const post = await ctx.post.findFirst({ where: { id } });
      return post;
    },
  },

  posts: {
    type: new GraphQLList(PostType),
    resolve: async (_parent: unknown, _args: {}, { ctx }: IContext) => {
      const posts = await ctx.post.findMany();
      return posts;
    },
  },
};
