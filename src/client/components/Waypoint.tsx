import React, { useState } from 'react';

const Waypoint = ({ waypoint }): JSX.Element => {
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
      <h3>
        Place: {name}
      </h3>
      <div>
        description: {description}
      </div>
    </li>
  );
};

export default Waypoint;
