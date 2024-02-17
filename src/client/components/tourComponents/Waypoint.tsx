import React, { useState } from 'react';
import axios from 'axios';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import Modal from './Modal';
import Gallery from '../Gallery';

type Waypoint = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};
interface WaypointProps {
  waypoint: Waypoint;
  id_tour: string | undefined;
  getTourWPs: (tourId: string | undefined) => void;
  edit: boolean;
}

const Waypoint = (props: WaypointProps): JSX.Element => {
  const { waypoint, id_tour, getTourWPs, edit } = props;
  const [delModal, setDelModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  const [waypointName, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

  const openEditModal = () => {
    setEditModal(true);
    setName(waypoint.waypointName);
    setDescription(waypoint.description);
  };

  const editWaypoint = (wpId: number) => {
    axios
      .put(`/db/waypoint/${wpId}`, {
        waypointName,
        description,
      })
      .then((res) => {
        if (res.status === 200) {
          setEditModal(false);
          getTourWPs(id_tour);
        }
      })
      .catch((err: string) => console.error('Could not EDIT waypoint: ', err));
  };

  const deleteWaypoint = (wpId: number) => {
    axios
      .delete(`/db/waypoint/${wpId}/${id_tour}`)
      .then((res) => {
        if (res.status === 200) {
          setDelModal(false);
          getTourWPs(id_tour);
        }
      })
      .catch((err: string) =>
        console.error('Could not DELETE waypoint: ', err)
      );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          {<RoomOutlinedIcon />} {waypoint.waypointName}
        </Typography>
        <Gallery waypoint={waypoint} edit={edit} />
        <Typography variant='subtitle1' gutterBottom>
          {waypoint.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='flex-end'
        >
          <Grid item>
            {edit && (
              <Fab
                aria-label='delete'
                size='small'
                color='error'
                onClick={() => setDelModal(true)}
              >
                <DeleteIcon />
              </Fab>
            )}
          </Grid>
          <Grid item>
            {edit && (
              <Fab
                aria-label='edit'
                color='primary'
                size='small'
                onClick={openEditModal}
              >
                <EditIcon />
              </Fab>
            )}
          </Grid>
        </Grid>
      </CardActions>

      <Modal
        className='delete-waypoint-modal'
        openModal={delModal}
        closeModal={() => setDelModal(false)}
      >
        <Typography variant='body1'>
          Are you sure you want to delete Waypoint?
        </Typography>
        <br />
        <Button
          variant='contained'
          color='error'
          size='small'
          startIcon={<DeleteIcon />}
          onClick={() => deleteWaypoint(waypoint.id)}
        >
          Delete Waypoint
        </Button>
      </Modal>

      <Modal
        className='edit-waypoint-modal'
        openModal={editModal}
        closeModal={() => setEditModal(false)}
      >
        <div>
          <TextField
            autoFocus
            fullWidth
            label='Change the name'
            value={waypointName}
            onChange={(e) => handleChange(e, setName)}
            helperText='Name'
          />
        </div>
        <br />
        <div>
          <TextField
            autoFocus
            fullWidth
            multiline
            label='Change the description'
            value={description}
            onChange={(e) => handleChange(e, setDescription)}
            helperText='Description'
          />
        </div>
        <br />
        <Button
          size='small'
          variant='contained'
          startIcon={<EditIcon />}
          onClick={() => editWaypoint(waypoint.id)}
        >
          Edit
        </Button>
      </Modal>
    </Card>
  );
};

export default Waypoint;
