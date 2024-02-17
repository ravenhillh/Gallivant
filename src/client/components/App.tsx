import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// import Home from './Home';
import NavBar from './NavBar';
import Login from './Login';
// import Map from './Map';
import Camera from './Camera';
import Tours from './Tours';
import Tour from './tourComponents/Tour';
import MyThree from './Icon';
import MapView from './MapView';
import Gallery from './Gallery';

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
        path: '/',
        element: <MapView />,
        // loader: async () => await requireAuth(),
      },
      {
        path: '/mapview',
        element: <MapView />,
        // loader: async () => await requireAuth(),
      },
      {
        path: '/camera',
        element: <Camera />,
        // loader: async () => await requireAuth(),
      },
      {
        path: '/gallery',
        element: <Gallery />,
        // loader: async () => await requireAuth(),
      },
      {
        path: '/tours',
        element: <Tours />,
        // loader: async () => await requireAuth(),
      },
      {
        path: '/icon',
        element: <MyThree />,
      },
      {
        path: '/tour/:id',
        element: <Tour />,
        loader: async () => await requireAuth(),
      }
    ]
  }
]);

export default App;
