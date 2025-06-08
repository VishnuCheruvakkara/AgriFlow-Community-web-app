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
    },

    markAsRead: (state, action) => {
      const notifId = action.payload;
      const notif = state.notifications.find(n => n.id === notifId);
      if (notif) {
        notif.is_read = true;
      }
    },
    deleteNotificationFromRedux: (state, action) => {
      const idToDelete = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== idToDelete);
    }
  }
});

export const { addGeneralNotification, clearGeneralNotifications, markAsRead,deleteNotificationFromRedux } = generalNotificationSlice.actions;
export default generalNotificationSlice.reducer;
