import React, { useState } from 'react';
import axios from 'axios';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';

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
    <li>
      <h3>{waypoint.waypointName}</h3>
      <Gallery waypoint={waypoint} edit={edit} />
      <div>{waypoint.description}</div>
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

      <Modal
        className='delete-waypoint-modal'
        openModal={delModal}
        closeModal={() => setDelModal(false)}
      >
        <div>Are you sure you want to delete Waypoint?</div>
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
        <label>Name:</label>
        <input
          type='text'
          value={waypointName}
          placeholder='Give the waypoint a name'
          onChange={(e) => handleChange(e, setName)}
        />
        <br></br>
        <label>Description:</label>
        <input
          type='text'
          value={description}
          placeholder='Describe the place'
          onChange={(e) => handleChange(e, setDescription)}
        />
        <Button
          size='small'
          variant='contained'
          startIcon={<EditIcon />}
          onClick={() => editWaypoint(waypoint.id)}
        >
          Edit
        </Button>
      </Modal>
    </li>
  );
};

export default Waypoint;
