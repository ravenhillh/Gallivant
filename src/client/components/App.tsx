import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// import Home from './Home';
import NavBar from './NavBar';
import Login from './Login';
import Map from './Map';
import Camera from './Camera';
import Tours from './Tours';
import Icon from './Icon';

// authentication checker for protected route loaders.
import requireAuth from '../utils/requireAuth';

const App = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <NavBar />,
    children: [
      {
        path: '/map',
        element: <Map />,
        // loader: async () => await requireAuth(),
      },
      {
        path: '/camera',
        element: <Camera />,
        // loader: async () => await requireAuth(),
      },
      {
        path: '/tours',
        element: <Tours />,
        // loader: async () => await requireAuth(),
      },
      {
        path: '/icon',
        element: <Icon />,
        // loader: async () => await requireAuth(),
      }
    ]
  }
]);

export default App;
