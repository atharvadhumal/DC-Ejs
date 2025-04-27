import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import React from 'react';
import { store } from './shared/store';
import MainComponent from './components/MainComponent';
import MainDisplay from './components/main-sub/MainDisplay';

const App = React.memo(() => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<MainComponent />}>
            <Route
              path="server/:serverId"
              element={<MainDisplay />}
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
});

export default App;
