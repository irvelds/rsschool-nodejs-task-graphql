import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { IContext, IProfile } from '../types/types.js';
import { UserType } from '../user/userQuery.js';
import { MemberType} from '../memberType/memberQuery.js';


export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'This is a Profile data in this project',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve: async (parent: IProfile, _args: {}, { ctx }: IContext) => {
        const { userId } = parent;
        return ctx.user.findFirst({ where: { id: userId } });
      },
    },
    memberType: {
      type: MemberType,
      resolve: async (parent: IProfile, _args: {}, { ctx }: IContext) => {
        const { memberTypeId } = parent;
        return ctx.memberType.findFirst({ where: { id: memberTypeId } });
      },
    },
  }),
});


export const ProfileQueries = {
  profile: {
    type: ProfileType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_parent: unknown, args: IProfile, { ctx }: IContext) => {
      const { id } = args;
      const profile = await ctx.profile.findFirst({ where: { id } });
      return profile;
    },
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: async (_parent: unknown, _args: {}, { ctx }: IContext) => {
      const profiles = await ctx.profile.findMany();
      return profiles;
    },
  },
};
