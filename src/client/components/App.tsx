import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import axios from 'axios';

// import Home from './Home';
const NavBar = lazy(() => import('./NavBar'));
const Login = lazy(() => import('./Login'));
// import Map from './Map';
const Camera = lazy(() => import('./Camera'));
const Tours = lazy(() => import('./Tours'));
const Tour = lazy(() => import('./tourComponents/Tour'));
const CurrentTour = lazy(() => import('./tourComponents/CurrentTour'));
const MapView = lazy(() => import('./MapView'));
const Gallery = lazy(() => import('./Gallery'));
const Reviews = lazy(() => import('./Reviews'));

// authentication checker for protected route loaders.
import requireAuth from '../utils/requireAuth';

const currentTourLoader = async () => {
  let user = await requireAuth();
  const userData = await axios.get(`/user/${user.id}`);
  user = userData.data;
  const tourData = await axios.get(`/db/tour/${user.id_currentTour}`);
  const tour = tourData.data[0];
  return { user, tour};
};

const App = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <NavBar />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <MapView />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/mapview',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <MapView />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/camera',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Camera />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/gallery',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Gallery />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/tours',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Tours />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/tour/:id',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Tour />
          </Suspense>
        ),
        loader: async () => await requireAuth(),
      },
      {
        path: '/reviews/:id',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Reviews />
          </Suspense>
        ),
        // loader: async () => await requireAuth(),
      },
      {
        path: '/currentTour',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <CurrentTour />
          </Suspense>
        ),
        loader: currentTourLoader,
      },
    ],
  },
]);

export default App;
