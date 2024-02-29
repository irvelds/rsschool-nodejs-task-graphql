import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UserType } from './userQuery.js';
import { IContext, IUserInputType, IUserSubType } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';



const CreateUserInputType = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) }
    }),
});

const ChangeUserInputType = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: () => ({
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat }
    }),
});


export const UserMutations = {
    createUser: {
        type: UserType,
        args: { dto: { type: new GraphQLNonNull(CreateUserInputType) } },
        resolve: async (_parent: unknown, args: IUserInputType, { ctx }: IContext) => {
            const { dto } = args;
            return await ctx.user.create({ data: dto })
        }
    },

    deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_parent: unknown, args: IUserInputType, { ctx }: IContext) => {
            const { id } = args;
            await ctx.user.delete({ where: { id } });
            return id;
        },
    },

    changeUser: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
            dto: { type: ChangeUserInputType }
        },
        resolve: async (_parent: unknown, args: IUserInputType, { ctx }: IContext) => {
            const { id, dto } = args;
            return await ctx.user.update({ where: { id }, data: dto })
        }
    },

    subscribeTo: {
        type: UserType,
        args: {
            userId: { type: new GraphQLNonNull(UUIDType) },
            authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent: unknown, args: IUserSubType, { ctx }: IContext) => {
            const { userId , authorId } = args;
            return await ctx.user.update({
                where: { id: userId },
                data: { userSubscribedTo: { create: { authorId } } },

                // return prisma.user.update({
                //     where: {
                //       id: req.params.userId,
                //     },
                //     data: {
                //       userSubscribedTo: {
                //         create: {
                //           authorId: req.body.authorId,
                //         },
                //       },
                //     },
                //   });
            });
        },
    },

    unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
            userId: { type: new GraphQLNonNull(UUIDType) },
            authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_parent: unknown, args: IUserSubType, { ctx }: IContext) => {
            const { userId, authorId } = args;
            await ctx.subscribersOnAuthors.delete({
                where: {
                    subscriberId_authorId: {
                        subscriberId: userId,
                        authorId: authorId,
                    },
                },
                // await prisma.subscribersOnAuthors.delete({
                //     where: {
                //       subscriberId_authorId: {
                //         subscriberId: req.params.userId,
                //         authorId: req.params.authorId,
                //       },
                //     },
                //   });
            });
            return userId;
        },
    },
};
