import {createApi} from '@reduxjs/toolkit/query/react';
import {Result} from "../../types/result";
import {baseAuthenticatedQuery} from "../base-query";

export type User = {
    displayName: string;
    emailAddress: string;
    profilePicture: string | null;
    authorities: string[];
};

export type GroupMember = {
    user: User;
    hasEditAccess: boolean;
};

export type GroupOwner = User;

export type GroupData = {
    id: string;
    groupName: string;
    groupDescription: string;
    groupOwner: GroupOwner;
    groupMembers: GroupMember[];
    updatedAt: string | null;
};

export type GroupResponse = GroupData[];

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseAuthenticatedQuery,
    endpoints: (builder) => ({
        getGroups: builder.mutation<Result<GroupResponse>, null>({
            query: () => ({
                url: '/api/group/listAllGroups',
                method: 'GET',
            }),
        }),
    }),
});

//TODO: Change to query if needed

export const {useGetGroupsMutation} = apiSlice;
