import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';
import { Popup, Marker } from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
//import { JsxE } from 'typescript';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmF2ZW5oaWxsaCIsImEiOiJjbHMwbmVlZTgwMnNwMm5zMWExMzVkZnQyIn0.o7IPHZMO4ENtijDSvTEsjQ';

function MapView(): JSX.Element {
  const mapContainer = useRef('');
  const map = useRef< null| mapboxgl.Map >(null);
  const [lng, setLng] = useState(-90);
  const [lat, setLat] = useState(29.9);
  const [zoom, setZoom] = useState(9);
  const [allMarkers, setAllMarkers] = useState([]);
  // const [myLoc, setMyLoc] = useState()

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on('move', () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
      }));

  }, []);

  function findAllMarkers() {
    //send axios request to db to retrieve coordinates
    axios.get('/maps/waypoints')
    .then(({ data }) => {
      setAllMarkers(data);
      console.log(data);
    })
    .catch((err) => console.log(err, 'get markers failed'));
  }
  
  function showMarkers() {

    new mapboxgl.Marker({
      color: 'blue',
      draggable: false
  })
    .setLngLat([ -90.0838245, 29.951061])
    .addTo(map.current);
  }

  return (
    <div>
      <h1>Map</h1>
      <div>
         <div style={{ height: '400px' }} ref={mapContainer} className="map-container"></div>
      </div>
      <button type='submit' onClick={() => findAllMarkers()}>
        send request
      </button>
      <button type='submit' onClick={() => showMarkers()}>
        show
      </button>
      <div className="sidebar" >
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
}

export default MapView;
