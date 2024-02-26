import React from 'react';
import { useState, useRef, Fragment } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Button, 
  AddAPhotoIcon, 
  CameraAltIcon,
  CloseIcon,
  IconButton,
  Snackbar
 } from '../utils/material';

// camera will have to accept props to access other ids like waypoint, etc
// may need props interface
function Camera(props): JSX.Element {
  const { waypoint, getImagesWP } = props;
  // image is a 'preview', before image is selected to be POSTED to database
  const [image, setImage] = useState('');
  const [resizedImg, setResizedImg] = useState('');
  const [open, setOpen] = useState(false);
  // input Ref's for cameras
  const envInputRef = useRef<HTMLInputElement>(null);
  // const selfieInputRef = useRef<HTMLInputElement>(null);

  const resizePhoto = (image) => {
    const maxSizeInMB = 4;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    let dataURL: string;

    const img = new Image();
    img.src = image;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;
      const newWidth = Math.sqrt(maxSizeInBytes * aspectRatio);
      const newHeight = Math.sqrt(maxSizeInBytes / aspectRatio);
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx!.drawImage(img, 0, 0, newWidth, newHeight);
      const quality = 0.8;
      dataURL = canvas.toDataURL('image/jpeg', quality);
      // set resized image
      setResizedImg(dataURL);
    };
  };

  // post resized image to db
  const postDb = (data) => {
    axios
      .post('/images/post', {
        key: data.Key,
        joinId: waypoint.id,
      })
      .catch((err) => console.error('axios post err ', err));
  };

  // axios post request to s3
  const postBucket = (name: string, imageData: string) => {
    axios
      .post('/api/images', {
        imageName: name,
        base64: imageData,
        // tour/waypoint/etc id, coming from props
      })
      .then(({ data }) => {
        // console.log('ax ', data);
        postDb(data);
      })
      .catch((err) => {
        console.error('Axios POST error ', err);
      });
  };

  // reads image file and converts to base64
  const sendPic = (e: React.ChangeEvent<HTMLInputElement>) => {
    // access image file from file picker
    const selectedFile = e.target.files![0];

    // File Reader to read selectedFile as base 64
    const reader = new FileReader();

    if (selectedFile) {
      // read result as data url
      reader.readAsDataURL(selectedFile);
    }

    // setState and generate dataURL
    reader.addEventListener(
      'load',
      () => {
        setImage(reader.result as string);
        // call resize here
        resizePhoto(reader.result);
      },
      false
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // prevent default to stop loop
    e.preventDefault();
    sendPic(e);
  };

  const handleClick = () => {
    // set unique name with uuid to be used as image Key, for gallery view
    const name = uuidv4();
    postBucket(name, resizedImg);
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
      <br />
      <input
        type='file'
        ref={envInputRef}
        id='environment'
        style={{ display: 'none' }}
        // capture='environment'
        accept='image/*'
        onChange={handleChange}
      />
      {
        image ?
        <Button onClick={handleClick}>
          <AddAPhotoIcon /> Save Photo
        </Button> :
        <Button type='button' onClick={() => envInputRef.current!.click()}>
          <CameraAltIcon /> Take Photo
        </Button>
      }
      {/* <Button type='button' onClick={() => envInputRef.current!.click()}>
        <CameraAltIcon /> Take Photo
      </Button> */}
      <br />
      <img src={image} style={{ width: '250px', height: 'auto' }} />
      {/* <Button onClick={handleClick}>
        <AddAPhotoIcon /> Save Photo
      </Button> */}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Image saved"
        action={action}
      />
    </div>
  );
}

export default Camera;
