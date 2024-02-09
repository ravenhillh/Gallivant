import React, { useState } from 'react';

const Waypoint = (props: { waypoint: string }): JSX.Element => {
  const { waypoint } = props;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<string>
  ) => {
    setState(event.target.value);
  };

  return (
    <li>
      {waypoint}
      <h3>Place: {name}</h3>
      <div>description: {description}</div>
      <input
        type='text'
        placeholder='Give the waypoint a name'
        onChange={(e) => handleChange(e, setName)}
      />
      <input
        type='text'
        placeholder='Describe the place'
        onChange={(e) => handleChange(e, setDescription)}
      />
    </li>
  );
};

export default Waypoint;
