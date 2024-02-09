import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Waypoint from './Waypoint';
import Map from '../Map';

const Tours = (): JSX.Element => {
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const { id } = useParams();
  type Tour = {
    id: number;
    tourName: string;
    description: string;
  };
  const [tour, setTour] = useState<Tour>();

  useEffect(() => {
    getTour(id);
  }, []);

  const getTour = (id: string|undefined) => {
    axios(`/db/tour/${id}`)
      .then(({data}) => {
        console.log(data[0]);
        setTour(data[0]);
      })
      .catch((err: string) => console.error('Could not GET tour by id: ', err));
  };

  const waypointBtnClick = () => {
    setWaypoints((prevState) => prevState.concat('Coordinates Placeholder'));
  };

  // const handleChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   setState: React.Dispatch<string>
  // ) => {
  // setState(event.target.value);
  // };

  return (
    <div>
      <h1>Tours</h1>
      <Map />
      <br></br>
      <h2>Tour Name: {tour?.tourName}</h2>
      <p>Description: {tour?.description}</p>

      <button onClick={waypointBtnClick}>Add Waypoint</button>
      <ol>
        {waypoints.map((wp, i) => (
          <Waypoint key={i} waypoint={wp}></Waypoint>
        ))}
      </ol>
    </div>
  );
};

export default Tours;
