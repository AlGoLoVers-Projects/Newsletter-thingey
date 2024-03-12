import {baseApiSlice} from "./base.slice";
import {Result} from "../../../types/result";
import {UserData} from "../data/auth-data.slice";

export type ChangeUserName = {
    userName: string
}

export const invitationsSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUserDisplayName: builder.mutation<Result<UserData>, ChangeUserName>({
            query: (userName) => ({
                url: '/api/user/updateUserDisplayName',
                method: 'POST',
                body: userName,
            }),
        }),
        uploadUserDisplayPicture: builder.mutation<Result<UserData>, FormData>({
            query: (formData) => ({
                url: '/api/user/updateDisplayPicture',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {useUpdateUserDisplayNameMutation, useUploadUserDisplayPictureMutation} = invitationsSlice;
