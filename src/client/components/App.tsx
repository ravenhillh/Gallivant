import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from './Home';
import Login from './Login';

const App = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/home',
    element: <Home />
  }
]);

export default App;
