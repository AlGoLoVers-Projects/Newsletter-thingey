import {combineReducers} from "redux";
import authSlice from "./rootslices/auth-data-slice";
import { apiSlice } from './rootslices/authentication.slice';
import searchSlice from "./rootslices/search.slice";

export const rootReducer = combineReducers({
    auth: authSlice,
    search: searchSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
});


//TODO: Use for future API calls
//middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),