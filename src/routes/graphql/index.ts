import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { loaders } from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const errorDepthLimit = validate(schema, parse(req.body.query), [depthLimit(5)]);

      if (errorDepthLimit.length > 0) {
        return { errors: errorDepthLimit };
      }

      const { data, errors } = await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          ctx: fastify.prisma,
          loaders: loaders(fastify.prisma),
        },
      });
      return { data, errors };

    },
  });
};
export default plugin;
