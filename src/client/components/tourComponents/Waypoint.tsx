import React, { useState } from 'react';

type Waypoint = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};

const Waypoint = (props: { waypoint: Waypoint }): JSX.Element => {
  const { waypoint } = props;
  // const [name, setName] = useState<string>('');
  // const [description, setDescription] = useState<string>('');

  // const handleChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   setState: React.Dispatch<string>
  // ) => {
  //   setState(event.target.value);
  // };

  return (
    <li>
      <h3>Place: {waypoint.waypointName}</h3>
      <div>description: {waypoint.description}</div>
      <div>Long: {waypoint.long}, Lat: {waypoint.lat}</div>
      {/* <input
        type='text'
        placeholder='Give the waypoint a name'
        onChange={(e) => handleChange(e, setName)}
      />
      <input
        type='text'
        placeholder='Describe the place'
        onChange={(e) => handleChange(e, setDescription)}
      /> */}
    </li>
  );
};

export default Waypoint;
