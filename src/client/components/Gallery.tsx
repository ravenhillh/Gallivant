import React, { useState } from 'react';
import axios from 'axios';

interface ImageProperties {
  createdAt: string;
  id: number;
  id_user: number;
  largeImg: string;
  thumbnail: null;
  updatedAt: string;
}

const Gallery = () => {

  const [images, setImages] = useState<ImageProperties[]>([]);
  // function to send GET request to db
  // should grab photos by user id
  // should be able to eventually grab by other foreign ids
  const getImages = () => {
    axios.get('images/user')
      .then(({data}) => {
        console.log('GET data ', data);
        setImages(data);
      })
      .catch(err => console.error('Could not GET imgs ', err));
  };

  const handleClick = (e) => {
    e.preventDefault();
    getImages();
  };

  return (
    <div>
      <h2>Gallery</h2>
      <button type="submit" onClick={handleClick}>Get Images</button>
      <ul>
        {
          images.map((image) => (
            <li key={`${image.id}`}>
              <img src={`/api/images/${image.largeImg}`} />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default Gallery;
