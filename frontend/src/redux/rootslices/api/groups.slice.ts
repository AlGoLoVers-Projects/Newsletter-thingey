import {Result} from "../../../types/result";
import {baseApiSlice} from "./base.slice";
import {UserData} from "../data/auth-data.slice";

export type GroupMember = {
    user: UserData;
    hasEditAccess: boolean;
};

export type GroupOwner = UserData;

export type ResponseData = {
    id: string;
    userEmailAddress: string;
    responseDate: string;
}

export type GroupData = {
    id: string;
    groupName: string;
    groupDescription: string;
    groupOwner: GroupOwner;
    groupMembers: GroupMember[];
    updatedAt: string | null;
    acceptQuestionResponse: boolean;
    questionResponses: ResponseData[];
    newsletterIssueLinks: string[];
    currentIssue: string | null;
    releaseDate: string | null;
};

export type GroupDataRequest = {
    groupName: string,
    groupDescription: string
}

export type GroupRequest = {
    groupId: string
}

export type GroupUserEditAccessRequest = {
    userEmail: string,
    canEdit: boolean
} & GroupRequest

export type GroupUserRequest = {
    userEmail: string
} & GroupRequest;

export type GroupEditRequest = GroupDataRequest & GroupRequest;

export type GroupFormReminderRequest = {
    userEmail: string,
    userName: string
} & GroupRequest

export type GroupListData = GroupData[];

export type GroupForm = {
    groupId: string;
    groupName: string;
    groupDescription: string;
}

export const groupsSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        newGroup: builder.mutation<Result<GroupData>, GroupDataRequest>({
            query: (data) => ({
                url: '/api/group/provisionNewGroup',
                method: 'POST',
                body: data
            }),
        }),
        getGroup: builder.mutation<Result<GroupData>, GroupRequest>({
            query: (data) => ({
                url: '/api/group/getGroup',
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
        leaveGroup: builder.mutation<Result<string>, GroupRequest>({
            query: (data) => ({
                url: '/api/group/leaveGroup',
                method: 'DELETE',
                body: data
            }),
        }),
        deleteGroup: builder.mutation<Result<string>, GroupRequest>({
            query: (data) => ({
                url: '/api/group/deleteGroup',
                method: 'DELETE',
                body: data
            }),
        }),
        releaseQuestions: builder.mutation<Result<GroupData>, GroupRequest>({
            query: (data) => ({
                url: '/api/group/releaseQuestions',
                method: 'POST',
                body: data
            })
        }),
        getFormsForUser: builder.mutation<Result<GroupForm[]>, null>({
            query: () => ({
                url: '/api/group/getFormsForUser',
                method: 'GET'
            })
        }),
        generateNewsletter: builder.mutation<Result<GroupData>, GroupRequest>({
            query: (data) => ({
                url: '/api/group/generateNewsletter',
                method: 'POST',
                body: data
            })
        }),
        remindUserToFillForm: builder.mutation<Result<void>, GroupFormReminderRequest>({
            query: (data) => ({
                url: '/api/group/remindUserToFillForm',
                method: 'POST',
                body: data
            })
        })
    }),
});

export const {
    useGetGroupsMutation,
    useGetGroupMutation,
    useNewGroupMutation,
    useEditGroupMutation,
    useDeleteGroupMutation,
    useLeaveGroupMutation,
    useUpdateEditAccessToUserMutation,
    useRemoveUserMutation,
    useReleaseQuestionsMutation,
    useGetFormsForUserMutation,
    useGenerateNewsletterMutation,
    useRemindUserToFillFormMutation
} = groupsSlice;
