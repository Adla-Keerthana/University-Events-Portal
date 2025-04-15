import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const getNotifications = createAsyncThunk(
    'notifications/getNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUnreadCount = createAsyncThunk(
    'notifications/getUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notifications/unread/count');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await api.put(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (notificationId, { rejectWithValue }) => {
        try {
            await api.delete(`/notifications/${notificationId}`);
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Notifications
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch notifications';
            })
            // Get Unread Count
            .addCase(getUnreadCount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUnreadCount.fulfilled, (state, action) => {
                state.loading = false;
                state.unreadCount = action.payload.count;
            })
            .addCase(getUnreadCount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch unread count';
            })
            // Mark as Read
            .addCase(markAsRead.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.notifications.findIndex(
                    notification => notification._id === action.payload._id
                );
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
                if (action.payload.read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to mark notification as read';
            })
            // Delete Notification
            .addCase(deleteNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.loading = false;
                const notification = state.notifications.find(
                    n => n._id === action.payload
                );
                if (notification && !notification.read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.notifications = state.notifications.filter(
                    n => n._id !== action.payload
                );
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete notification';
            });
    }
});

export const { clearError, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 