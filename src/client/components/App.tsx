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
const Categories = lazy(() => import('./Categories'));
const Category = lazy(() => import('./Category'));

// authentication checker for protected route loaders.
import requireAuth from '../utils/requireAuth';

const currentTourLoader = async () => {
  let user = await requireAuth();
  const userData = await axios.get(`/user/${user.id}`);
  user = userData.data;

  const data = await Promise.all([
    axios.get(`/db/tourWaypoints/${user.id_currentTour}`),
    axios.get(`/db/tour/${user.id_currentTour}`),
  ]);

  const waypoints = data[0].data; // array of WPs on data property of response object
  const tour = data[1].data[0]; // first element of data property is tour object

  return { user, tour, waypoints };
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
        path: '/categories/:category',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Category />
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
