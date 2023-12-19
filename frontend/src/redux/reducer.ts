import {combineReducers} from "redux";
import authSlice from "./rootslices/data/auth-data.slice";
import searchSlice from "./rootslices/data/search.slice";
import {baseApiSlice} from "./rootslices/api/base.slice";

export const rootReducer = combineReducers({
    auth: authSlice,
    search: searchSlice,
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
});