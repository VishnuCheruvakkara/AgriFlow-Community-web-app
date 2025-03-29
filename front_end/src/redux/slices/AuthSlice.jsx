
// Slice for store the registerd / login users data

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            if (action.payload.profile_completed !== undefined) {
                state.user = {
                    ...state.user,  // Keep existing user data
                    profile_completed: action.payload.profile_completed  // Update only profile_completed
                };
            } else {
                state.user = action.payload.user || state.user;
                state.token = action.payload.token || state.token;
                state.isAuthenticated = true;
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },

})

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer 
