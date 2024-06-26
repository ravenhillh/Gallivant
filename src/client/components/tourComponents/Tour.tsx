import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useParams, Link, useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  AutoStoriesIcon,
  Button,
  AddIcon,
  CancelIcon,
  DeleteIcon,
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
  const [deleteTourModal, setDeleteTourModal] = useState(false);

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
        .put(`/db/tourUpdate/${id}`, {
          tour: { tourName, description: tourDesc, category },
        })
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

  const deleteTour = () => {
    axios
      .delete(`/db/deleteTour/${id}`)
      .then(() => {
        setDeleteTourModal(false);
        navigate('/tours/all');
      })
      .catch((err: string) => console.error('Could not DELETE tour: ', err));
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
          <Grid item sx={{ maxWidth: '60%' }}>
            <Typography
              variant='h2'
              fontWeight='bold'
              gutterBottom
              sx={{ fontSize: { xs: '24px', md: '34px', lg: '42px' } }}
            >
              {tour?.tourName}
            </Typography>
            <Typography variant='body1'>{tour?.description}</Typography>
          </Grid>
          <Grid item sx={{ alignSelf: 'stretch' }}>
            <Stack spacing={1}>
              {user.username === creator ? (
                <Button
                  size='small'
                  startIcon={<EditIcon />}
                  onClick={() => setUpdateTourModal(true)}
                  variant='contained'
                >
                  Edit Tour
                </Button>
              ) : (
                <Typography variant='caption'>Created by: {creator}</Typography>
              )}
              {user.username === creator ? (
                <Button
                  size='small'
                  color='error'
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteTourModal(true)}
                  variant='contained'
                >
                  Delete Tour
                </Button>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Grid item>
            <Typography variant='h5' fontWeight='600'>
              <Link
                to={`/tours/${tour?.category}`}
                style={{
                  color: '#1F1F29',
                  textDecoration: 'none',
                  fontSize: '20px',
                }}
              >
                {tour?.category?.toUpperCase()}
              </Link>
            </Typography>
            {rating && (
              <div>
                <Rating
                  name='read-only'
                  value={rating}
                  precision={0.25}
                  readOnly
                  sx={{ marginTop: '5px', marginBottom: '5px' }}
                />
                <br />
                <Button
                  startIcon={<AutoStoriesIcon />}
                  variant='contained'
                  color='primary'
                  sx={{ width: '160px', marginBottom: '5px' }}
                >
                  <a
                    style={{ color: '#e5e1e1', textDecoration: 'none' }}
                    href='#reviews'
                  >
                    Read Reviews
                  </a>
                </Button>
              </div>
            )}
            {edit ? null : (
              <Button
                startIcon={<AddIcon />}
                variant='contained'
                color='primary'
                onClick={handleOpen}
                sx={{ width: '160px' }}
              >
                Add Review
              </Button>
            )}
            <Suspense fallback={<>Loading...</>}>
              <CreateReview
                tourId={tour?.id}
                open={open}
                handleClose={handleClose}
              />
            </Suspense>
          </Grid>
          {/* <Grid item>
            <Typography variant='h5' fontWeight='bold'>
              <Link 
                to={`/tours/${tour?.category}`}
                style={{ color: '#1F1F29', textDecoration: 'none' }}
              >
                {tour?.category?.toUpperCase()}
              </Link>
            </Typography>
          </Grid> */}
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
          <Typography variant='h3' fontWeight='bold' fontSize='28px'>
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

      <Reviews id={id} open={open} />

      <Suspense fallback={<>Loading...</>}>
        <CustomModal
          openModal={updateTourModal}
          closeModal={() => setUpdateTourModal(false)}
          confirmButton={
            <Button
              variant='contained'
              size='small'
              color='primary'
              startIcon={<AddIcon />}
              onClick={updateTour}
            >
              Update Tour
            </Button>
          }
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
        </CustomModal>
      </Suspense>

      <Suspense>
        <CustomModal
          openModal={deleteTourModal}
          closeModal={() => setDeleteTourModal(false)}
          confirmButton={
            <Button
              startIcon={<DeleteIcon />}
              size='small'
              variant='contained'
              color='error'
              onClick={deleteTour}
            >
              Delete Tour
            </Button>
          }
        >
          <Typography sx={{ color: 'red', fontWeight: 'bold' }} variant='h5'>
            WARNING:
          </Typography>
          <Typography variant='body1'>
            This will delete all data associated with this tour, including
            Waypoints, Images, and Reviews. Are you sure you want to continue?{' '}
            <br />
            <br />
          </Typography>
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
        <CustomModal
          openModal={modal}
          closeModal={() => setModal(false)}
          confirmButton={
            <Button
              startIcon={<AddIcon />}
              size='small'
              variant='contained'
              color='primary'
              onClick={postWaypoint}
            >
              Save waypoint
            </Button>
          }
        >
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
    </div>
  );
};

export default Tour;
