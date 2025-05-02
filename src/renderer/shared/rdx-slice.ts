// src/renderer/shared/rdx-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TMessage, TUserProfile } from './types';

interface MainState {
  show_join_server: boolean;
  show_add_channel: boolean;
  messages: TMessage[];
  user_profile: TUserProfile;
}

const initialState: MainState = {
  show_join_server: false,
  show_add_channel: false,
  messages: [],
  user_profile: {
    name: 'Guest',
    user_name: 'guest',
    image: 'https://via.placeholder.com/150',
    date_joined: new Date().toLocaleDateString(),
    status: 'Online'
  }
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setShowJoinServer: (state, action: PayloadAction<boolean>) => {
      state.show_join_server = action.payload;
    },
    setShowAddChannel: (state, action: PayloadAction<boolean>) => {
      state.show_add_channel = action.payload;
    },
    updateMessages: (state, action: PayloadAction<TMessage>) => {
      state.messages.push(action.payload);
    },
    setUserProfile: (state, action: PayloadAction<TUserProfile>) => {
      state.user_profile = action.payload;
    }
  },
});

export const { setShowJoinServer, setShowAddChannel, updateMessages, setUserProfile } = mainSlice.actions;

export default mainSlice.reducer;
