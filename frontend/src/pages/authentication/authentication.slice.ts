import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {Result} from "../../types/result";
import {AuthData, UserData} from "../../redux/rootslices/auth-data-slice";

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

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery(),
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
    }),
});

//TODO: Change to query if needed

export const { useSignInMutation, useSignUpMutation, useVerifyMutation, useValidateTokenMutation, useForgotPasswordMutation, useResetPasswordMutation  } = apiSlice;
