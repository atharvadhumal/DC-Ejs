// Type definitions for the application

// Auth related types
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
  date_joined?: string;
  image?: string;
  user_name?: string;
}

export type TAuthTokens = {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expiry_date?: number;
};

// Message related types
export interface TMessage {
  id?: string;
  message: string;
  profile: GoogleUser | null;
  date: string;
  channelId: string;
  attachments?: TAttachment[];
  reactions?: TReaction[];
}

export interface TAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name?: string;
  size?: number;
  thumbnail?: string;
}

export interface TReaction {
  emoji: string;
  count: number;
  users: string[]; // Array of user IDs
}

// Channel related types
export interface TChannel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: string[]; // Array of user IDs
  createdAt: string;
  createdBy: string;
  lastActivity?: string;
  topic?: string;
}

// UI related types
export interface TNotification {
  id?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  duration?: number;
  read?: boolean;
}

// Redux state types
export interface MainState {
  user_profile: GoogleUser | null;
  isLoggedIn: boolean;
  messages: Record<string, TMessage[]>; // Keyed by channelId
  channels: TChannel[];
  activeUsers: Record<string, GoogleUser[]>; // Keyed by channelId
  notifications: TNotification[];
  theme: 'light' | 'dark' | 'system';
  loading: boolean;
  error: string | null;
  showAddChannel: boolean; // Added property for add channel modal state
  show_join_server: boolean;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

export interface GoogleCredentials {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expiry_date?: number;
}

export interface IServerBtn {
  icon?: any;
  img?: string;
  title: string;
  url?: string;
  onClick?: any;
}

export interface IChannelList {
  title: string;
  channels?: Array<{
      title: string;
      url: string;
      icon?: any;
  }>
}

export type TUserProfile = {
  name: string;
  user_name: string;
  date_joined: string;
  id: number;
  image: string;
}
