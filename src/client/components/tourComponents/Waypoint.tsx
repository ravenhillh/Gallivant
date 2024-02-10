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
  waypoint: Waypoint;
  id_tour: string | undefined;
  getTourWPs: (tourId: string | undefined) => void;
}

const Waypoint = (props: WaypointProps): JSX.Element => {
  const { waypoint, id_tour, getTourWPs } = props;
  const [modal, setModal] = useState<boolean>(false);
  // const [name, setName] = useState<string>('');
  // const [description, setDescription] = useState<string>('');

  // const handleChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   setState: React.Dispatch<string>
  // ) => {
  //   setState(event.target.value);
  // };

  const deleteWaypoint = (wpId: number) => {
    axios
      .delete(`/db/waypoint/${wpId}/${id_tour}`)
      .then((res) => {
        if (res.status === 200) {
          setModal(false);
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
      <button onClick={() => setModal(true)}>🗑️</button>
      <Modal openModal={modal} closeModal={() => setModal(false)}>
        <div>Are you sure you want to delete Waypoint?</div>
        <button onClick={() => deleteWaypoint(waypoint.id)}>
          Delete waypoint
        </button>
      </Modal>
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
