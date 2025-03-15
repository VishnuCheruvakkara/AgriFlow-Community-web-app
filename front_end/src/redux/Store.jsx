
//Store setup in redux with redux tool-kit

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import loaderReducer from './slices/LoaderSpinnerSlice'
//persistor setup 
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: "auth", //Name of the slice stored in localStorage
    storage, //Local storage is used to persist redux state
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,//user data will persisted
        loader:loaderReducer, //loader should not be persisted 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, //Optional: Suppresses warnings
        }),
});

export const persistor = persistStore(store); //Create persistor
export default store;