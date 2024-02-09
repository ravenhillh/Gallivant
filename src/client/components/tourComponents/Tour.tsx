import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Waypoint from './Waypoint';
import Modal from './Modal';
import Map from '../Map';

const Tour = (): JSX.Element => {
  // useParam hook to retrieve specific Tour
  const { id } = useParams();
  type Tour = {
    id: number;
    tourName: string;
    description: string;
  };
  const [tour, setTour] = useState<Tour>();
  const [creator, setCreator] = useState<string>('');

  //state for Waypoints array, modal pop-up dialog
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [wpName, setWpName] = useState<string>('');
  const [wpDesc, setWpDesc] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);

  //initial useEffect, not sure how to use params hook from loader atm
  useEffect(() => {
    getTour(id);
  }, []);

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

  const getCreator = (userId: number | undefined) => {
    axios(`/db/tourCreatedBy/${userId}`)
      .then(({ data }) => {
        setCreator(data[0].username);
      })
      .catch((err: string) => console.error('Could not GET user by id: ', err));
  };

  // and post waypoint to db
  const postWaypoint = () => {
    setWaypoints((prevState) => prevState.concat('Coordinates Placeholder'));
  };

  // change event handlers for modal inputs
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

  return (
    <div>
      <h1>Tours</h1>
      <Map />

      <h2>Tour Name: {tour?.tourName}</h2>
      <p>Description: {tour?.description}</p>
      <p>Created by: {creator}</p>

      <Modal openModal={modal} closeModal={() => setModal(false)}>
        <label>Waypoint Name:</label>
        <input
          type='text'
          value={wpName}
          onChange={(e) => handleChange(e, setWpName)}
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
      <ol>
        {waypoints.map((wp, i) => (
          <Waypoint key={i} waypoint={wp}></Waypoint>
        ))}
      </ol>
    </div>
  );
};

export default Tour;
