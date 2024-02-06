import React from 'react';
import { useState } from 'react';

// make state photo variable that holds photo file
function Camera():JSX.Element {

  // function to access photo data
  // check for env or user id

  const fileInput = document.getElementById('environment');

  const sendPic = () => {
    // let file = fileInput.files[0];
    console.log(fileInput);
 
  };

  const handleChange = (e) => {
    e.preventDefault();
    sendPic();
  };

  return (
    <div>
      <label htmlFor="environment">Capture environment:</label>
      <br />
      <input
        type="file"
        id="environment"
        capture="environment"
        accept="image/*"
        onChange={handleChange}
      />
      <br />
      <label htmlFor="user">Capture user:</label>
      <br />
      <input
        type="file"
        id="user"
        capture="user"
        accept="image/*"
      />
    </div>
  );
}

export default Camera;
