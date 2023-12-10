import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {Result} from "../../types/result";

type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    displayName: string;
    authorities: string[];
    token: string;
};

export type SignupRequest = {
    userName: string;
    email: string;
    password: string;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery(),
    endpoints: (builder) => ({
        signIn: builder.mutation<Result<LoginResponse>, LoginRequest>({
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
    }),
});

export const { useSignInMutation, useSignUpMutation } = apiSlice;
export const { endpoints } = apiSlice;
export const { signIn, signUp } = endpoints;