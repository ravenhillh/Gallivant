import React from 'react';
import { useState } from 'react';

// make state photo variable that holds photo file
function Camera():JSX.Element {
  const [image, setImage] = useState('');

  // function to access photo data
  // check for env or user id
  // set id to be dynamic, either environment or user

  const sendPic = () => {
    // const preview:HTMLElement | null = document.querySelector('img');
    // let file = fileInput.files[0];
    const fileInput = document.getElementById('environment');
    const selectedFile = fileInput!.files[0];
    // console.log(selectedFile);
    // fileInput.onchange = () => {
    //   const selectedFile = fileInput.files[0];
    //   // console.log(selectedFile);
    //   // setImage(selectedFile.)
    // };
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      // convert image file to base64 string
      // console.log(typeof reader.result);
      setImage(reader.result);
      // preview!.src = reader.result;
      // console.log(preview.src)
      }, false);

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
 
  };

  const handleChange = (e) => {
    // prevent default to stop loop
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
      <img src={image} height="200" alt="Image preview"/>
    </div>
  );
}

export default Camera;
