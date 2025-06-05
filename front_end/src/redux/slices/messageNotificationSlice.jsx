import { createSlice } from '@reduxjs/toolkit';

const messageNotificationSlice = createSlice({
  name: "messageNotification",
  initialState: {
    notifications: []
  },
  reducers: {
    addMessageNotification: (state, action) => {
      const newItems = Array.isArray(action.payload) ? action.payload.slice().reverse() : [action.payload];

      newItems.forEach(newItem => {
        const index = state.notifications.findIndex(n => n.id === newItem.id);
        if (index !== -1) {
          state.notifications[index] = { ...state.notifications[index], ...newItem };
        } else {
          state.notifications.unshift(newItem);
        }
      });
    },
    clearMessageNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { addMessageNotification, clearMessageNotifications } = messageNotificationSlice.actions;
export default messageNotificationSlice.reducer;
