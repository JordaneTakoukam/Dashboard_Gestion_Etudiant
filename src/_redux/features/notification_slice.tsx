// src/_redux/features/notificationSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    data: NotificationType[];
    newNotification: boolean;
    pageIsLoading: boolean;
    pageError: string | null;
    pageIsLoadingOnTable: boolean;
}

const initialState: NotificationState = {
    data: [],
    newNotification: false,
    pageIsLoading: false,
    pageError: null,
    pageIsLoadingOnTable: false,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<NotificationType>) {
            state.data.unshift(action.payload);
            state.newNotification = true;
        },
        markNotificationAsRead(state, action: PayloadAction<string>) {
            const index = state.data.findIndex(notification => notification._id === action.payload);
            if (index !== -1) {
                state.data[index].read = true;
            }
        },
        markAllNotificationsAsRead(state) {
            state.data.forEach(notification => {
                notification.read = true;
            });
            state.newNotification = false;
        },
        setNotifications(state, action: PayloadAction<NotificationType[]>) {
            state.data = action.payload;
        },
        clearNotifications(state) {
            state.data = [];
        },

        setNewNotification(state, action: PayloadAction<boolean>) {
            state.newNotification = action.payload;
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.data = state.data.filter(notification => notification._id !== action.payload);
        },
        removeNotifications(state, action: PayloadAction<(string|undefined)[]>) {
            state.data = state.data.filter(notification => {!action.payload.includes(notification._id)});
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setLoadingOnTable(state, action: PayloadAction<boolean>) {
            state.pageIsLoadingOnTable = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
    },
});

export const {
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setNotifications,
    clearNotifications,
    setNewNotification,
    removeNotification,
    removeNotifications,
    setLoading,
    setLoadingOnTable,
    setError,
} = notificationSlice.actions;

export default notificationSlice.reducer;
