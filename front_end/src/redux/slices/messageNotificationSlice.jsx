import { createSlice } from '@reduxjs/toolkit';

const messageNotificationSlice = createSlice({
  name: "messageNotification",
  initialState: {
    notifications: []
  },
  reducers: {
    addMessageNotification: (state, action) => {
      const newItems = Array.isArray(action.payload) ? action.payload : [action.payload];

      newItems.forEach(newItem => {
        const index = state.notifications.findIndex(n => n.id === newItem.id);
        if (index !== -1) {
          state.notifications[index] = { ...state.notifications[index], ...newItem };
        } else {
          state.notifications.push(newItem); // Use push, we will sort later
        }
      });

      // Always keep sorted by timestamp descending (newest first)
      state.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    clearMessageNotifications: (state) => {
      state.notifications = [];
    },
     deleteMessageNotification: (state, action) => {
      const idToRemove = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== idToRemove);
    }
  }
});

export const { addMessageNotification, clearMessageNotifications,deleteMessageNotification } = messageNotificationSlice.actions;
export default messageNotificationSlice.reducer;
