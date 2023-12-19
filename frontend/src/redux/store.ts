import {configureStore,} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import {rootReducer} from './reducer';
import {PersistConfig} from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist/es/constants';
import {baseApiSlice} from "./rootslices/api/base.slice";
import { authenticationSlice as authenticationSlice } from './rootslices/api/authentication.slice';
import { groupsSlice as groupSlice } from './rootslices/api/groups.slice';

const persistConfig: PersistConfig<any> = {
    key: 'root',
    storage: storage,
    blacklist: ['search', authenticationSlice.reducerPath, groupSlice.reducerPath],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        }
    ).concat(baseApiSlice.middleware)
});

export const persist = persistStore(store);

export default store;

