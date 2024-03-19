import React, { lazy, useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CloseIcon,
  DeleteIcon,
  IconButton,
  Snackbar,
} from '../utils/material';
const Camera = lazy(() => import('./Camera'));

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

  // GET Image by Waypoint Id
  const getImagesWP = (waypointId) => {
    axios
      .get(`/images/waypoint/${waypointId}`)
      .then(({ data }) => {
        setImages(data);
      })
      .catch((err) =>
        console.error('could not get images by waypoint Id', err)
      );
  };

  const deleteImage = (imageId) => {
    axios
      .delete(`/images/${imageId}`)
      .catch((err) => console.error('Delete unsuccessful ', err));
  };

  useEffect(() => {
    getImagesWP(waypoint.id);
  }, [waypoint.id]);

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
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </Fragment>
  );

  return (
    <div>
      {edit &&
        (images.length ? null : (
          <Camera waypoint={waypoint} getImagesWP={getImagesWP} />
        ))}
      <Box>
        {images.map((image) => (
          <li className='image-list' key={`${image.id}`}>
            <div className='image-container'>
              <img src={`/api/images/${image.largeImg}`} />
              {edit && (
                <Button
                  className='delete-button'
                  id='delete-image'
                  variant='contained'
                  size='small'
                  type='submit'
                  color='error'
                  fullWidth={false}
                  onClick={(e) => {
                    e.preventDefault();
                    deleteImage(image.id);
                    handleClick();
                  }}
                >
                  <DeleteIcon />
                </Button>
              )}
            </div>
          </li>
        ))}
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message='Image deleted'
        action={action}
      />
    </div>
  );
};

export default Gallery;
