import {Result} from "../../../types/result";
import {baseApiSlice} from "./base.slice";
import {GroupData, GroupUserRequest} from "./groups.slice";

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
    }),
});

export const {useInviteUserToGroupMutation} = invitationsSlice;
