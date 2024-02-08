import React from 'react';
import { useState } from 'react';
import axios from 'axios';

// make state photo variable that holds photo file
function Camera():JSX.Element {
  // image is a 'preview', before image is selected to be POSTED to database
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  // use ternary to hide img tag until image value has been set?

  // function to access photo data
  // check for env or user id
  // set id to be dynamic, either environment or user (button click)
  // after lunch fix errors

  // axios post request to s3
  // will need button to invoke
  const postBucket = (name:string, imageData:string) => {
    axios.post('/api/images', {
      imageName: name,
      base64: imageData
    });
  };

  const sendPic = (e: React.ChangeEvent<HTMLInputElement>) => {
    // access image file from file picker
    const selectedFile = e.target.files![0];
    console.log(selectedFile);
    setName(selectedFile.name);
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

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    // prevent default to stop loop
    e.preventDefault();
    sendPic(e);
  };

  const handleClick = () => {
    // call axios function
    postBucket(name, image);
    // console.log(image);
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
      <button onClick={handleClick}>Send</button>
      <img src="/api/images/Cathedral-and-the-Bazaar-book-cover.jpg"/>
    </div>
  );
}

export default Camera;
