const url = import.meta.env.VITE_SERVER_URL;
import { setAlert } from "../Reducers/Alert";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setNotifications, appendNotifications, setNextCursor, setLoading, markAsRead, markAllAsRead, removeNotification as removeNotificationAction } from "../Reducers/Notifications";

export const fetchNotifications = createAsyncThunk(
  "fetchNotifications",
  async ({ signal, cursor }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("unauthorized");
    }
    try {
      let query = `${url}/notifications?limit=20`;
      if (cursor) {
        query += `&cursor=${cursor}`;
      }
      const response = await fetch(query, {
        signal,
        method: "get",
        headers: { token },
      });
      const data = await response.json();
      if (data.success) {
        if (cursor) {
          dispatch(appendNotifications(data.notifications));
        } else {
          dispatch(setNotifications(data.notifications));
        }
        dispatch(setNextCursor(data.nextCursor));
        return data;
      } else {
        console.log(data.error);
        return rejectWithValue(data.error);
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnreadCount = async () => {
  const token = localStorage.getItem("token");
  if (!token) return 0;
  try {
    const response = await fetch(`${url}/notifications/unread-count`, {
      method: "get",
      headers: { token },
    });
    const data = await response.json();
    return data.success ? data.count : 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const markNotificationRead = createAsyncThunk(
  "markNotificationRead",
  async ({ notificationId }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("unauthorized");
    try {
      const response = await fetch(`${url}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: { token },
      });
      const data = await response.json();
      if (data.success) {
        dispatch(markAsRead(notificationId));
        return data.notification;
      } else {
        console.error("markNotificationRead failed:", data.error);
        return rejectWithValue(data.error);
      }
    } catch (error) {
      console.error("markNotificationRead error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "markAllNotificationsRead",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("unauthorized");
    try {
      const response = await fetch(`${url}/notifications/read-all`, {
        method: "PATCH",
        headers: { token },
      });
      const data = await response.json();
      if (data.success) {
        dispatch(markAllAsRead());
      } else {
        console.error("markAllNotificationsRead failed:", data.error);
        return rejectWithValue(data.error);
      }
    } catch (error) {
      console.error("markAllNotificationsRead error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// For "×" button - mark as read (not delete)
export const dismissNotification = createAsyncThunk(
  "dismissNotification",
  async ({ notificationId }, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("unauthorized");
    }

    try {
      const response = await fetch(
        `${url}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            token: token,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        dispatch(markAsRead(notificationId));
        return data;
      }

      console.error("dismissNotification failed:", data.error);
      return rejectWithValue(data.error);

    } catch (error) {
      console.error("dismissNotification error:", error);
      return rejectWithValue(error.message);
    }
  }
);