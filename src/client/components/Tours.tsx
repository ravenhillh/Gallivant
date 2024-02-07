import React, { useState } from 'react';

import Waypoint from './Waypoint';

const Tours = (): JSX.Element => {
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [tourName, setName] = useState<string>('');

  const waypointBtnClick = () => {
    setWaypoints((prevState) => prevState.concat('Coordinates Placeholder'));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

  return (
    <div>
      <h1>Tours</h1>
      <div>Map goes here.</div>
      <h2>Tour Name: {tourName}</h2>
      <p>Description: {description}</p>
      <div>
        <label>Tour name:</label>
        <input type='text' value={tourName} onChange={(e) => handleChange(e, setName)}/>
      </div>
      <div>
        <label>Tour description:</label>
        <input type='text' value={description} onChange={(e) => handleChange(e, setDescription)}/>
      </div>
      <button onClick={waypointBtnClick}>Add Waypoint</button>
      <ol>
        {waypoints.map((wp, i) => <Waypoint key={i} waypoint={wp}></Waypoint>)}
      </ol>
    </div>
  );
};

export default Tours;
