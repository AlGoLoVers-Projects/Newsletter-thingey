import {Result} from "../../../types/result";
import {baseApiSlice} from "./base.slice";
import {UserData} from "../data/auth-data.slice";

export type GroupMember = {
    user: UserData;
    hasEditAccess: boolean;
};

export type GroupOwner = UserData;

export type GroupData = {
    id: string;
    groupName: string;
    groupDescription: string;
    groupOwner: GroupOwner;
    groupMembers: GroupMember[];
    updatedAt: string | null;
};

export type GroupDataRequest = {
    groupName: string,
    groupDescription: string
}

export type GroupIdRequest = {
    groupId: string
}

export type GroupUserEditAccessRequest = {
    userEmail: string,
    canEdit: boolean
} & GroupIdRequest

export type GroupUserRequest = {
    userEmail: string
} & GroupIdRequest;

export type GroupEditRequest = GroupDataRequest & GroupIdRequest;

export type GroupListData = GroupData[];

export const groupsSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        newGroup: builder.mutation<Result<GroupData>, GroupDataRequest>({
            query: (data) => ({
                url: '/api/group/provisionNewGroup',
                method: 'POST',
                body: data
            }),
        }),
        editGroup: builder.mutation<Result<GroupData>, GroupEditRequest>({
            query: (data) => ({
                url: '/api/group/editGroupInformation',
                method: 'PUT',
                body: data
            }),
        }),
        getGroups: builder.mutation<Result<GroupListData>, null>({
            query: () => ({
                url: '/api/group/listAllGroups',
                method: 'GET',
            }),
        }),
        updateEditAccessToUser: builder.mutation<Result<GroupData>, GroupUserEditAccessRequest>({
            query: (data) => ({
                url: '/api/group/updateEditAccessToUser',
                method: 'PUT',
                body: data
            }),
        }),
        removeUser: builder.mutation<Result<GroupData>, GroupUserRequest>({
            query: (data) => ({
                url: '/api/group/removeUser',
                method: 'DELETE',
                body: data
            }),
        }),
        leaveGroup: builder.mutation<Result<string>, GroupIdRequest>({
            query: (data) => ({
                url: '/api/group/leaveGroup',
                method: 'DELETE',
                body: data
            }),
        }),
        deleteGroup: builder.mutation<Result<string>, GroupIdRequest>({
            query: (data) => ({
                url: '/api/group/deleteGroup',
                method: 'DELETE',
                body: data
            }),
        }),
    }),
});

export const {useGetGroupsMutation, useNewGroupMutation, useEditGroupMutation, useDeleteGroupMutation, useLeaveGroupMutation, useUpdateEditAccessToUserMutation, useRemoveUserMutation} = groupsSlice;
