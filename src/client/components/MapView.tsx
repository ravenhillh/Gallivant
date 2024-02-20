import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import InsightsIcon from '@mui/icons-material/Insights';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmF2ZW5oaWxsaCIsImEiOiJjbHMwbmVlZTgwMnNwMm5zMWExMzVkZnQyIn0.o7IPHZMO4ENtijDSvTEsjQ';

type Marker = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};

type Tour = {
  tourName: string;
  description: string;
  id: number;
};

function MapView(): JSX.Element {
  const mapContainer = useRef('');
  const map = useRef<null | mapboxgl.Map>(null);
  const [lng, setLng] = useState(-90);
  const [lat, setLat] = useState(29.9);
  const [zoom, setZoom] = useState(9);
  const [allMarkers, setAllMarkers] = useState([]);
  const [tours, setTours] = useState([]);
  // const [myLoc, setMyLoc] = useState()
  const navigate = useNavigate();

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

  function findAllWaypoints() {
    //send axios request to db to retrieve coordinates
    axios
      .get('/maps/waypoints')
      .then(({ data }) => {
        setAllMarkers(data);
      })
      .catch((err) => console.log(err, 'get markers failed'));
  }

  function getTours(id: string | undefined) {
    axios(`maps/tours/${id}`)
      .then(({ data }) => {
        setTours(data);
      })
      .catch((err) => console.log(err));
  }

  function showMarkers() {
    allMarkers.map((marker: Marker) => {
      //use setHTML or setDOMContent to add each tour with a click event
      const markerContent = `<div>
      <h3>${marker.waypointName}</h3>
      <div>${marker.description}</div>
      </div>`;

      const popUp = new mapboxgl.Popup({ offset: 25 }).setHTML(markerContent);

      const marker1 = new mapboxgl.Marker({
        color: 'blue',
        draggable: false,
      })
        .setLngLat([Number(marker.long), Number(marker.lat)])
        .setPopup(popUp)
        .addTo(map.current);

      marker1
        .getElement()
        .addEventListener('click', () => handleClick(marker.id));
    });
  }
  const style = {
    p: 0,
    width: '100%',
    maxWidth: 360,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
  };

  function showTours() {
    return tours.length ? (
      <div>
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
                <DirectionsWalkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={tours[0].description} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <Button variant="outlined" onClick={() => routeToTour(tours[0].id)}>
              View Tour
            </Button>
          </ListItem>
        </List>
      </div>
    ) : (
      ''
    );
  }

  function routeToTour(id: string | undefined) {
    navigate(`/tour/${id}`);
  }

  function handleClick(x) {
    getTours(x);
  }

  return (
    <div>
      <Typography mt={2} variant="h2" fontWeight="bold">
        Map View
      </Typography>
      <div>
        <div>{showTours()}</div>
        <div
          style={{ height: '500px' }}
          ref={mapContainer}
          className="map-container"
        ></div>
      </div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
    </div>
  );
}

export default MapView;
