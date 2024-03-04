
import { GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLInputObjectType, } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from './profileQuery.js';
import { IContext, IProfileInputType } from '../types/types.js';
import { MemberTypeEnumIdType } from '../memberType/memberQuery.js';


const CreateProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: () => ({
        // id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeEnumIdType) }
    }),
});

const ChangeProfileInputType = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: () => ({
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        // userId: { type: UUIDType },
        memberTypeId: { type: MemberTypeEnumIdType }
    }),
});

export const ProfileMutations = {
    createProfile: {
        type: ProfileType,
        args: { dto: { type: new GraphQLNonNull(CreateProfileInputType) } },
        resolve: async (_parent: unknown, args: IProfileInputType, { ctx }: IContext) => {
            const { dto } = args;
            return await ctx.profile.create({ data: dto })
        }

    },


    deleteProfile: {
        type: new GraphQLNonNull(GraphQLString),
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_parent: unknown, args: IProfileInputType, { ctx }: IContext) => {
            const { id } = args;
            await ctx.profile.delete({ where: { id } });
            return id;
        },
    },


    changeProfile: {
        type: ProfileType,
        args: {
            id: { type: new GraphQLNonNull(UUIDType) },
            dto: { type: ChangeProfileInputType }
        },
        resolve: async (_parent: unknown, args: IProfileInputType, { ctx }: IContext) => {
            const { id, dto } = args;
            return await ctx.profile.update({ where: { id }, data: dto })
        }
    },

};
