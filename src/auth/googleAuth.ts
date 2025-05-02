import { BrowserWindow } from 'electron';
import ElectronGoogleOAuth2 from 'electron-google-oauth2';
import { google } from 'googleapis';
import { authStore } from './store';

// OAuth2 config
const clientId = '79173346276-stq37bvrdvonpd1rba3f2vt4ng5jev6f.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'http://localhost:1212';
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

// Rest of your auth code...
