import { Type } from '@fastify/type-provider-typebox';

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { MemberTypeQueries } from './memberType/memberQuery.js';
import { PostQueries } from './post/postQuery.js';
import { UserQueries } from './user/userQuery.js';
import { ProfileQueries } from './profile/profileQuery.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'This is a Query in this project',
    fields: () => ({
      ...UserQueries,
      ...ProfileQueries,
      ...PostQueries,
      ...MemberTypeQueries,
    }),
  })
});
