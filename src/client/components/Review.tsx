import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Modal, Rating, RemoveCircleIcon, TextField } from '../utils/material';

const Review = ({review, edit}) => {
  // set username on review
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState(review.feedback);
  const [rating, setRating] = useState(review.rating);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // get user data to set username
  const getUser = () => {
    axios.get(`/user/${review.id_user}`)
      .then(({data}) => {
        setUsername(data.username);
      })
      .catch(err => console.error('Could not get User data ', err));
  };

  // update review
  const updateReview = () => {
    axios.put(`/reviews/${review.id}`, {
      feedback,
      rating
    })
      .then()
      .catch(err => console.error('Review did not update ', err));
  };

  // delete review
  const deleteReview = () => {
    axios.delete(`/reviews/${review.id}`)
      .then(() => console.log('deleted'))
      .catch(err => console.error('Could not DELETE review ', err));
  };

  // call getUser on mount
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <h3>Review</h3>
      <p>{username}</p>
      <p>{review.feedback}</p>
      {edit && 
        <div>
        <Button
          id='delete-review'
          size='small'
          type='submit'
          fullWidth={false}
          onClick={(e) => {
            e.preventDefault();
            deleteReview();
          }}
        >
          <RemoveCircleIcon />
        </Button>
        <Button
          id='edit-review'
          size='small'
          type='submit'
          fullWidth={false}
          onClick={(e) => {
            e.preventDefault();
            // open edit modal
            handleOpen();
            // deleteReview();
          }}
        >
          Edit Review
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              border: 2,
              bgcolor: 'white'
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <Rating
              name="no-value"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              />
              <br />
              <TextField
                id="outlined-multiline-static"
                // label="Multiline"
                multiline
                rows={4}
                placeholder="Edit Your Review"
                onChange={(event) => {
                  event.preventDefault();
                  setFeedback(event.target.value);
                  // console.log(event.target.value);
                }}
              />
              <Button
                id='edit-review'
                size='small'
                type='submit'
                fullWidth={false}
                onClick={(e) => {
                  e.preventDefault();
                  // open edit modal
                  updateReview();
                }}
              >
                Update Review
              </Button>
            </div>
          </Box>
        </Modal>
        </div>
      }
    </div>
  );
};

export default Review;