import mapboxgl from 'mapbox-gl'; 
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
//import { JsxE } from 'typescript';
// import Map from './Map';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmF2ZW5oaWxsaCIsImEiOiJjbHMwbmVlZTgwMnNwMm5zMWExMzVkZnQyIn0.o7IPHZMO4ENtijDSvTEsjQ';

function MapView(): JSX.Element {
  const mapContainer = useRef('');
  const map = useRef<null | mapboxgl.Map>(null);
  const [lng, setLng] = useState(-90);
  const [lat, setLat] = useState(29.9);
  const [markerLng, setMarkerLng] = useState(0);
  const [markerLat, setMarkerLat] = useState(0);
  const [zoom, setZoom] = useState(9);
  const [allMarkers, setAllMarkers] = useState([]);
  const [tours, setTours] = useState([]);
  // const markerRef = useRef<mapboxgl.Marker>();
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

  // function clickToCreateMarker() {
  //   map.current?.on('click', (e) => {
  //     if (markerRef.current) {
  //       markerRef.current.remove();
  //       markerRef.current = undefined;
  //     }
  //     const coordinates = e.lngLat;
  //     const marker = new mapboxgl.Marker()
  //       .setLngLat(coordinates)
  //       .addTo(map.current);
  //     setMarkerLng(e.lngLat.lng);
  //     setMarkerLat(e.lngLat.lat);
  //     markerRef.current = marker;
  //   });
  // }

  function findAllWaypoints() {
    //send axios request to db to retrieve coordinates
    axios
      .get('/maps/waypoints')
      .then(({ data }) => {
        setAllMarkers(data);
        console.log(data);
      })
      .catch((err) => console.log(err, 'get markers failed'));
  }

  function getTours(id: string | undefined) {
    axios(`maps/tours/${id}`)
    .then(({ data }) => {
      console.log('success', data);
      setTours(data);
    })
    .catch((err) => console.log(err));
  }

  function showMarkers() {
    allMarkers.map((marker) => {
      //use setHTML or setDOMContent to add each tour with a click event
      const markerContent = `<div>
      <div>${marker.waypointName}</div>
      </div>`;

      const popUp = new mapboxgl.Popup({ offset: 25 })
      .setHTML(markerContent);

      const marker1 = new mapboxgl.Marker({
      color: 'blue',
      draggable: false,
    })
      .setLngLat([Number(marker.long), Number(marker.lat)])
      .setPopup(popUp)
      .addTo(map.current);

      marker1.getElement().addEventListener('click', () => handleClick(marker.id));
    });
  }

  function showTours() {
    return tours.length? (<div>
      <div>Tour: {tours[0].tourName}</div>
      <div>Description: {tours[0].description}</div>
      {/* <button onClick={() => getSpecificTour(tours[0].id)}>View Tour</button> */}
      </div>): '';
  }

  // function getSpecificTour(id: string | undefined) {
  //   axios(`maps/fulltour/${id}`)
  //   .then(({ data }) => {
  //     // setAllMarkers(data);
  //     console.log(data);
  //   })
  //   .catch((err) => console.log(err, 'get full tour failed'));
  // }

  function handleClick(x) {
    getTours(x);
  }

  return (
    <div>
      <h1>Map</h1>
      <div>
        <div>
          {showTours()}
        </div>
        <div
          style={{ height: '400px' }}
          ref={mapContainer}
          className="map-container"
        ></div>
      </div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
}

export default MapView;
