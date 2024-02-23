import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
  Button,
  AddIcon,
  ExploreIcon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Typography,
} from '../utils/material';

import Modal from './tourComponents/Modal';
import Voice from './tourComponents/Voice';

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

  return (
    <div>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='flex-end'
      >
        <Grid item>
          <Typography fontWeight='bold' variant='h2'>
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
        <Typography variant='body1'>
          Please give tour a name and description.
        </Typography>
        <br />
      </Modal>

      <Modal openModal={createModal} closeModal={() => setCreateModal(false)}>
        <div>
          <Voice
            type='name'
            label='Give your tour a name'
            helperText='Tour Description'
            textInput={tourName}
            setTextInput={setName}
          />
        </div>
        <br />
        <div>
          <Voice
            type='description'
            label='Give your tour a description'
            helperText='Tour Description'
            textInput={description}
            setTextInput={setDescription}
          />
        </div>
        <br />

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
