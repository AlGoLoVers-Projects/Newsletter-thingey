import {Result} from "../../../types/result";
import {baseApiSlice} from "./base.slice";
import {GroupData, GroupRequest, GroupUserRequest} from "./groups.slice";

export type Invitation = {
    id: {
        emailAddress: string,
        group: GroupData
    },
    invitationDate: string | null;
}

export const invitationsSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        inviteUserToGroup: builder.mutation<Result<Invitation>, GroupUserRequest>({
            query: (data) => ({
                url: '/api/group/inviteUserToGroup',
                method: 'POST',
                body: data,
            }),
        }),
        acceptInvitation: builder.mutation<Result<String>, GroupRequest>({
            query: (data) => ({
                url: '/api/group/acceptInvitation',
                method: 'POST',
                body: data
            }),
        }),
        rejectInvitation: builder.mutation<Result<String>, GroupRequest>({
            query: (data) => ({
                url: '/api/group/rejectInvitation',
                method: 'POST',
                body: data
            }),
        }),
        listAllInvitations: builder.mutation<Result<Invitation[]>, null>({
            query: () => ({
                url: '/api/group/listAllInvitations',
                method: 'GET',
            }),
        }),
        listAllInvitationsByGroup: builder.mutation<Result<Invitation[]>, GroupRequest>({
            query: (data) => ({
                url: '/api/group/listAllInvitationsByGroup',
                method: 'POST',
                body: data,
            }),
        }),
        removeInvitationFromGroup: builder.mutation<Result<Invitation>, GroupUserRequest>({
            query: (data) => ({
                url: '/api/group/removeInvitationFromGroup',
                method: 'DELETE',
                body: data,
            }),
        })
    }),
});

export const {
    useInviteUserToGroupMutation,
    useListAllInvitationsByGroupMutation,
    useRemoveInvitationFromGroupMutation,
    useListAllInvitationsMutation,
    useAcceptInvitationMutation,
    useRejectInvitationMutation
} = invitationsSlice;
