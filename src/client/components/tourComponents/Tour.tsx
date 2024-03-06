import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useParams, Link, useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Button,
  AddIcon,
  CancelIcon,
  EditIcon,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
  Grid,
  Rating,
  Select,
} from '../../utils/material';

const Voice = lazy(() => import('./Voice'));
const Waypoint = lazy(() => import('./Waypoint'));
const CustomModal = lazy(() => import('./Modal'));
const Map = lazy(() => import('../Map'));
const CreateReview = lazy(() => import('../CreateReview'));
const Reviews = lazy(() => import('../Reviews'));

type Tour = {
  id: number;
  tourName: string;
  description: string;
  category: string;
  id_createdByUser: number;
};

type User = {
  username: string;
  id: number;
  id_currentTour: number;
  currentPosition: number;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
// Read review button, launches review page or modal

const Tour = (): JSX.Element => {
  // useParam hook to retrieve specific Tour
  const { id } = useParams();
  // loader returning user id from session verification
  const user = useLoaderData() as User;
  const userId = user.id;
  const [edit, setEdit] = useState<boolean>(false);

  const [tour, setTour] = useState<Tour>();
  const [tourName, setTourName] = useState('');
  const [tourDesc, setTourDesc] = useState('');
  const [category, setTourCat] = useState('');
  const [updateTourModal, setUpdateTourModal] = useState(false);
  const [errorUpdateModal, setErrorUpdateModal] = useState(false);

  const [creator, setCreator] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  //state for Waypoints array, modal pop-up dialog
  const [waypoints, setWaypoints] = useState<object[]>([]);
  const [wpName, setWpName] = useState<string>('');
  const [wpDesc, setWpDesc] = useState<string>('');
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);
  const [modal, setModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  //state for draggable sorting of waypoint list
  const [dragStart, setDragStart] = useState<number>(0);
  const [dragOver, setDragOver] = useState<number>(0);

  // state for writing review
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const categories = [
    'arts & culture',
    'entertainment',
    'food & drink',
    'history',
    'nightlife',
    'nature & outdoors',
    'miscellaneous',
  ];

  //initial useEffect, not sure how to use params hook from loader atm
  useEffect(() => {
    getTour(id);
    getTourWPs(id);
    getTourRating(id);
  }, []);

  useEffect(() => {
    setEdit(userId === tour?.id_createdByUser);
  }, [tour]);

  // function passed into Map to track gps coordinates for waypoint creation
  const passCoords = (long: number, lat: number) => {
    setLong(long);
    setLat(lat);
  };

  // onDragEnd handler that sorts waypoints array into new order
  const onDragEndOrDel = () => {
    const newOrder = [...waypoints]; // spread state into new array to not mutate
    const dragged = newOrder.splice(dragStart, 1); // returns the dragged item
    newOrder.splice(dragOver, 0, ...dragged); // insert the dragged item into new position in array

    axios
      .put('/db/waypointsOrder/', { newOrder, tourId: id }) // pass the newly-ordered array (plus tourId to update join table as well)
      .then((res) => {
        if (res.status === 200) {
          getTourWPs(id); // get updated waypoints (record sorting handled by query server-side)
        }
      })
      .catch((err: string) =>
        console.error('Could not PUT updates on waypoints: ', err)
      );
  };

  // axios requests to db to get tour by id
  const getTour = (id: string | undefined) => {
    axios(`/db/tour/${id}`)
      .then(({ data }) => {
        setTour(data[0]);
        setTourName(data[0].tourName);
        setTourDesc(data[0].description);
        setTourCat(data[0].category);
        const userId = data[0].id_createdByUser;
        getCreator(userId);
      })
      .catch((err: string) => console.error('Could not GET tour by id: ', err));
  };

  const updateTour = () => {
    if (tourName && tourDesc && category) {
      axios
        .put(`/db/tourUpdate/${id}`, { tour: { tourName, tourDesc, category } })
        .then((res) => {
          if (res.status === 200) {
            getTour(id);
            setUpdateTourModal(false);
          }
        })
        .catch((err: string) => console.error('Could not POST tour: ', err));
    } else {
      setErrorUpdateModal(true);
    }
  };

  // gets username of tour creator
  const getCreator = (userId: number | undefined) => {
    axios(`/db/tourCreatedBy/${userId}`)
      .then(({ data }) => {
        setCreator(data[0].username);
      })
      .catch((err: string) => console.error('Could not GET user by id: ', err));
  };

  // gets waypoints associated with the particular tourId
  const getTourWPs = (tourId: string | undefined) => {
    axios(`/db/tourWaypoints/${tourId}`)
      .then(({ data }) => {
        setWaypoints(data);
      })
      .catch((err: string) =>
        console.error('Could not GET waypoints by tour id: ', err)
      );
  };

  const openWaypointModal = () => {
    if (long && lat) {
      setModal(true);
    } else {
      setErrorModal(true);
    }
  };

  // and post waypoint to db
  const postWaypoint = () => {
    axios
      .post('/db/waypoint/', {
        waypoint: {
          waypointName: wpName,
          description: wpDesc,
          long,
          lat,
        },
        id_tour: id,
      })
      .then((res) => {
        if (res.status === 201) {
          setModal(false);
          setWpName('');
          setWpDesc('');
          getTourWPs(id);
        }
      })
      .catch((err: string) => console.error('Could not POST waypoint: ', err));
  };

  // startTour button functionality
  const startTour = () => {
    if (user.id_currentTour?.toString() === id) {
      navigate('/currentTour/');
    } else {
      axios
        .put(`/user/startTour/${userId}/${id}`)
        .then((response) => {
          if (response.status === 200) {
            navigate('/currentTour');
          }
        })
        .catch((err) =>
          console.error('Could not PUT update on user to start tour: ', err)
        );
    }
  };

  const getTourRating = (id) => {
    axios
      .get(`/reviews/rating/${id}`)
      .then(({ data }) => {
        setRating(data);
      })
      .catch((err) => console.error('Could not Get AVG rating ', err));
  };

  return (
    <div>
      <Stack spacing={2}>
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='h2' fontWeight='bold' gutterBottom>
            {tour?.tourName}
          </Typography>
          <Typography variant='body1' gutterBottom>
            {tour?.description}
          </Typography>
          {user.username === creator ? (
            <Button
              startIcon={<EditIcon />}
              onClick={() => setUpdateTourModal(true)}
              variant='contained'
            >
              Edit Tour
            </Button>
          ) : (
            <Typography variant='caption' gutterBottom>
              Created by: {creator}
            </Typography>
          )}
        </Grid>
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Grid item>
            {rating && (
              <Rating
                name='read-only'
                value={rating}
                precision={0.25}
                readOnly
              />
            )}
          </Grid>
          <Grid item>
            <Typography variant='h5' fontWeight='bold' gutterBottom>
              <Link to={`/tours/${tour?.category}`}>
                {tour?.category?.toUpperCase()}
              </Link>
            </Typography>
          </Grid>
        </Grid>

        <Button
          disabled={waypoints.length === 0}
          startIcon={waypoints.length ? <AddIcon /> : <CancelIcon />}
          variant='contained'
          color='primary'
          onClick={startTour}
        >
          {waypoints.length
            ? user.id_currentTour?.toString() === id
              ? 'Continue Tour'
              : 'Start Tour'
            : 'Tour has no waypoints'}
        </Button>

        <Suspense fallback={<>Loading...</>}>
          <Map waypoints={waypoints} passCoords={passCoords} />
        </Suspense>

        <Grid
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='baseline'
        >
          {edit ? null : (
            <Button
              startIcon={<AddIcon />}
              variant='contained'
              color='primary'
              onClick={handleOpen}
            >
              Add Review
            </Button>
          )}
          <CustomModal
            openModal={open}
            closeModal={handleClose}
            // aria-labelledby='modal-modal-title'
            // aria-describedby='modal-modal-description'
          >
            <Suspense fallback={<>Loading...</>}>
              <CreateReview tourId={tour?.id} handleClose={handleClose} />
            </Suspense>
          </CustomModal>
          {/* <br /> */}
          {edit && (
            <Button
              startIcon={<AddIcon />}
              variant='contained'
              color='primary'
              onClick={openWaypointModal}
            >
              Add Waypoint
            </Button>
          )}
        </Grid>

        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='baseline'
        >
          <Typography variant='h3' gutterBottom>
            Waypoints
          </Typography>
        </Grid>

        <Stack spacing={1} className='waypoint-stack'>
          {waypoints.map((wp, i) => (
            <div
              key={i}
              draggable={edit}
              onDragStart={() => setDragStart(i)}
              onDragEnter={() => setDragOver(i)}
              onDragEnd={onDragEndOrDel}
              onDragOver={(e) => e.preventDefault()}
            >
              <Suspense fallback={<>Loading...</>}>
                <Waypoint
                  getTourWPs={getTourWPs}
                  updateOrder={onDragEndOrDel}
                  id_tour={id}
                  waypoint={wp}
                  edit={edit}
                />
              </Suspense>
            </div>
          ))}
        </Stack>
      </Stack>

      <Suspense fallback={<>Loading...</>}>
        <CustomModal
          openModal={updateTourModal}
          closeModal={() => setUpdateTourModal(false)}
        >
          <div>
            <Voice
              type='name'
              label='Update your tour name'
              helperText='Tour Name'
              textInput={tourName}
              setTextInput={setTourName}
            />
          </div>
          <br />
          <Voice
            type='description'
            label='Update your tour description'
            helperText='Tour Description'
            textInput={tourDesc}
            setTextInput={setTourDesc}
          />
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Category</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={category}
              label='Category'
              onChange={(e) => setTourCat(e.target.value)}
            >
              {categories.map((category, i) => (
                <MenuItem key={i} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <br />
          <Button
            variant='contained'
            size='small'
            color='primary'
            startIcon={<AddIcon />}
            onClick={updateTour}
          >
            Update Tour
          </Button>
        </CustomModal>
      </Suspense>

      <Suspense fallback={<>Loading...</>}>
        <CustomModal
          openModal={errorUpdateModal}
          closeModal={() => setErrorUpdateModal(false)}
        >
          <Typography variant='body1'>
            Please give tour a name, description, and select a category.
          </Typography>
        </CustomModal>
      </Suspense>

      <Suspense fallback={<>Loading...</>}>
        <CustomModal openModal={modal} closeModal={() => setModal(false)}>
          <div>
            <Voice
              type='name'
              label='Give the waypoint a name'
              helperText='Waypoint Name'
              textInput={wpName}
              setTextInput={setWpName}
            />
          </div>
          <br />
          <div>
            <Voice
              type='description'
              label='Give the waypoint a description'
              helperText='Waypoint Description'
              textInput={wpDesc}
              setTextInput={setWpDesc}
            />
          </div>
          <br />
          <Button
            startIcon={<AddIcon />}
            size='small'
            variant='contained'
            color='primary'
            onClick={postWaypoint}
          >
            Save waypoint
          </Button>
        </CustomModal>
      </Suspense>

      <Suspense fallback={<>Loading...</>}>
        <CustomModal
          openModal={errorModal}
          closeModal={() => setErrorModal(false)}
        >
          <Typography variant='body1'>
            Please click location on map first.
          </Typography>
          <br />
        </CustomModal>
      </Suspense>
      <Reviews id={id} open={open}/>
    </div>
  );
};

export default Tour;
