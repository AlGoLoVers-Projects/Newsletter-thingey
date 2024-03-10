import {baseApiSlice} from "./base.slice";
import {Result} from "../../../types/result";
import {UserData} from "../data/auth-data.slice";

export type ChangeUserName = {
    userName: string
}

export type UploadDisplayPicture = {
    file: File
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
        uploadUserDisplayPicture: builder.mutation<Result<string>, UploadDisplayPicture>({
            query: (imageFile) => ({
                url: '/api/user/updateDisplayPicture',
                method: 'POST',
                body: imageFile,
                responseType: 'text',
            }),
        }),
    }),
});

export const {useUpdateUserDisplayNameMutation} = invitationsSlice;
