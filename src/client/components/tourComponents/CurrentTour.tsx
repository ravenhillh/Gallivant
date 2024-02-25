import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Button,
  DirectionsWalkIcon,
  Fab,
  Grid,
  Typography,
} from '../../utils/material';

const CurrentMap = lazy(() => import('./CurrentMap'));
const CurrentWaypoint = lazy(() => import('./CurrentWaypoint'));
const CustomModal = lazy(() => import('./Modal'));

const CurrentTour = (): JSX.Element => {
  // loader returning user and tour from custom loader in App
  const { tour, user, waypoints } = useLoaderData();
  // state to track current index of waypoint array, i.e. user's progress thru tour
  const [currentWP, setCurrentWP] = useState(user.currentPosition);

  const [instructions, setInstructions] = useState<JSX.Element | null>(null);
  const [instructionModal, setInstructionModal] = useState(false);

  const updatePosition = (position) => {
    axios
      .put(`/user/putPosition/${user.id}/${tour.id}/${position}`)
      .catch((err) =>
        console.error('Could not PUT update on user to edit position: ', err)
      );
  };

  const passInstructions = (instructions: JSX.Element | null) => {
    setInstructions(instructions);
  };

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
            setCurrentWP((prev) => {
              updatePosition(prev - 1);
              return prev - 1;
            });
          }}
          aria-label='previous waypoint'
        >
          <ChevronLeftIcon />
        </Fab>
        <Suspense fallback={<>Loading...</>}>
          <CurrentWaypoint edit={false} waypoint={waypoints[currentWP]} />
        </Suspense>
        <Fab
          disabled={currentWP === waypoints.length - 1}
          onClick={() => {
            setCurrentWP((prev) => {
              updatePosition(prev + 1);
              return prev + 1;
            });
          }}
          aria-label='next waypoint'
        >
          <ChevronRightIcon />
        </Fab>
      </Grid>

      <Suspense fallback={<>Loading...</>}>
        <CurrentMap
          setInstructions={passInstructions}
          currentWP={currentWP}
          waypoints={waypoints}
        />
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
        <Button
          variant='contained'
          startIcon={<DirectionsWalkIcon />}
          disabled={instructions === null}
          onClick={() => setInstructionModal(true)}
        >
          Directions
        </Button>
      </Grid>

      <CustomModal
        openModal={instructionModal}
        closeModal={() => setInstructionModal(false)}
      >
        {instructions}
      </CustomModal>
    </>
  );
};

export default CurrentTour;
