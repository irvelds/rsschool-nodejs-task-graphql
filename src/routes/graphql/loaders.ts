import { Post, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IMemberType, IPost, IProfile, IUser } from './types/types.js';



export const memberLoader = (ctx: PrismaClient) => {

    return new DataLoader<string, IMemberType>(async (ids: readonly string[]) => {
        const loader = await ctx.memberType.findMany({
            where: {
                profiles: {
                    some: {
                        memberTypeId: {
                            in: [...ids]
                        }
                    }
                }
            },
        });
        return loader;
    });

};

export const profileLoader = (ctx: PrismaClient) => {

    return new DataLoader<string, IProfile>(async (ids: readonly string[]) => {

        const profiles = await ctx.profile.findMany({
            where: { userId: { in: [...ids] } },
        });


        /*Затем проверяем правильный порядок */
        const profilesMap = new Map<string, IProfile>();
        profiles.forEach(profile => {
            profilesMap[profile.userId] = profile;
        })
        return ids.map(id => profilesMap[id] ?? null);

    });


};


export const postLoader = (ctx: PrismaClient) => {
    return new DataLoader<string, IPost[] | undefined>(async (ids: readonly string[]) => {

        const innerPosts = await ctx.post.findMany({
            where: { authorId: { in: [...ids] } },
        });


        const postsMap = new Map<string, Post[]>();

        innerPosts.forEach((post) => {
            const posts = postsMap.get(post.authorId) ?? [];
            posts.push(post);
            postsMap.set(post.authorId, posts);
        })

        return ids.map((id) => postsMap.get(id));

    })
};



export const subToUserLoader = (ctx: PrismaClient) => {
    return new DataLoader<string, IUser[]>(async (ids: readonly string[]) => {
        const users = await ctx.user.findMany({
            where: {
                userSubscribedTo: {
                    some: {
                        authorId: { in: [...ids] },
                    },
                },
            },
            include: {
                userSubscribedTo: true
            }
        });


        const sortedInIdsOrder = ids.map(id => {
            return users.filter(user =>
                user.userSubscribedTo.find(us => us.authorId === id))
        });
        return sortedInIdsOrder
    });

};


export const userSubToLoader = (ctx: PrismaClient) => {
    return new DataLoader<string, IUser[]>(async (ids: readonly string[]) => {


        const users = await ctx.user.findMany({
            where: {
                subscribedToUser: {
                    some: {
                        subscriberId: { in: [...ids] },
                    },
                },
            },
            include: {
                subscribedToUser: true
            }
        });


        const sortedInIdsOrder = ids.map(id => {
            return users.filter(user =>
                user.subscribedToUser.find(sub => sub.subscriberId === id))

        });
        return sortedInIdsOrder

    });


};
