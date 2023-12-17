import {combineReducers} from "redux";
import authSlice from "./rootslices/auth-data.slice";
import { apiSlice as authenticationSlice } from './rootslices/authentication.slice';
import { apiSlice as groupSlice } from './rootslices/groups.slice';
import searchSlice from "./rootslices/search.slice";

export const rootReducer = combineReducers({
    auth: authSlice,
    search: searchSlice,
    [authenticationSlice.reducerPath]: authenticationSlice.reducer,
    [groupSlice.reducerPath]: groupSlice.reducer,
});


//TODO: Use for future API calls
//middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),