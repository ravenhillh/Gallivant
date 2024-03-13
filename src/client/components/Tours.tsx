import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import {
  Button,
  AddIcon,
  FormControl,
  InputLabel,
  List,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '../utils/material';

import Categories from './Categories';
import Voice from './tourComponents/Voice';
import CustomModal from './tourComponents/Modal';
import TourLink from './TourLink';

type Tour = {
  id: number;
  tourName: string;
  description: string;
};

const Tours = (): JSX.Element => {
  const { cat } = useParams();
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);

  // state for creating a new Tour
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [tourName, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [errorModal, setErrorModal] = useState<boolean>(false);

  //array of categories for create modal
  const categories = [
    'arts & culture',
    'entertainment',
    'food & drink',
    'history',
    'nightlife',
    'nature & outdoors',
    'miscellaneous',
  ];

  //getTours now checks parameters to determine which endpoint to send request to
  useEffect(() => {
    getTours();
  }, []);

  //if cat is all, queries for all tours, else getToursByCat basically
  const getTours = () => {
    axios
      .get(cat === 'all' ? '/db/tours/' : `/db/tours/${cat}`)
      .then(({ data }) => {
        setTours(data);
      })
      .catch((err: string) => console.error('Could not GET all tours: ', err));
  };

  const createTourBtnClick = () => {
    if (tourName && description && category) {
      axios
        .post('/db/tours', { tour: { tourName, description, category } })
        .then((res) => {
          if (res.status === 201) {
            getTours();
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

  // createTourModal category drop down handler
  const handleCatChange = (event) => {
    setCategory(event.target.value as string);
  };

  return (
    <div>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Grid item>
          <Typography 
            fontSize='48px' 
            fontWeight='bold' 
            variant='h2'
            sx={{ fontSize: { xs: '40px', md: '44px', lg: '48px'}}}
          >
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
      <Categories categories={categories} category={cat} getTours={getTours} />

      <List>
        {tours.map((tour, i) => {
          return (
            <TourLink key={i} tour={tour} />
          );
        })}
      </List>

      <CustomModal
        openModal={errorModal}
        closeModal={() => setErrorModal(false)}
      >
        <Typography variant='body1'>
          Please give tour a name, description, and select a category.
        </Typography>
      </CustomModal>

      <CustomModal
        openModal={createModal}
        closeModal={() => setCreateModal(false)}
      >
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

        <Voice
          type='description'
          label='Give your tour a description'
          helperText='Tour Description'
          textInput={description}
          setTextInput={setDescription}
        />
        <br />
        <br />

        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Category</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={category}
            label='Category'
            onChange={handleCatChange}
          >
            {categories.map((category, i) => (
              <MenuItem key={i} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
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
      </CustomModal>
    </div>
  );
};

export default Tours;
