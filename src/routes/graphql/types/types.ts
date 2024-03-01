import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export interface IContext {
    ctx: PrismaClient;
    loaders: IDataLoaders;
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
    userId: string,
    subscriberId: string;
    authorId: string;
}

export interface IUserSub extends IUser {
    userSubscribedTo?: IUserSubType[];
    subscribedToUser?: IUserSubType[];
}


export interface IPostInputType {
    id: string;
    dto: {
        title: string;
        content: string;
        authorId: string;
    };
}

export interface IProfileInputType {
    id: string;
    dto: {
        isMale: boolean;
        yearOfBirth: number;
        memberTypeId: string;
        userId: string;
    };
}

export interface IUserInputType {
    id: string;
    dto: {
        name: string;
        balance: number;
    };
}

type IDataLoader = DataLoader<string, unknown>;

export interface IDataLoaders {
    memberType: IDataLoader;
}

