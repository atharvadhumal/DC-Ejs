// src/renderer/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../renderer/shared/store'; // Make sure this path is correct for your project
import { AuthProvider, useAuth } from './shared/AuthContext';
import LoginPage from './components/auth/LoginPage';
import MainComponent from './components/MainComponent';
import SettingsMain from './components/profile-comps/settings/SettingsMain';
import MainProfile from './components/profile-comps/settings/MainProfile';
import SubSidebar from './components/server-sub/SubSidebar';
import SubDisplay from './components/server-sub/SubDisplay';
import './App.css';

// Auth-protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainComponent />
          </ProtectedRoute>
        }
      >
        <Route path="server/:serverId" element={<SubSidebar />}>
          <Route path="channel/:channelId" element={<SubDisplay />} />
        </Route>
        <Route path="channel/:channelId" element={
          <>
            <SubSidebar />
            <SubDisplay />
          </>
        } />
      </Route>

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsMain />
          </ProtectedRoute>
        }
      >
        <Route path="main-profile" element={<MainProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ReduxProvider>
  );
};

export default App;
