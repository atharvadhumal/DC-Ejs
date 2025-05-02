// src/renderer/shared/server-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types for servers and channels
export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  serverId: string;
  messages: string[]; // Array of message IDs
}

export interface Server {
  id: string;
  name: string;
  icon?: string; // URL or Icon component identifier
  ownerId: string;
  channels: string[]; // Array of channel IDs
  members: string[]; // Array of user IDs
}

export interface DirectMessage {
  id: string;
  participants: string[]; // User IDs
  messages: string[]; // Message IDs
}

interface ServersState {
  servers: Record<string, Server>;
  channels: Record<string, Channel>;
  directMessages: Record<string, DirectMessage>;
  activeServerId: string | null;
  activeChannelId: string | null;
  activeDMId: string | null;
}

const initialState: ServersState = {
  servers: {
    // Default server
    '0': {
      id: '0',
      name: 'Direct Messages',
      ownerId: 'system',
      channels: ['welcome-and-rules', 'notes-resources'],
      members: []
    },
    'test-server': {
      id: 'test-server',
      name: "Atharva's Server",
      ownerId: 'system',
      channels: ['general', 'homework-help'],
      members: []
    }
  },
  channels: {
    'welcome-and-rules': {
      id: 'welcome-and-rules',
      name: 'welcome-and-rules',
      type: 'text',
      serverId: '0',
      messages: []
    },
    'notes-resources': {
      id: 'notes-resources',
      name: 'notes-resources',
      type: 'text',
      serverId: '0',
      messages: []
    },
    'general': {
      id: 'general',
      name: 'general',
      type: 'text',
      serverId: 'test-server',
      messages: []
    },
    'homework-help': {
      id: 'homework-help',
      name: 'homework-help',
      type: 'text',
      serverId: 'test-server',
      messages: []
    },
    'test-dm': {
      id: 'test-dm',
      name: 'Atharva',
      type: 'text',
      serverId: '0',
      messages: []
    }
  },
  directMessages: {
    'test-dm': {
      id: 'test-dm',
      participants: ['currentUser', 'Atharva'],
      messages: []
    }
  },
  activeServerId: null,
  activeChannelId: null,
  activeDMId: null
};

export const serversSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {
    // Set active server and channel
    setActiveServer: (state, action: PayloadAction<string>) => {
      state.activeServerId = action.payload;
    },
    setActiveChannel: (state, action: PayloadAction<string>) => {
      state.activeChannelId = action.payload;
    },
    setActiveDM: (state, action: PayloadAction<string>) => {
      state.activeDMId = action.payload;
    },

    // Add a new server
    addServer: (state, action: PayloadAction<Server>) => {
      const server = action.payload;
      state.servers[server.id] = server;
    },

    // Add a new channel to a server
    addChannel: (state, action: PayloadAction<{serverId: string, channel: Channel}>) => {
      const { serverId, channel } = action.payload;

      // Add channel to channels dictionary
      state.channels[channel.id] = channel;

      // Add channel ID to server's channels array
      if (state.servers[serverId]) {
        state.servers[serverId].channels.push(channel.id);
      }
    },

    // Add a direct message channel
    addDirectMessage: (state, action: PayloadAction<DirectMessage>) => {
      const dm = action.payload;
      state.directMessages[dm.id] = dm;
    }
  }
});

export const {
  setActiveServer,
  setActiveChannel,
  setActiveDM,
  addServer,
  addChannel,
  addDirectMessage
} = serversSlice.actions;

export default serversSlice.reducer;
