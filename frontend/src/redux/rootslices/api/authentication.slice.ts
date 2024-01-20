import {Result} from "../../../types/result";
import {AuthData, UserData} from "../data/auth-data.slice";
import {baseApiSlice} from "./base.slice";

export type SignInRequest = {
    email: string;
    password: string;
};

export type SignupRequest = {
    userName: string;
    email: string;
    password: string;
};

export type VerificationRequest = {
    email: string;
    verificationCode: number;
};

export type TokenValidationRequest = {
    token: string
}

export type ForgotPasswordRequest = {
    email: string
}

export type ResetPasswordQueryRequest = {
    id: string
}

export type ResetPasswordRequest = {
    id: string,
    password: string,
    verificationCode: number
}

export type ChangeUserName = {
    userName: string
}

export const authenticationSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<Result<AuthData>, SignInRequest>({
            query: (credentials) => ({
                url: '/api/auth/signin',
                method: 'POST',
                body: credentials,
            }),
        }),
        signUp: builder.mutation<Result<null>, SignupRequest>({
            query: (credentials) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body: credentials,
            }),
        }),
        verify: builder.mutation<Result<null>, VerificationRequest>({
            query: (credentials) => ({
                url: '/api/auth/verify',
                method: 'POST',
                body: credentials,
            }),
        }),
        validateToken: builder.mutation<Result<UserData>, TokenValidationRequest>({
            query: (credentials) => ({
                url: '/api/auth/validateToken',
                method: 'POST',
                body: credentials,
            }),
        }),
        forgotPassword: builder.mutation<Result<null>, ForgotPasswordRequest>({
            query: (credentials) => ({
                url: '/api/auth/forgotPassword',
                method: 'POST',
                body: credentials,
            }),
        }),
        resetPassword: builder.mutation<Result<null>, ResetPasswordRequest>({
            query: (credentials) => ({
                url: '/api/auth/resetPassword',
                method: 'POST',
                body: credentials,
            }),
        }),
        updateUserDisplayName: builder.mutation<Result<UserData>, ChangeUserName>({
            query: (userName) => ({
                url: '/api/user/updateUserDisplayName',
                method: 'POST',
                body: userName,
            }),
        }),
    }),
});

export const {
    useSignInMutation,
    useSignUpMutation,
    useVerifyMutation,
    useValidateTokenMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useUpdateUserDisplayNameMutation
} = authenticationSlice;
