import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  nextCursor: null,
  hasMore: true,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    prependNotifications: (state, action) => {
      state.items = [...action.payload, ...state.items];
      state.unreadCount = state.items.filter((n) => !n.read).length;
    },
    appendNotifications: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    setNextCursor: (state, action) => {
      state.nextCursor = action.payload;
      state.hasMore = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    markAsRead: (state, action) => {
      const notification = state.items.find((n) => n._id === action.payload);
      if (notification) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const index = state.items.findIndex((n) => n._id === action.payload);
      if (index !== -1) {
        const wasUnread = !state.items[index].read;
        state.items.splice(index, 1);
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    addNotification: (state, action) => {
      state.items = [action.payload, ...state.items];
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
  },
});

export const {
  setNotifications,
  prependNotifications,
  appendNotifications,
  setNextCursor,
  setLoading,
  markAsRead,
  markAllAsRead,
  removeNotification,
  addNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;