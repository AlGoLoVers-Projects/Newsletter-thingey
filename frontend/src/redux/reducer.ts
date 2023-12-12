import {combineReducers} from "redux";
import authSlice from "./rootslices/auth-data-slice";
import { apiSlice } from '../pages/authentication/authentication.slice';

export const rootReducer = combineReducers({
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
});


//TODO: Use for future API calls
//middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),