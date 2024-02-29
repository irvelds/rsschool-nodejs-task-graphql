import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { PostType } from "./postQuery.js";
import { UUIDType } from "../types/uuid.js";
import { IContext, IPostInputType } from "../types/types.js";

const CreatePostInputType = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: () => ({
        /*Id generate in server*/
        //id: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
    }),
});

const ChangePostInputType = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: () => ({
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType },
    }),
});

export const PostMutations = {
    createPost: {
        type: PostType,
        args: { dto: { type: new GraphQLNonNull(CreatePostInputType) } },
        resolve: async (_parent: unknown, args: IPostInputType, { ctx }: IContext) => {
            const { dto } = args;
            return await ctx.post.create({ data: dto })
        }
    },

    deletePost: {
        type: new GraphQLNonNull(GraphQLString),
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_parent: unknown, args: IPostInputType, { ctx }: IContext) => {
            const { id } = args;
            await ctx.post.delete({ where: { id } });
            return id;
        },
    },

    changePost: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: ChangePostInputType } },
        resolve: async (_parent: unknown, args: IPostInputType, { ctx }: IContext) => {
            const { id, dto } = args;
            return await ctx.post.update({ where: { id }, data: dto })
        }
    },


};
