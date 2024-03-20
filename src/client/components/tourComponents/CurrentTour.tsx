import React, { lazy, Suspense, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  DirectionsWalkIcon,
  Fab,
  Grid,
  TransitEnterexitIcon,
  SendIcon,
  Typography,
} from '../../utils/material';

const CurrentMap = lazy(() => import('./CurrentMap'));
const CurrentWaypoint = lazy(() => import('./CurrentWaypoint'));
const CustomModal = lazy(() => import('./Modal'));
const Chat = lazy(() => import('../Chat'));


const CurrentTour = ({ socket }): JSX.Element => {
  // loader returning user and tour from custom loader in App
  const { tour, user, waypoints } = useLoaderData();
  // state to track current index of waypoint array, i.e. user's progress thru tour
  const [currentWP, setCurrentWP] = useState(user.currentPosition);

  const [instructions, setInstructions] = useState<JSX.Element | null>(null);
  const [instructionModal, setInstructionModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);

  const navigate = useNavigate();

  const updatePosition = (position) => {
    axios
      .put(`/user/putPosition/${user.id}/${tour.id}/${position}`)
      .catch((err) =>
        console.error('Could not PUT update on user to edit position: ', err)
      );
  };

  //click handler for forward (1) or backward (-1)
  const positionClickHandler = (direction) => {
    setCurrentWP((prev) => {
      updatePosition(prev + direction);
      return prev + direction;
    });
  };

  const forwardClick = () => {
    positionClickHandler(1);
  };

  const ForwardFab = (
    <Fab
      disabled={currentWP === waypoints.length - 1}
      size='small'
      onClick={forwardClick}
      aria-label='next waypoint'
    >
      <ChevronRightIcon />
    </Fab>
  );

  const backwardClick = () => {
    positionClickHandler(-1);
  };

  const BackwardFab = (
    <Fab
      disabled={currentWP === 0}
      size='small'
      onClick={backwardClick}
      aria-label='previous waypoint'
    >
      <ChevronLeftIcon />
    </Fab>
  );

  const passInstructions = (instructions: JSX.Element | null) => {
    setInstructions(instructions);
  };

  const onLeave = () => {
    axios
      .put(`/user/leaveTour/${user.id}/`)
      .then((res) => {
        if (res.status === 200) {
          navigate('/tours/all');
          setLeaveModal(false);
        }
      })
      .catch((err) =>
        console.error('Could not PUT update on user to edit position: ', err)
      );
  };

  const routeToChat = (id: string, name: string) => {
    navigate(`/chat/${id}/${name}`);
  };

  return (
    <>
      <Grid
        container
        direction='row'
        justifyContent='space-around'
        alignItems='center'
      >
        <Suspense fallback={<>Loading...</>}>
          <CurrentWaypoint
            edit={false}
            waypoint={waypoints[currentWP]}
            forwardFab={ForwardFab}
            backwardFab={BackwardFab}
          />
        </Suspense>
      </Grid>

      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Button
          variant='contained'
          startIcon={<DirectionsWalkIcon />}
          disabled={instructions === null}
          onClick={() => setInstructionModal(true)}
          sx={{ margin: '1rem' }}
        >
          Directions
        </Button>
        <Button
          variant='contained'
          startIcon={<SendIcon />}
          onClick={() => routeToChat(tour?.id, tour?.tourName)}
          sx={{ margin: '1rem' }}
        >
          Chat
        </Button>
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
        <Typography fontSize='18px' fontWeight='bold' variant='h5'>
          {`${tour?.tourName}: `}
        </Typography>
        <Typography fontSize='16px' variant='h5'>
          {tour?.description}
        </Typography>
      </Grid>

      <Button
        variant='contained'
        startIcon={<TransitEnterexitIcon />}
        color='inherit'
        onClick={() => setLeaveModal(true)}
      >
        Leave Tour
      </Button>

      <CustomModal
        openModal={instructionModal}
        closeModal={() => setInstructionModal(false)}
      >
        {instructions}
      </CustomModal>
      <CustomModal
        openModal={leaveModal}
        closeModal={() => setLeaveModal(false)}
        confirmButton={
          <Button
            variant='contained'
            startIcon={<TransitEnterexitIcon />}
            color='warning'
            size='small'
            onClick={onLeave}
          >
            Leave Tour
          </Button>
        }
      >
        Are you sure you want to leave this tour?
        <br />
        Your progress will be lost.
        <br />
        <br />
      </CustomModal>
      <Chat socket={socket} chatUser={user} chatTour={tour.id} chatName={tour.tourName} />
    </>
  );
};

export default CurrentTour;
