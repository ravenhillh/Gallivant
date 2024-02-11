import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Waypoint from './Waypoint';
import Modal from './Modal';
import Map from '../Map';

type Tour = {
  id: number;
  tourName: string;
  description: string;
};

const Tour = (): JSX.Element => {
  // useParam hook to retrieve specific Tour
  const { id } = useParams();
  const [tour, setTour] = useState<Tour>();
  const [creator, setCreator] = useState<string>('');

  //state for Waypoints array, modal pop-up dialog
  const [waypoints, setWaypoints] = useState<object[]>([]);
  const [wpName, setWpName] = useState<string>('');
  const [wpDesc, setWpDesc] = useState<string>('');
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);
  const [modal, setModal] = useState<boolean>(false);

  //state for draggable sorting of waypoint list
  const [dragStart, setDragStart] = useState<number>(0);
  const [dragOver, setDragOver] = useState<number>(0);

  //initial useEffect, not sure how to use params hook from loader atm
  useEffect(() => {
    getTour(id);
    getTourWPs(id);
  }, []);

  // change event handlers for modal inputs
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

  // function passed into Map to track gps coordinates for waypoint creation
  const passCoords = (long: number, lat: number) => {
    setLong(long);
    setLat(lat);
  };

  // onDragEnd handler that sorts waypoints array into new order
  const onDragEnd = () => {
    const newOrder = [...waypoints]; // spread state into new array to not mutate
    const dragged = newOrder.splice(dragStart, 1); // returns the dragged item
    newOrder.splice(dragOver, 0, ...dragged); // insert the dragged item into new position in array

    axios.put('/db/waypointsOrder/', { newOrder, tourId: id }) // pass the newly-ordered array (plus tourId to update join table as well)
      .then((res) => {
        if (res.status === 200) {
          getTourWPs(id); // get updated waypoints (record sorting handled by query server-side)
        }
      })
      .catch((err: string) => console.error('Could not PUT updates on waypoints: ', err));
  };

  // axios requests to db to get tour by id
  const getTour = (id: string | undefined) => {
    axios(`/db/tour/${id}`)
      .then(({ data }) => {
        setTour(data[0]);
        const userId = data[0].id_createdByUser;
        getCreator(userId);
      })
      .catch((err: string) => console.error('Could not GET tour by id: ', err));
  };

  // gets username of tour creator
  const getCreator = (userId: number | undefined) => {
    axios(`/db/tourCreatedBy/${userId}`)
      .then(({ data }) => {
        setCreator(data[0].username);
      })
      .catch((err: string) => console.error('Could not GET user by id: ', err));
  };

  // gets waypoints associated with the particular tourId
  const getTourWPs = (tourId: string | undefined) => {
    axios(`/db/tourWaypoints/${tourId}`)
      .then(({ data }) => {
        setWaypoints(data);
      })
      .catch((err: string) =>
        console.error('Could not GET waypoints by tour id: ', err)
      );
  };

  // and post waypoint to db
  const postWaypoint = () => {
    axios
      .post('/db/waypoint/', {
        waypoint: {
          waypointName: wpName,
          description: wpDesc,
          long,
          lat,
        },
        id_tour: id,
      })
      .then((res) => {
        if (res.status === 201) {
          setModal(false);
          setWpName('');
          setWpDesc('');
          getTourWPs(id);
        }
      })
      .catch((err: string) => console.error('Could not POST waypoint: ', err));
  };

  return (
    <div>
      <h1>Tours</h1>
      <Map waypoints={waypoints} passCoords={passCoords} />

      <h2>Tour Name: {tour?.tourName}</h2>
      <p>Description: {tour?.description}</p>
      <p>Created by: {creator}</p>

      <Modal openModal={modal} closeModal={() => setModal(false)}>
        <div>
          Long: {long}, Lat: {lat}
        </div>
        <label>Waypoint Name:</label>
        <input
          type='text'
          value={wpName}
          onChange={(e) => handleChange(e, setWpName)}
          autoFocus
        />
        <label>Waypoint Description:</label>
        <input
          type='text'
          value={wpDesc}
          onChange={(e) => handleChange(e, setWpDesc)}
        />
        <br></br>
        <button onClick={postWaypoint}>Save waypoint</button>
      </Modal>

      <button onClick={() => setModal(true)}>Add Waypoint</button>
      <ol className='waypoint-container'>
        {waypoints.map((wp, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => setDragStart(i)}
            onDragEnter={() => setDragOver(i)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <Waypoint
              getTourWPs={getTourWPs}
              id_tour={id}
              waypoint={wp}
            ></Waypoint>
          </div>
        ))}
      </ol>
    </div>
  );
};

export default Tour;
