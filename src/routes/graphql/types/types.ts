import { PrismaClient } from '@prisma/client';

export interface IContext {
    ctx: PrismaClient;
}

export type IMemberType = {
    id: string;
    discount: number;
    postsLimitPerMonth: number;
}

export type IPost = {
    id: string;
    title: string;
    content: string;
    authorId: string;
}

export type IProfile = {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: string;
}

export type IUser = {
    id: string;
    name: string;
    balance: number;
    // profile?: IProfile;
    // posts?: IPost[];
    // userSubscribedTo?: {
    //     subscriberId: string;
    //     authorId: string;
    // }[];
    // subscribedToUser?: {
    //     subscriberId: string;
    //     authorId: string;
    // }[];
};


export interface IUserSubType {
    subscriberId: string;
    authorId: string;
}

export interface IUserSub extends IUser {
    userSubscribedTo?: IUserSubType[];
    subscribedToUser?: IUserSubType[];
}