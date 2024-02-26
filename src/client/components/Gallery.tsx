import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Button, 
  RemoveCircleIcon, 
  CloseIcon,
  IconButton,
  Snackbar,
  ImageList } from '../utils/material';
import Camera from './Camera';
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
  const { waypoint, edit } = props;
  const [images, setImages] = useState<ImageProperties[]>([]);
  const [open, setOpen] = useState(false);
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
    axios
      .get(`/images/waypoint/${waypointId}`)
      .then(({ data }) => {
        // console.log('data ', data);
        setImages(data);
      })
      .catch((err) =>
        console.error('could not get images by waypoint Id', err)
      );
  };

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   // getImages();
  //   getImagesWP(props.waypoint.id);
  // };

  const deleteImage = (imageId) => {
    axios
      .delete(`/images/${imageId}`)
      .catch((err) => console.error('Delete unsuccessful ', err));
  };

  useEffect(() => {
    getImagesWP(waypoint.id);
  }, []);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    getImagesWP(waypoint.id);
  };

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <div>
      {/* <button type="submit" onClick={handleClick}>Get Images</button> */}
      {edit && (images.length ? null : <Camera waypoint={waypoint} getImagesWP={getImagesWP} />)}
      <ImageList>
        {images.map((image) => (
          <li key={`${image.id}`}>
            <img
              src={`/api/images/${image.largeImg}`}
              style={{ width: '250px', height: 'auto' }}
            />
            {edit && (
              <Button
                id='delete-image'
                // variant="outlined"
                size='small'
                type='submit'
                fullWidth={false}
                onClick={(e) => {
                  e.preventDefault();
                  deleteImage(image.id);
                  handleClick();
                }}
              >
                <RemoveCircleIcon />
              </Button>
            )}
          </li>
        ))}
      </ImageList>
      <Snackbar 
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Image deleted"
        action={action}
      />
    </div>
  );
};

export default Gallery;
