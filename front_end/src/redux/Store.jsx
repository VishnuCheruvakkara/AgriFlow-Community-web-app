import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import messageNotificationReducer from "./slices/messageNotificationSlice";
import authReducer from "./slices/AuthSlice";
import adminAuthReducer from "./slices/AdminAuthSlice";
import loaderReducer from "./slices/LoaderSpinnerSlice";
import userReducer from "./slices/userSlice";

// Persist configuration for user authentication
const userPersistConfig = {
    key: "auth", // User auth slice stored in localStorage
    storage,
};

// Persist configuration for admin authentication
const adminPersistConfig = {
    key: "adminAuth", // Admin auth slice stored separately
    storage,
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(userPersistConfig, authReducer);
const persistedAdminAuthReducer = persistReducer(adminPersistConfig, adminAuthReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer, // Persisted user data
        adminAuth: persistedAdminAuthReducer, // Persisted admin data
        loader: loaderReducer, // Loader should NOT be persisted
        user: userReducer,// Stores fetched user details separately with out persist it
        messageNotification: messageNotificationReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Suppress warnings
        }),
});

export const persistor = persistStore(store); // Create persistor
export default store;
