
import { BrowserWindow } from 'electron';
import ElectronGoogleOAuth2 from 'electron-google-oauth2';
import { google } from 'googleapis';
import { authStore } from './store';
import { TAuthTokens } from '../renderer/shared/types';

// OAuth2 config - DO NOT EXPOSE IN CLIENT CODE
// These should be in a .env file or secure storage
const clientId = process.env.GOOGLE_CLIENT_ID || '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const redirectUri = 'http://localhost:1212';
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

// Create the OAuth client
const createOAuthClient = () => {
  return new ElectronGoogleOAuth2({
    clientId: clientId,
    clientSecret: clientSecret,
    scopes: scopes,
    redirectUri: redirectUri
  });
};

// Get user profile from access token
export const getUserProfile = async (accessToken: string) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const peopleApi = google.people({ version: 'v1', auth: oauth2Client });
  const { data } = await peopleApi.people.get({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos'
  });

  // Extract and format user data
  const profile = {
    id: data.resourceName?.replace('people/', '') || '',
    name: data.names?.[0]?.displayName || '',
    email: data.emailAddresses?.[0]?.value || '',
    picture: data.photos?.[0]?.url || '',
    given_name: data.names?.[0]?.givenName || '',
    family_name: data.names?.[0]?.familyName || ''
  };

  return profile;
};

// Login with Google
export const loginWithGoogle = async (mainWindow: BrowserWindow) => {
  try {
    const oAuth2Client = createOAuthClient();

    // Set the window for the auth process
    oAuth2Client.setWindowOptions({
      alwaysOnTop: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      },
      parent: mainWindow
    });

    // Get credentials (fixed method call)
    const credentials = await oAuth2Client.openAuthWindowAndGetTokens();

    // Extract and format tokens
    const tokens: TAuthTokens = {
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      id_token: credentials.id_token,
      expiry_date: credentials.expiry_date
    };

    // Save tokens to secure storage
    authStore.set('auth_tokens', tokens);

    // Get user profile
    const userProfile = await getUserProfile(tokens.access_token);

    // Save user profile
    authStore.set('user_profile', userProfile);

    return userProfile;
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
};

// Check if user is logged in
export const isLoggedIn = () => {
  const tokens = authStore.get('auth_tokens') as TAuthTokens | undefined;
  return Boolean(tokens && tokens.access_token);
};

// Get current user
export const getCurrentUser = () => {
  return authStore.get('user_profile');
};

// Logout
export const logout = () => {
  authStore.delete('auth_tokens');
  authStore.delete('user_profile');
  return true;
};

// Refresh token if needed
export const refreshTokenIfNeeded = async () => {
  const tokens = authStore.get('auth_tokens') as TAuthTokens | undefined;

  if (!tokens || !tokens.refresh_token) {
    return false;
  }

  // Check if token is expired or about to expire
  const now = Date.now();
  const tokenExpiryTime = tokens.expiry_date || 0;

  // If token is still valid for more than 5 minutes, no need to refresh
  if (tokenExpiryTime > (now + 5 * 60 * 1000)) {
    return true;
  }

  try {
    // Create OAuth client for token refresh
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    });

    // Refresh the token
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update tokens in storage
    const updatedTokens: TAuthTokens = {
      access_token: credentials.access_token || '',
      refresh_token: credentials.refresh_token || tokens.refresh_token,
      id_token: credentials.id_token,
      expiry_date: credentials.expiry_date
    };

    authStore.set('auth_tokens', updatedTokens);
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};
