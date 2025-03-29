import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,  // Stores user profile data
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.user = action.payload; // Store fetched user details
        },
        clearUserDetails: (state) => {
            state.user = null; // Clear user details on logout
        },
    },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
