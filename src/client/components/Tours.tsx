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
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Modal from './tourComponents/Modal';

const Tours = (): JSX.Element => {
  type Tour = {
    id: number;
    tourName: string;
    description: string;
  };

  const [tours, setTours] = useState<Tour[]>([]);
  const [description, setDescription] = useState<string>('');
  const [tourName, setName] = useState<string>('');

  const [createModal, setCreateModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

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
    if (tourName && description) {
      axios
        .post('/db/tours', { tour: { tourName, description } })
        .then((res) => {
          if (res.status === 201) {
            getAllTours();
            setName('');
            setDescription('');
            setCreateModal(false);
          }
        })
        .catch((err: string) => console.error('Could not POST tour: ', err));
    } else {
      setErrorModal(true);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

  return (
    <div>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='flex-end'
      >
        <Grid item>
          <Typography fontWeight="bold" variant="h2">
            Tours
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => setCreateModal(true)}
          >
            Create Tour
          </Button>
        </Grid>
      </Grid>

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

      <Modal openModal={errorModal} closeModal={() => setErrorModal(false)}>
        <div>Please give tour a name and description.</div>
      </Modal>

      <Modal openModal={createModal} closeModal={() => setCreateModal(false)}>
        <div>
          <label>Tour name:</label>
          <input
            autoFocus
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
          size='small'
          color='primary'
          startIcon={<AddIcon />}
          onClick={createTourBtnClick}
        >
          Create Tour
        </Button>
      </Modal>
    </div>
  );
};

export default Tours;
