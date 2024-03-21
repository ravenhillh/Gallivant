import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import axios from 'axios';

const NavBar = lazy(() => import('./NavBar'));
const Login = lazy(() => import('./Login'));
// import Map from './Map';
const Camera = lazy(() => import('./Camera'));
const Tours = lazy(() => import('./Tours'));
const Tour = lazy(() => import('./tourComponents/Tour'));
const CurrentTour = lazy(() => import('./tourComponents/CurrentTour'));
const MapView = lazy(() => import('./MapView'));
const Gallery = lazy(() => import('./Gallery'));
// const Reviews = lazy(() => import('./Reviews'));
// const Categories = lazy(() => import('./Categories'));
// const Category = lazy(() => import('./Category'));
const Chat = lazy(() => import('./Chat'));

// authentication checker for protected route loaders.
import { requireAuth, nonRedirectUser } from '../utils/requireAuth';
import socket from '../utils/socket';

type User = {
  username: string;
  id: number;
  id_currentTour: number;
};

//NavBar user info, nonRedirectUser so that non-privileged components will still load without redirecto to login
const getUser = async (): Promise<User | null> => {
  const user = await nonRedirectUser();
  if (user) {
    const userData = await axios.get(`/user/${user.id}`);
    return userData.data;
  }
  return null;
};

//user returned from requireAuth is just user property on session object,
//which is only updated when user logs in. for up to date user info, use this function
const getAuthorizedUser = async (): Promise<User | null> => {
  const user = await requireAuth();
  const userData = await axios.get(`/user/${user.id}`);
  return userData.data;
};

const currentTourLoader = async () => {
  const user = await getAuthorizedUser();

  const data = await Promise.all([
    axios.get(`/db/tourWaypoints/${user?.id_currentTour}`),
    axios.get(`/db/tour/${user?.id_currentTour}`),
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
    loader: () => getUser(),
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
        path: '/tours/:cat',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Tours />
          </Suspense>
        ),
        loader: async () => await requireAuth(),
      },
      {
        path: '/tour/:id',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Tour />
          </Suspense>
        ),
        loader: async () => await getAuthorizedUser(),
      },
      // {
      //   path: '/categories/:category',
      //   element: (
      //     <Suspense fallback={<>Loading...</>}>
      //       <Category />
      //     </Suspense>
      //   ),
      //   // loader: async () => await requireAuth(),
      // },
      {
        path: '/currentTour',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <CurrentTour socket={socket}/>
          </Suspense>
        ),
        loader: currentTourLoader,
      },
      {
        path: '/chat/:tour/:name',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <Chat socket={socket} />
          </Suspense>
        ),
        loader: async () => await requireAuth(),
      },
    ],
  },
]);

export default App;
