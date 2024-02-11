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
  waypoints: Waypoint[];
};

function Map(props: MapProps): JSX.Element {
  const { passCoords } = props;
  const { waypoints } = props;
  const mapContainer = useRef('');
  const map = useRef<null | mapboxgl.Map>(null);
  const [lng, setLng] = useState(-90);
  const [lat, setLat] = useState(29.9);
  const [zoom, setZoom] = useState(9);
  const [markerLng, setMarkerLng] = useState(0);
  const [markerLat, setMarkerLat] = useState(0);
  const markerRef = useRef<mapboxgl.Marker>();

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
    clickToCreateMarker();
    showMarkers();
  }, []);

  function clickToCreateMarker() {
    map.current?.on('click', (e) => {
      const coordinates = e.lngLat;
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map.current);
      setMarkerLng(e.lngLat.lng);
      setMarkerLat(e.lngLat.lat);
      passCoords(e.lngLat.lng, e.lngLat.lat);
      marker.remove();
    });
  }

  function showMarkers() {

    waypoints.map((marker) => {
      //use setHTML or setDOMContent to add each tour with a click event
      const markerContent = `<div>
      <div>${marker.description}<div>
      <div>${marker.lat}<div>
      <div>${marker.long}<div>
      <button type="button" onclick={axios(map/tours/${marker.id})}>Button</button>
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
