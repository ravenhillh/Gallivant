import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// import Waypoint from './tourComponents/Waypoint';
// import Map from './Map';

const Tours = (): JSX.Element => {
  type Tour = {
    id: number;
    tourName: string;
    description: string;
  };

  const [tours, setTours] = useState<Tour[]>([]);
  const [description, setDescription] = useState<string>('');
  const [tourName, setName] = useState<string>('');

  useEffect(() => {
    getAllTours();
  }, []);

  const getAllTours = () => {
    axios('/db/tours')
      .then(({ data }) => {
        setTours(data);
      })
      .catch((err: string) => console.error('Could not GET all tours: ', err));
  };

  const createTourBtnClick = () => {
    axios.post('/db/tours', { tour: { tourName, description }})
      .then((res) => {
        if (res.status === 201) {
          getAllTours();
          setName('');
          setDescription('');
        }
      })
      .catch((err: string) => console.error('Could not POST tour: ', err));
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
        {tours.map((tour, i) => {
          return (
          <li key={i}>
            <Link to={`/tour/${tour.id}`}>{tour.tourName}</Link>
          </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tours;
