import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Map from './Map';
import Camera from './Camera';
import Tours from './Tours';
import Icon from './Icon';

const App = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/map',
        element: <Map />,
      },
      {
        path: '/camera',
        element: <Camera />,
      },
      {
        path: '/tours',
        element: <Tours />,
      },
      {
        path: '/icon',
        element: <Icon />,
      }
    ]
  }
]);

export default App;
