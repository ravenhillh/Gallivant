import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Waypoint from './tourComponents/Waypoint';
import Map from './Map';

const Tours = (): JSX.Element => {
  type Tour = {
    name: string;
    description: string;
  };

  const [tours, setTours] = useState<Tour[]>([]);
  const [description, setDescription] = useState<string>('');
  const [tourName, setName] = useState<string>('');

  const createTourBtnClick = () => {
    setTours((prevState) => prevState.concat({ name: tourName, description }));
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
      <div>
        <label>Tour name:</label>
        <input
          type='text'
          value={tourName}
          onChange={(e) => handleChange(e, setName)}
        />
      </div>
      <div>
        <label>Tour description:</label>
        <input
          type='text'
          value={description}
          onChange={(e) => handleChange(e, setDescription)}
        />
      </div>
      <button onClick={createTourBtnClick}>Create Tour</button>
      <ul>
        {tours.map((tour, i) => (
          <li key={i}>
            <Link to="">{tour.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tours;
