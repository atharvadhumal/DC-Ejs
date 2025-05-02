// src/renderer/shared/types.ts
export interface IChannelList {
  title: string;
  channels: IChannel[];
}

export interface IChannel {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

export interface IChannelListItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  tools?: boolean;
  isActive?: boolean;
}

export interface IServerBtn {
  icon?: React.ReactNode;
  img?: string;
  title?: string;
  url?: string;
  onClick?: () => void;
}

export type TUserProfile = {
  name: string;
  user_name: string;
  image: string;
  date_joined: string;
  status: string;
};

export type TMessage = {
  message: string;
  profile: TUserProfile;
  date: string;
  channelId: string;
};

// Electron API types
interface ElectronAPI {
  auth: {
    login: () => Promise<any>;
    logout: () => Promise<boolean>;
    isLoggedIn: () => Promise<boolean>;
    getCurrentUser: () => Promise<any>;
    onAuthSuccess: (callback: (user: any) => void) => void;
    onAuthError: (callback: (error: string) => void) => void;
    onRestoreSession: (callback: (user: any) => void) => void;
  };
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
