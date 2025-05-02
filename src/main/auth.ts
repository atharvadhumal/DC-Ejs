import { BrowserWindow } from 'electron';
import ElectronGoogleOAuth2 from 'electron-google-oauth2';
import { google } from 'googleapis';

// Type definition for Google User
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

// Proper dynamic import for ESM module
let Store: any = null;

// Initialize store asynchronously
const initializeStore = async () => {
  if (!Store) {
    try {
      const StoreModule = await import('electron-store');
      Store = StoreModule.default;
    } catch (error) {
      console.error('Failed to import electron-store:', error);
      throw error;
    }
  }
  return new Store({
    name: 'auth-store',
    encryptionKey: 'xT5q9cR2z8Lp3F7kD1jH4sA6mE0vB2nX'
  });
};

// Get store instance (make sure to await this before using)
const getStore = async () => {
  return await initializeStore();
};

// OAuth2 config
const clientId = 'process.env.GOOGLE_CLIENT_ID';
const clientSecret = 'process.env.GOOGLE_CLIENT_SECRET';
const redirectUri = 'http://localhost:1212';
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

// Create OAuth client
const createOAuthClient = async () => {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  // Set credentials if we have them stored
  const store = await getStore();
  const tokens = store.get('auth-tokens');
  if (tokens) {
    oauth2Client.setCredentials(tokens);
  }

  return oauth2Client;
};

// Create GoogleAuth instance
const createAuthInstance = () => {
  return new ElectronGoogleOAuth2(
    clientId,
    clientSecret,
    scopes,
    {
      successRedirectURL: redirectUri
    }
  );
};

// Map raw Google user data to our GoogleUser interface
const mapToGoogleUser = (data: any): GoogleUser => {
  return {
    id: data.id || '',
    email: data.email || '',
    name: data.name || '',
    picture: data.picture || '',
    given_name: data.given_name,
    family_name: data.family_name
  };
};

// Perform login
export const loginWithGoogle = async (mainWindow: BrowserWindow): Promise<GoogleUser | null> => {
  try {
    console.log('Starting Google login process...');
    const authInstance = createAuthInstance();
    const tokens = await authInstance.openAuthWindowAndGetTokens();
    console.log('Received auth tokens');

    // Store tokens securely
    const store = await getStore();
    store.set('auth-tokens', tokens);

    // Get user info
    const oauth2Client = await createOAuthClient();
    oauth2Client.setCredentials(tokens);

    const userInfoClient = google.oauth2({
      version: 'v2',
      auth: oauth2Client
    });

    const userInfo = await userInfoClient.userinfo.get();
    console.log('Fetched user info:', userInfo.data);

    // Map to our user interface
    const userData = mapToGoogleUser(userInfo.data);

    // Return user data to renderer
    mainWindow.webContents.send('auth:success', userData);

    return userData;
  } catch (error: unknown) {
    console.error('Google auth error:', error);
    mainWindow.webContents.send('auth:error', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Check if user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const store = await getStore();
    return !!store.get('auth-tokens');
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    const store = await getStore();
    store.delete('auth-tokens');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

// Get current user info
export const getCurrentUser = async (): Promise<GoogleUser | null> => {
  try {
    if (!(await isLoggedIn())) {
      console.log('No user is logged in');
      return null;
    }

    const oauth2Client = await createOAuthClient();
    const userInfoClient = google.oauth2({
      version: 'v2',
      auth: oauth2Client
    });

    const userInfo = await userInfoClient.userinfo.get();
    console.log('Retrieved current user info');
    return mapToGoogleUser(userInfo.data);
  } catch (error: unknown) {
    console.error('Error getting user info:', error);
    return null;
  }
};
