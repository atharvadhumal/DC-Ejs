import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import React, { useLayoutEffect } from 'react';
import { store } from './shared/store';
import MainComponent from './components/MainComponent';
import MainDisplay from './components/main-sub/MainDisplay';
import SubDisplay from './components/server-sub/SubDisplay';
import SettingsMain from './components/profile-comps/settings/SettingsMain';
import MainProfie from './components/profile-comps/settings/MainProfile';
import { connect_socket } from './shared/functions';

const App = React.memo(() => {
  useLayoutEffect(() => {
    connect_socket()
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<MainComponent />}>
            <Route path="server/:serverId" element={<MainDisplay />}>
              <Route path="channel/:channelId" element={<SubDisplay />} />
              <Route
                path='settings'
                element={<SettingsMain />}
              >
                <Route path="main-profile" element={<MainProfie />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
});

export default App;
