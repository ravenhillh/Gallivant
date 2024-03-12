// import mapboxgl from 'mapbox-gl';
import { Typography, List, ListItem, mapboxgl } from '../../utils/material';
import React, { useRef, useEffect, useState, SetStateAction } from 'react';
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
  currentWP: number;
  passCoords?: (long: number, lat: number) => void;
  waypoints: Waypoint[];
  setInstructions: (instructions: JSX.Element | null) => void;
};

function CurrentMap(props: MapProps): JSX.Element {
  const { setInstructions, currentWP, waypoints } = props;
  const mapContainer = useRef('');
  const map = useRef<null | mapboxgl.Map>(null);

  const [lng, setLng] = useState(-90.09);
  const [lat, setLat] = useState(29.96);
  const [zoom, setZoom] = useState(11.5);

  const [currentWPlong, setCurrentWPlong] = useState(waypoints[currentWP].long);
  const [currentWPlat, setCurrentWPlat] = useState(waypoints[currentWP].lat);
  const [startCoords, setStartCoords] = useState<null | number[]>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current?.on('move', () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });

    map.current?.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    const nav = new mapboxgl.NavigationControl();
    map.current?.addControl(nav, 'top-right');

    map.current?.on('load', () => {
      // Add ending point to the map (basically sets a gold circle under marker)
      map.current?.addLayer({
        id: 'end',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [currentWPlong, currentWPlat],
                },
              },
            ],
          },
        },
        paint: {
          'circle-radius': 8,
          'circle-color': 'gold',
        },
      });
      // now routing is just on click events, eventually tie this into Geolocation
      map.current?.on('click', (event) => {
        const coords: number[] = Object.keys(event.lngLat).map(
          (key) => event.lngLat[key]
        );
        setStartCoords(coords);

        const start = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coords,
              },
            },
          ],
        };
        if (map.current?.getLayer('start')) {
          map.current?.getSource('start').setData(start);
        } else {
          map.current?.addLayer({
            id: 'start',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'Point',
                      coordinates: coords,
                    },
                  },
                ],
              },
            },
            paint: {
              'circle-radius': 10,
              'circle-color': '#3887be',
            },
          });
        }
        // getRoute(coords, [currentWPlong, currentWPlat]);
      });
    });
  }, []);

  useEffect(() => {
    setCurrentWPlong(waypoints[currentWP].long);
    setCurrentWPlat(waypoints[currentWP].lat);

    showMarkers(waypoints.slice(0, currentWP), 'gray');
    showMarkers([waypoints[currentWP]], 'gold');
    showMarkers(waypoints.slice(currentWP + 1), '#2196f3');

    map.current?.flyTo({
      center: [currentWPlong, currentWPlat],
      zoom: 13,
    });
  }, [currentWP, currentWPlong, currentWPlat]);

  useEffect(() => {
    getRoute(startCoords, [currentWPlong, currentWPlat]);
  }, [currentWPlong, currentWPlat, startCoords]);

  // create a function to make a directions request
  async function getRoute(start, end = [currentWPlong, currentWPlat]) {
    if (!start || !currentWPlong || !currentWPlat) return;

    // make a directions request using cycling profile

    //Start is currently just a click event on map, tie this into GeoLocation
    //End is based on Current Waypoint, rendered in Gold
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route,
      },
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.current?.getSource('route')) {
      map.current?.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.current?.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson,
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });
    }

    const steps = data.legs[0].steps;
    const tripInstructions = steps.map((step, i) => (
      <ListItem sx={{ display: 'list-item' }} key={i}>
        {step.maneuver.instruction}
      </ListItem>
    ));

    setInstructions(
      <>
        <Typography variant='body1' fontWeight='bold'>
          Trip duration: {Math.floor(data.duration / 60)} min 🚴{' '}
        </Typography>
        <List sx={{ listStyle: 'decimal' }}>{tripInstructions}</List>
      </>
    );
  }

  function showMarkers(points: Waypoint[], color: string) {
    return points.map((marker) => {
      //use setHTML or setDOMContent to add each tour with a click event
      const markerContent = `
        <div>
          <h3>${marker.waypointName}</h3>
          <div>${marker.description}</div>
        </div>
      `;
      const popUp = new mapboxgl.Popup({ offset: 25 }).setHTML(markerContent);
      const marker1 = new mapboxgl.Marker({
        color,
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

export default CurrentMap;
