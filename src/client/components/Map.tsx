// import mapboxgl from 'mapbox-gl';
import { mapboxgl } from '../utils/material';
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
  const [lng, setLng] = useState(-90.09);
  const [lat, setLat] = useState(29.96);
  const [zoom, setZoom] = useState(11.5);
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

    map.marker = new mapboxgl.Marker({
      color: 'red',
      draggable: 'true',
    })
      .setLngLat({ lng: markerLng, lat: markerLat })
      .addTo(map.current)
      .on('dragend', () => {
        const lngLat = map.marker.getLngLat();
        setMarkerLng(lngLat.lng);
        setMarkerLat(lngLat.lat);
        passCoords(lngLat.lng, lngLat.lat);
      });
  }, []);

  useEffect(() => {
    showMarkers();
  }, [waypoints]);

  useEffect(() => {
    clickToCreateMarker();
  }, [markerLat, markerLng]);

  function clickToCreateMarker() {
    map.current?.on('click', (e) => {
      const coordinates = e.lngLat;

      map.marker.setLngLat(coordinates).addTo(map.current);
      setMarkerLng(e.lngLat.lng);
      setMarkerLat(e.lngLat.lat);
      passCoords(e.lngLat.lng, e.lngLat.lat);
    });
  }

  function showMarkers() {
    return waypoints.map((marker) => {
      //use setHTML or setDOMContent to add each tour with a click event
      const markerContent = `
        <div>
          <h3>${marker.waypointName}</h3>
          <div>${marker.description}</div>
        </div>
      `;

      const popUp = new mapboxgl.Popup({ offset: 25 }).setHTML(markerContent);

      const marker1 = new mapboxgl.Marker({
        color: 'blue',
        draggable: false,
      })
        .setLngLat([Number(marker.long), Number(marker.lat)])
        .setPopup(popUp)
        .addTo(map.current);

      marker1.getElement();
    });
  }

  return (
    <div>
      <div
        style={{ height: '400px' }}
        ref={mapContainer}
        className='map-container'
      ></div>
    </div>
  );
}

export default Map;
