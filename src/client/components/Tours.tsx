import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ExploreIcon from '@mui/icons-material/Explore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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
    axios
      .post('/db/tours', { tour: { tourName, description } })
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
      <Button
        variant='contained'
        color='primary'
        startIcon={<AddIcon />}
        onClick={createTourBtnClick}
      >
        Create Tour
      </Button>
      <List>
        {tours.map((tour, i) => {
          return (
            <ListItem key={i}>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText
                primary={<Link to={`/tour/${tour.id}`}>{tour.tourName}</Link>}
                secondary={tour.description}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Tours;
