import { createSlice } from '@reduxjs/toolkit';

const generalNotificationSlice = createSlice({
  name: "generalNotification",
  initialState: {
    notifications: []
  },
  reducers: {
    addGeneralNotification: (state, action) => {
      const newItems = Array.isArray(action.payload) ? action.payload : [action.payload];

      newItems.forEach(newItem => {
        const index = state.notifications.findIndex(n => n.id === newItem.id);
        if (index !== -1) {
          state.notifications[index] = { ...state.notifications[index], ...newItem };
        } else {
          state.notifications.push(newItem);
        }
      });

      // Keep newest first
      state.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    clearGeneralNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {addGeneralNotification,clearGeneralNotifications} = generalNotificationSlice.actions;
export default generalNotificationSlice.reducer;
