import {fetchBaseQuery} from '@reduxjs/toolkit/query'

export const baseAuthenticatedQuery = fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as any).auth.token
        console.log(token)

        if (token) {
            headers.set('Authorization', `${token}`)
        }

        return headers
    },
})