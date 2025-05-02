import { io, Socket } from "socket.io-client";
import { TMessage, GoogleUser } from "./types";
import {store} from "./store";
import { updateMessages, setChannelUsers, addNotification } from "./rdx-slice";

// Create socket instance
const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:3000";
export const socket_inst: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Initialize socket listeners
export const initSocketListeners = () => {
  // Connection events
  socket_inst.on("connect", () => {
    console.log("Socket connected:", socket_inst.id);
  });

  socket_inst.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    store.dispatch(
      addNotification({
        type: "error",
        message: "Disconnected from server",
        title: "Connection Lost",
      })
    );
  });

  socket_inst.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
    store.dispatch(
      addNotification({
        type: "error",
        message: "Failed to connect to server",
        title: "Connection Error",
      })
    );
  });

  // Message events
  socket_inst.on("receive-message", (message: TMessage) => {
    store.dispatch(updateMessages(message));
  });

  // Channel events
  socket_inst.on("channel-users", (data: { channelId: string; users: GoogleUser[] }) => {
    store.dispatch(setChannelUsers(data));
  });

  socket_inst.on("user-joined", (data: { channelId: string; user: GoogleUser }) => {
    store.dispatch(
      addNotification({
        type: "info",
        message: `${data.user.name} joined ${data.channelId}`,
        title: "User Joined",
      })
    );
  });

  socket_inst.on("user-left", (data: { channelId: string; user: GoogleUser }) => {
    store.dispatch(
      addNotification({
        type: "info",
        message: `${data.user.name} left ${data.channelId}`,
        title: "User Left",
      })
    );
  });
};

/**
 * Send a message to a channel
 * @param message Message text
 * @param channelId Target channel ID
 * @param userProfile User profile of the sender
 * @returns boolean indicating success
 */
export const sendMessage = (
  message: string,
  channelId: string,
  userProfile: GoogleUser | null
): boolean => {
  if (!message || !channelId || !userProfile) {
    console.error("Cannot send message: Missing required fields");
    return false;
  }

  try {
    const messageObj: TMessage = {
      message: message,
      profile: userProfile,
      date: new Date().toLocaleString(),
      channelId: channelId,
    };

    // If socket is connected, send via socket
    if (socket_inst.connected) {
      socket_inst.emit("send-message", messageObj);
    } else {
      // Fallback to local update only
      console.warn("Socket not connected. Message will only be visible locally.");
      store.dispatch(updateMessages(messageObj));
    }

    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

/**
 * Join a channel
 * @param channelId Channel ID to join
 */
export const joinChannel = (channelId: string) => {
  if (!channelId) return;

  const userProfile = store.getState().main.user_profile;
  if (!userProfile) {
    console.error("Cannot join channel: User not logged in");
    return;
  }

  socket_inst.emit("join-channel", {
    channelId,
    user: userProfile,
  });

  console.log(`Joined channel: ${channelId}`);
};

/**
 * Leave a channel
 * @param channelId Channel ID to leave
 */
export const leaveChannel = (channelId: string) => {
  if (!channelId) return;

  const userProfile = store.getState().main.user_profile;
  if (!userProfile) return;

  socket_inst.emit("leave-channel", {
    channelId,
    user: userProfile,
  });

  console.log(`Left channel: ${channelId}`);
};

/**
 * Format timestamp to readable time
 * @param timestamp Timestamp string
 * @returns Formatted time string
 */
export const formatMessageTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

/**
 * Format date for message groups
 * @param timestamp Timestamp string
 * @returns Formatted date string
 */
export const formatMessageDate = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {
    return '';
  }
};

/**
 * Get user initials from name
 * @param name User's full name
 * @returns Initials (up to 2 characters)
 */
export const getUserInitials = (name: string): string => {
  if (!name) return '??';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Generate a random color based on user ID
 * @param userId User's ID
 * @returns CSS color string
 */
export const getUserColor = (userId: string): string => {
  const colors = [
    "#FF5252", "#FF4081", "#E040FB", "#7C4DFF",
    "#536DFE", "#448AFF", "#40C4FF", "#18FFFF",
    "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41",
    "#FFFF00", "#FFD740", "#FFAB40", "#FF6E40"
  ];

  // Generate a number from the user ID
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }

  return colors[sum % colors.length];
};
