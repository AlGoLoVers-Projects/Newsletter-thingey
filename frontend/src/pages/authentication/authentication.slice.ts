import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {Result} from "../../types/result";
import {AuthData} from "../../redux/rootslices/auth-data-slice";

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
    }),
});

export const { useSignInMutation, useSignUpMutation, useVerifyMutation } = apiSlice;
export const { endpoints } = apiSlice;
export const { signIn, signUp, verify } = endpoints;