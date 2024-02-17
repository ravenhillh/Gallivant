import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';
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
  const { waypoint, edit, editModal } = props;
  const [images, setImages] = useState<ImageProperties[]>([]);
  // console.log(props);

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

  const deleteImage = (imageId) => {

    axios.delete(`/images/${imageId}`)
      .catch((err) => console.error('Delete unsuccessful ', err));

  };

 
  useEffect(() => {
      getImagesWP(waypoint.id);
    }, [editModal]);

  
  return (
    <div>
      {/* <button type="submit" onClick={handleClick}>Get Images</button> */}
      <ImageList>
        {
          images.map((image) => (
            <li key={`${image.id}`}>
              <img src={`/api/images/${image.largeImg}`} style={{ width: '150px', height: 'auto' }} />
              {edit && <Button
                id="delete-image"
                // variant="outlined"
                size="small"
                type="submit"
                fullWidth={false}
                onClick={(e) => {
                  e.preventDefault();
                  deleteImage(image.id);
                }}
              ><RemoveCircleIcon /></Button>}
            </li>
          ))
        }
      </ImageList>
    </div>
  );
};



export default Gallery;
