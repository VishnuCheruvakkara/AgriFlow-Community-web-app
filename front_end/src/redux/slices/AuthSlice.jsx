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
            // Always update token if provided
            if (action.payload.token) {
                state.token = action.payload.token;
                state.isAuthenticated = true;
            }
        
            // If full user object is passed (e.g., during full login)
            if (action.payload.user) {
                state.user = action.payload.user;
            } else if (state.user) {
                // Otherwise, apply partial updates to existing user
                const updatedUser = { ...state.user };
        
                if (action.payload.profile_completed !== undefined) {
                    updatedUser.profile_completed = action.payload.profile_completed;
                }
        
                if (action.payload.aadhar_verification !== undefined) {
                    updatedUser.aadhar_verification = action.payload.aadhar_verification;
                }
        
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
