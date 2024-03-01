import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IDataLoaders, IMemberType } from './types/types.js';

export const loaders = (ctx: PrismaClient): IDataLoaders => {
    return {
        memberType: MemberTypeDataLoader(ctx),
    }
}

const MemberTypeDataLoader = (ctx: PrismaClient) => {

    return new DataLoader<string, IMemberType>(async (keys: readonly string[]) => {
        const loader = await ctx.memberType.findMany({
            where: { id: { in: [...keys] } },
        });
        return loader;
    });


};

