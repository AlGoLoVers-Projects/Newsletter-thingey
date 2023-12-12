import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserData = {
    displayName: string | null;
    authorities: string[] | null;
    profilePicture: string | null;
};

export type AuthData = UserData & {
    token: string | null;
};

const initialState: AuthData = {
    displayName: null,
    authorities: [],
    profilePicture: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<AuthData>) => {
            return { ...state, ...action.payload };
        },
        setUserData: (state, action: PayloadAction<UserData>) => {
            return { ...state, ...action.payload };
        },
        setDisplayName: (state, action: PayloadAction<string | null>) => {
            state.displayName = action.payload;
        },
        setAuthorities: (state, action: PayloadAction<string[] | null>) => {
            state.authorities = action.payload;
        },
        setProfilePicture: (state, action: PayloadAction<string | null>) => {
            state.profilePicture = action.payload;
        },
    },
});

export const {
    setAuthData,
    setUserData,
    setDisplayName,
    setAuthorities,
    setProfilePicture,
} = authSlice.actions;
export default authSlice.reducer;

export const selectAuthState = (state: any): AuthData => state.auth;
export const selectToken = (state: any): string | null => state.auth.token;
export const selectUserData = (state: any): UserData => ({
    displayName: state.auth.displayName,
    authorities: state.auth.authorities,
    profilePicture: state.auth.profilePicture,
});
