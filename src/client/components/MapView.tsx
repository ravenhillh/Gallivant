import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { Popup, Marker } from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
//import { JsxE } from 'typescript';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmF2ZW5oaWxsaCIsImEiOiJjbHMwbmVlZTgwMnNwMm5zMWExMzVkZnQyIn0.o7IPHZMO4ENtijDSvTEsjQ';

function MapView(): JSX.Element {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-90);
  const [lat, setLat] = useState(29.9);
  const [zoom, setZoom] = useState(9);
  const [allMarkers, setAllMarkers] = useState([]);
  // const [myLoc, setMyLoc] = useState()

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

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

  // function showMarkers() {
  //   map.marker = new mapboxgl.Marker({
  //     color: 'orange',
  //     draggable: false
  // })
  // .setLngLat([allMarkers[0].long, allMarkers[0].lat])
  //     .addTo(map.current);
  // }

  return (
    <div>
      <h1>Map</h1>
      <button type='submit' onClick={() => findAllMarkers()}>
        send request
      </button>
      {/* <button type='submit' onClick={() => showMarkers()}>
        show
      </button> */}
      <div className="sidebar" >
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div style={{ height: '400px' }} ref={mapContainer} className="map-container"></div>
    </div>
  );
}

export default MapView;
