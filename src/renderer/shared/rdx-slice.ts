import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainState, TMessage, TChannel, TNotification, GoogleUser } from './types';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState: MainState = {
  user_profile: null,
  isLoggedIn: false,
  messages: {},
  channels: [],
  activeUsers: {},
  notifications: [],
  theme: 'system',
  loading: false,
  error: null,
  showAddChannel: false,
  show_join_server: false // Add this property to track join server modal state
};

// Create slice
const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    // User authentication
    setUserProfile: (state, action: PayloadAction<GoogleUser | null>) => {
      state.user_profile = action.payload;
      state.isLoggedIn = !!action.payload;
    },

    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    logout: (state) => {
      state.user_profile = null;
      state.isLoggedIn = false;
    },

    // Messages
    updateMessages: (state, action: PayloadAction<TMessage>) => {
      const message = action.payload;
      const channelId = message.channelId;

      // Initialize channel messages array if it doesn't exist
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }

      // Add ID if not present
      if (!message.id) {
        message.id = uuidv4();
      }

      // Add message to channel
      state.messages[channelId].push(message);

      // Sort messages by date
      state.messages[channelId].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    },

    clearMessages: (state, action: PayloadAction<string>) => {
      const channelId = action.payload;
      state.messages[channelId] = [];
    },

    setAllMessages: (state, action: PayloadAction<Record<string, TMessage[]>>) => {
      state.messages = action.payload;
    },

    // Channels
    setChannels: (state, action: PayloadAction<TChannel[]>) => {
      state.channels = action.payload;
    },

    addChannel: (state, action: PayloadAction<TChannel>) => {
      state.channels.push(action.payload);
    },

    updateChannel: (state, action: PayloadAction<TChannel>) => {
      const index = state.channels.findIndex(channel => channel.id === action.payload.id);
      if (index !== -1) {
        state.channels[index] = action.payload;
      }
    },

    removeChannel: (state, action: PayloadAction<string>) => {
      state.channels = state.channels.filter(channel => channel.id !== action.payload);
      delete state.messages[action.payload];
      delete state.activeUsers[action.payload];
    },

    // Add Channel Modal State
    setShowAddChannel: (state, action: PayloadAction<boolean>) => {
      state.showAddChannel = action.payload;
    },

    // Join Server Modal State
    setShowJoinServer: (state, action: PayloadAction<boolean>) => {
      state.show_join_server = action.payload;
    },

    // Active users in channels
    setChannelUsers: (state, action: PayloadAction<{ channelId: string; users: GoogleUser[] }>) => {
      const { channelId, users } = action.payload;
      state.activeUsers[channelId] = users;
    },

    addChannelUser: (state, action: PayloadAction<{ channelId: string; user: GoogleUser }>) => {
      const { channelId, user } = action.payload;

      if (!state.activeUsers[channelId]) {
        state.activeUsers[channelId] = [];
      }

      // Check if user already exists
      const exists = state.activeUsers[channelId].some(u => u.id === user.id);
      if (!exists) {
        state.activeUsers[channelId].push(user);
      }
    },

    removeChannelUser: (state, action: PayloadAction<{ channelId: string; userId: string }>) => {
      const { channelId, userId } = action.payload;

      if (state.activeUsers[channelId]) {
        state.activeUsers[channelId] = state.activeUsers[channelId].filter(u => u.id !== userId);
      }
    },

    // Notifications
    addNotification: (state, action: PayloadAction<TNotification>) => {
      const notification = {
        ...action.payload,
        id: action.payload.id || uuidv4(),
        read: false,
        duration: action.payload.duration || 5000
      };

      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    markNotificationRead: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        state.notifications[index].read = true;
      }
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// Export actions
export const {
  setUserProfile,
  setLoggedIn,
  logout,
  updateMessages,
  clearMessages,
  setAllMessages,
  setChannels,
  addChannel,
  updateChannel,
  removeChannel,
  setShowAddChannel,
  setShowJoinServer, // Export the new action
  setChannelUsers,
  addChannelUser,
  removeChannelUser,
  addNotification,
  removeNotification,
  markNotificationRead,
  clearAllNotifications,
  setTheme,
  setLoading,
  setError
} = mainSlice.actions;

// Export reducer
export default mainSlice.reducer;
