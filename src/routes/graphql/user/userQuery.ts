
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { IContext, IUser } from '../types/types.js';
import { PostType } from '../post/postQuery.js';
import { ProfileType } from '../profile/profileQuery.js';
export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This is a User data in this project',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: async (parent: IUser, _args: {}, { profileLoader }: IContext) => {
        const { id } = parent;
        return await profileLoader.load(id)
      }

    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent: IUser, _args: {}, { postLoader }: IContext) => {
        const { id } = parent;
        return await postLoader.load(id)
      }
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent: IUser, _args: {}, { userSubToLoader }: IContext) => {
        const { id } = parent;
        return await userSubToLoader.load(id)
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent: IUser, _args: {}, { subToUserLoader }: IContext) => {
        const { id } = parent;
        return await subToUserLoader.load(id)
      },
    },

  }),
});


export const UserQueries = {
  user: {
    type: UserType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_parent: unknown, args: IUser, { ctx }: IContext) => {
      const { id } = args;
      const user = ctx.user.findFirst({ where: { id } });
      return user;
    }
  },

  users: {
    type: new GraphQLList(UserType),
    resolve: async (_parent: unknown, _args: {}, { ctx }: IContext) => {
      const users = await ctx.user.findMany();
      return users;
    },
  },

};

