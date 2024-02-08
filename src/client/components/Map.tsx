import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
//import { JsxE } from 'typescript';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmF2ZW5oaWxsaCIsImEiOiJjbHMwbmVlZTgwMnNwMm5zMWExMzVkZnQyIn0.o7IPHZMO4ENtijDSvTEsjQ';

function Map(): JSX.Element {
  const mapContainer = useRef('');
  const map = useRef< null| mapboxgl.Map >(null);
  const [lng, setLng] = useState(-90);
  const [lat, setLat] = useState(29.9);
  const [zoom, setZoom] = useState(9);

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

  }, []);
  
  return (
    <div>
      <h1>Map</h1>
      <div className="sidebar" >
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div style={{ height: '400px' }} ref={mapContainer} className="map-container"></div>
    </div>
  );
}

export default Map;
