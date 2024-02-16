import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
//import { JsxE } from 'typescript';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmF2ZW5oaWxsaCIsImEiOiJjbHMwbmVlZTgwMnNwMm5zMWExMzVkZnQyIn0.o7IPHZMO4ENtijDSvTEsjQ';

type Waypoint = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};

type MapProps = {
  passCoords: (long: number, lat: number) => void;
  waypoints: Waypoint[] | object;
};

function Map(props: MapProps): JSX.Element {
  const { passCoords } = props;
  const { waypoints } = props;
  const mapContainer = useRef('');
  const map = useRef<null | mapboxgl.Map>(null);
  const [lng, setLng] = useState(-90);
  const [lat, setLat] = useState(29.9);
  const [zoom, setZoom] = useState(9);
  const [markerLng, setMarkerLng] = useState(null);
  const [markerLat, setMarkerLat] = useState(null);

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
<<<<<<< HEAD
    // clickToCreateMarker();
    map.marker = new mapboxgl.Marker({
      color: 'red',
      draggable: 'true',
    })
      .setLngLat({lng: markerLng, lat: markerLat})
      .addTo(map.current)
      .on('dragend', () => {
        const lngLat = map.marker.getLngLat();
        setMarkerLng(lngLat.lng);
        setMarkerLat(lngLat.lat);
        passCoords(lngLat.lng, lngLat.lat);
      });
      // showMarkers();
=======

    clickToCreateMarker();
>>>>>>> b7de4cc7ea02b0d0d3cc8392dc5d20da8a346df8
  }, []);

  useEffect(() => {
    showMarkers();
  }, [waypoints]);

<<<<<<< HEAD
  useEffect(() => {
    clickToCreateMarker();
  }, [markerLat, markerLng]);

=======
>>>>>>> b7de4cc7ea02b0d0d3cc8392dc5d20da8a346df8
  function clickToCreateMarker() {
    map.current?.on('click', (e) => {
      const coordinates = e.lngLat;
      // console.log(coordinates);
      // const marker = new mapboxgl.Marker({
      //   color: 'red',
      //   draggable: 'true',
      // })
      map.marker
        .setLngLat(coordinates)
        .addTo(map.current);
      setMarkerLng(e.lngLat.lng);
      setMarkerLat(e.lngLat.lat);
      passCoords(e.lngLat.lng, e.lngLat.lat);
      // marker.remove();
    });
  }

  function showMarkers() {

    return waypoints.map((marker) => {
      //use setHTML or setDOMContent to add each tour with a click event
      const markerContent = `<div>
      <div>${marker.description}<div>
      </div>`;

      const popUp = new mapboxgl.Popup({ offset: 25 })
      .setHTML(markerContent);

      new mapboxgl.Marker({
      color: 'blue',
      draggable: false,
    })
      .setLngLat([Number(marker.long), Number(marker.lat)])
      .setPopup(popUp)
      .addTo(map.current);
    });
  }

  return (
    <div>
      <div>
        <div>Longitude: {markerLng}</div>
        <div>Latitude: {markerLat}</div>
      </div>
      <div
        style={{ height: '400px' }}
        ref={mapContainer}
        className='map-container'
      ></div>
      <div className='sidebar'>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
}

export default Map;
