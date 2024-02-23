import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Fab,
  Grid,
  Typography,
} from '../../utils/material';

const Map = lazy(() => import('../Map'));
const CurrentWaypoint = lazy(() => import('./CurrentWaypoint'));

const CurrentTour = (): JSX.Element => {
  // loader returning user and tour from custom loader in App
  const { tour, user, waypoints } = useLoaderData();

  const [currentWP, setCurrentWP] = useState(0);

  return (
    <>
      <Grid
        container
        direction='row'
        justifyContent='space-around'
        alignItems='center'
      >
        <Fab
          disabled={currentWP === 0}
          onClick={() => {
            setCurrentWP(prev => {
              // console.log(`back ${prev - 1}`);
              return prev - 1;
            });
          }}
          aria-label='previous waypoint'
        >
          <ChevronLeftIcon />
        </Fab>
        <Suspense fallback={<>Loading...</>}>
          <CurrentWaypoint edit={false} waypoint={waypoints[currentWP]} id_tour={tour.id} />
        </Suspense>
        <Fab
          disabled={currentWP === waypoints.length - 1}
          onClick={() => {
            setCurrentWP((prev) => {
              // console.log(`forward ${prev + 1}`);
              return prev + 1;
            });
          }}
          aria-label='next waypoint'
        >
          <ChevronRightIcon />
        </Fab>
      </Grid>

      <Suspense fallback={<>Loading...</>}>
        <Map waypoints={waypoints} />
      </Suspense>

      <Grid
        container
        direction='row'
        justifyContent='space-evenly'
        alignItems='center'
      >
        <Typography fontWeight='bold' variant='h5'>
          {`${tour?.tourName}: `}
        </Typography>
        <Typography variant='h5'>{tour?.description}</Typography>
      </Grid>
    </>
  );
};

export default CurrentTour;
