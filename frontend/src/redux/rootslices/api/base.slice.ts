import {baseAuthenticatedQuery} from "./base-query";
import { createApi } from '@reduxjs/toolkit/query/react';

export const baseApiSlice = createApi({
    reducerPath: 'api-redux',
    baseQuery: baseAuthenticatedQuery,
    endpoints: () => ({}),
});