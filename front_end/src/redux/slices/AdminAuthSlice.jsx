import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    admin: null,
    token: null,
    isAuthenticated: false,
};

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        adminLoginSuccess: (state, action) => {
            state.admin = action.payload.admin;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        adminLogout: (state) => {
            state.admin = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { adminLoginSuccess, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
