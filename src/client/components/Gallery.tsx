import React, { useState, useEffect, StrictMode } from 'react';
import axios from 'axios';
// import Waypoint from './tourComponents/Waypoint';


interface ImageProperties {
  createdAt: string;
  id: number;
  id_user: number;
  largeImg: string;
  thumbnail: null;
  updatedAt: string;
}

const Gallery = (props) => {
  const { waypoint } = props;
  const [images, setImages] = useState<ImageProperties[]>([]);

  // function to send GET request to db
  // const getImages = () => {
  //   axios.get('/images/user')
  //     .then(({data}) => {
  //       // console.log('GET data ', data);
  //       setImages(data);
  //     })
  //     .catch(err => console.error('Could not GET imgs ', err));
  // };

  const getImagesWP = (waypointId) => {
    // console.log('wp id ', waypointId);
    axios.get(`/images/waypoint/${waypointId}`)
      .then(({data}) => {
        // console.log('data ', data);
        setImages(data);

      })
      .catch(err => console.error('could not get images by waypoint Id', err));
  };

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   // getImages();
  //   getImagesWP(props.waypoint.id);
  // };

  const deleteImage = (waypointId, imageId) => {

    axios.delete(`/images/waypoint/${waypointId}/${imageId}`)
      .catch((err) => console.error('Delete unsuccessful ', err));

  };

 
  useEffect(() => {
      getImagesWP(waypoint.id);
    }, []);
  
  return (
    <div>
      <StrictMode>
      {/* <button type="submit" onClick={handleClick}>Get Images</button> */}
      <ul>
        {
          images.map((image) => (
            <li key={`${image.id}`}>
              <img src={`/api/images/${image.largeImg}`} style={{ width: '100px', height: 'auto' }} />
              <button 
                type="submit" 
                onClick={(e) => {
                  e.preventDefault();
                  deleteImage(waypoint.id, image.id);
                }}
              >❌</button>
            </li>
          ))
        }
      </ul>
      </StrictMode>
    </div>
  );
};



export default Gallery;
