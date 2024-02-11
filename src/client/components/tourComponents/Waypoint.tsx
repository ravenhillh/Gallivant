import React, { useState } from 'react';
import axios from 'axios';

import Modal from './Modal';

type Waypoint = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};
interface WaypointProps {
  waypoint: object | Waypoint;
  id_tour: string | undefined;
  getTourWPs: (tourId: string | undefined) => void;
}

const Waypoint = (props: WaypointProps): JSX.Element => {
  const { waypoint, id_tour, getTourWPs } = props;
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
    axios.put(`/db/waypoint/${wpId}`, {
      waypointName, description
    })
    .then((res) => {
      if (res.status === 200) {
        setEditModal(false);
        getTourWPs(id_tour);
      }
    })
    .catch((err: string) =>
      console.error('Could not EDIT waypoint: ', err)
    );
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
      <h3>Place: {waypoint.waypointName}</h3>
      <div>description: {waypoint.description}</div>
      <div>
        Long: {waypoint.long}, Lat: {waypoint.lat}
      </div>

      <button onClick={() => setDelModal(true)}>🗑️</button>
      <Modal
        className='delete-waypoint-modal'
        openModal={delModal}
        closeModal={() => setDelModal(false)}
      >
        <div>Are you sure you want to delete Waypoint?</div>
        <button onClick={() => deleteWaypoint(waypoint.id)}>
          Delete waypoint
        </button>
      </Modal>

      <button onClick={openEditModal}>Edit</button>
      <Modal
        className='edit-waypoint-modal'
        openModal={editModal}
        closeModal={() => setEditModal(false)}
      >
        <input
          type='text'
          value={waypointName}
          placeholder='Give the waypoint a name'
          onChange={(e) => handleChange(e, setName)}
        />
        <input
          type='text'
          value={description}
          placeholder='Describe the place'
          onChange={(e) => handleChange(e, setDescription)}
        />
        <button onClick={() => editWaypoint(waypoint.id)}>
          Edit waypoint
        </button>
      </Modal>
    </li>
  );
};

export default Waypoint;
