// import mapboxgl from 'mapbox-gl';
import { mapboxgl } from '../utils/material';
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  BubbleChartIcon,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  DirectionsWalkIcon,
  Grid,
  ImageIcon,
  InsightsIcon,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
} from '../utils/material';
// import Chat from './Chat';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmF2ZW5oaWxsaCIsImEiOiJjbHMwbmVlZTgwMnNwMm5zMWExMzVkZnQyIn0.o7IPHZMO4ENtijDSvTEsjQ';

type Marker = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};

function MapView(): JSX.Element {
  const mapContainer = useRef('');
  const map = useRef<null | mapboxgl.Map>(null);
  const [lng, setLng] = useState(-90);
  const [lat, setLat] = useState(29.9);
  const [zoom, setZoom] = useState(9);
  const [allMarkers, setAllMarkers] = useState([]);
  const [tours, setTours] = useState([]);
  const [images, setImages] = useState([]);
  const [tourWaypoints, setTourWaypoints] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on('move', () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav, 'top-right');

    findAllWaypoints();
  }, []);

  useEffect(() => {
    showMarkers();
  }, [allMarkers]);

  useEffect(() => {
    showTours();
  }, [tours]);

  const findAllWaypoints = () => {
    //send axios request to db to retrieve all waypoints
    axios
      .get('/maps/waypoints')
      .then(({ data }) => {
        setAllMarkers(data);
      })
      .catch((err) => console.log(err, 'get markers failed'));
  };
  //get tours id by waypoint and set waypoints array per tour
  const getTours = (id: string | undefined) => {
    axios(`maps/tours/${id}`)
      .then(async ({ data }) => {
        setTours(data);
        const waypoints = await axios(`/db/tourWaypoints/${data[0].id}`);
        setTourWaypoints(waypoints.data);
      }).catch((err) => console.log(err));
  };
  //get all images for one tour
  const getTourImages = () => {
    const ids = [];
    tourWaypoints?.forEach((waypoint) => {
      ids.push(waypoint.id);
    });
    axios.post('/images/tour/waypoints', {
      ids: ids
    })
    .then(({ data }) => {
      setImages(data);
    }).catch((err) => console.log(err));
  };

  useEffect(() => {
    getTourImages();
  }, [tourWaypoints]);
  //set markers for all waypoints
  const showMarkers = () => {
    allMarkers.map((marker: Marker) => {
      const markerContent = `<div>
      <h3>${marker.waypointName}</h3>
      <div>${marker.description}</div>
      </div>`;

      const popUp = new mapboxgl.Popup({ offset: 25 }).setHTML(markerContent);

      const marker1 = new mapboxgl.Marker({
        color: theme.palette.primary.main,
        draggable: false,
      })
        .setLngLat([Number(marker.long), Number(marker.lat)])
        .setPopup(popUp)
        .addTo(map.current);

      marker1
        .getElement()
        .addEventListener('click', () => handleClick(marker.id));

      marker1
        .getElement()
        .addEventListener('mouseenter', () => marker1.togglePopup());
      marker1
        .getElement()
        .addEventListener('mouseleave', () => marker1.togglePopup());
    });
  };

  const style = {
    p: 0,
    width: '100%',
    height: '100%',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    background:'inherit',
  };
  //tour details rendered on waypoint click
  const showTours = () => {
    return tours.length ? (
        <Grid className="show-tours" container>
          <Grid className="map-details" item>
            <List sx={style} aria-label="tour details">
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <InsightsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={tours[0].tourName} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <BubbleChartIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={tours[0].category} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <DirectionsWalkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={tours[0].description} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <Button
                  className="map-buttons"
                  variant="outlined"
                  onClick={() => routeToTour(tours[0].id)}
                >
                  View Tour
                </Button>
                <Button
                  className="map-buttons"
                  variant="outlined"
                  onClick={() => routeToChat(tours[0].id, tours[0].tourName)}
                >
                  Tour Chat
                </Button>
              </ListItem>
            </List>
          </Grid>
          {images.length === 0 ? (
            ''
          ) : (
              <Grid className="map-details" item>
                <List sx={style}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={'Images'} />
                  </ListItem>
                  <Divider component="li" />
                  {images.map((image, i) => (
                  <ListItem key={i}>
                    <Card className='map-image-card'>
                      <CardContent>
                        <img
                          src={`/api/images/${image.largeImg}`}
                          style={{ maxWidth: '95%', height: '180px'}}
                        />
                      </CardContent>
                    </Card>
                  </ListItem>
                  ))}
                </List>
              </Grid>
          )}
        </Grid>
    ) : (
      ''
    );
  };
  //route to tour page for specific tour
  const routeToTour = (id: string | undefined) => {
    navigate(`/tour/${id}`);
  };
  //route to chat room for specific tour
  const routeToChat = (id: string, name: string) => {
    navigate(`/chat/${id}/${name}`);
  };
  //get tour details on waypoint click
  const handleClick = (id) => {
    getTours(id);
  };

  return (
    <div className='map-view'>
      <Typography
        mt={2} 
        variant="h4" 
        fontWeight={300}
        textAlign='left'
        sx={{ fontSize: { xs: '40px', md: '50px', lg: '60px'}}}
      >
        Browse Tours
      </Typography>
      {tours.length === 0 ? (
        <List>
          <Divider component="li" />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DirectionsWalkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="explore the different tours in your area!" />
          </ListItem>
          <Divider component="li" />
        </List>
      ) : (
        ''
      )}
      <div>
        <div
          style={{ height: '400px' }}
          ref={mapContainer}
          className="map-container"
        ></div>
      </div>
      <Grid container>
        <Grid xs={12} item>
          <div>{showTours()}</div>
        </Grid>
      </Grid>
    </div>
  );
}

export default MapView;
