import { GraphQLObjectType, GraphQLEnumType, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from 'graphql';
import { IContext, IMemberType } from '../types/types.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberTypeEnumIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'This is a MemberId data in this project',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});


export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  description: 'This is a Member data in this project',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeEnumIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});



export const MemberTypeQueries = {
  memberType: {
    type: MemberType,
    args: {
      id: { type: new GraphQLNonNull(MemberTypeEnumIdType) },
    },
    resolve: async (_parent: unknown, args: IMemberType, { ctx }: IContext) => {
      const { id } = args;
      const member = await ctx.memberType.findUnique({ where: { id } });
      return member;
    },
  },

  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: async (_parent: unknown, _args: {}, { ctx }: IContext) => {
      const members = await ctx.memberType.findMany();
      return members;
    },
  },
};
