import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import {rootReducer} from "./reducer";
import {PersistConfig} from "redux-persist/es/types";
import storage from "redux-persist/lib/storage";

const persistConfig: PersistConfig<any> = {
    key: 'root',
    storage: storage,
    blacklist: [],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {
            serializableCheck: false,
        }
    ),
});

export const persist = persistStore(store);

export default store;

