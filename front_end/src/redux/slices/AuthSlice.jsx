
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
            // Create a copy of the current user or fallback to {}
            const updatedUser = { ...state.user };
        
            // Conditionally update fields
            if (action.payload.profile_completed !== undefined) {
                updatedUser.profile_completed = action.payload.profile_completed;
            }
        
            if (action.payload.aadhar_verification !== undefined) {
                updatedUser.aadhar_verification = action.payload.aadhar_verification;
            }
        
            // If full user object is passed (e.g., during login), overwrite it
            if (action.payload.user) {
                state.user = action.payload.user;
                state.token = action.payload.token || state.token;
                state.isAuthenticated = true;
            } else {
                // Otherwise, just apply the partial updates
                state.user = updatedUser;
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
