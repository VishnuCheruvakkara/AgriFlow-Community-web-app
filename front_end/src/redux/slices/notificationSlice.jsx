
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: []
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload)
        },
        clearNotifications: (state) => {
            state.notifications = [];
        }
    }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;