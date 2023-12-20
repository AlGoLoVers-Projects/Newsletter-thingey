import {combineReducers} from "redux";
import authSlice from "./rootslices/data/auth-data.slice";
import searchSlice from "./rootslices/data/search.slice";
import groupDataSlice from "./rootslices/data/groups.slice";
import {baseApiSlice} from "./rootslices/api/base.slice";

export const rootReducer = combineReducers({
    auth: authSlice,
    search: searchSlice,
    groupData: groupDataSlice,
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
});