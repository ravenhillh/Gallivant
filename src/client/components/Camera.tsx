import React from 'react';
import { useState } from 'react';

// make state photo variable that holds photo file
function Camera():JSX.Element {
  // image is a 'preview', before image is selected to be POSTED to database
  const [image, setImage] = useState('');
  // use ternary to hide img tag until image value has been set?

  // function to access photo data
  // check for env or user id
  // set id to be dynamic, either environment or user (button click)
  // after lunch fix errors

  const sendPic = (e) => {
    // access image file from file picker
    const selectedFile = e.target.files[0];
    // File Reader to read selectedFile as base 64
    const reader = new FileReader();

    if (selectedFile) {
      // read result as data url
      reader.readAsDataURL(selectedFile);
    }

    // setState and read generate dataURL
    reader.addEventListener('load', () => {

      setImage(reader.result as string);
      // console.log(reader.result);
      }, false);

  };

  const handleChange = (e) => {
    // prevent default to stop loop
    e.preventDefault();
    sendPic(e);
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
        onChange={handleChange}
      />
      <img src={image} height="200" alt="Image preview"/>
    </div>
  );
}

export default Camera;
