import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { requireAuth } from './../utils/requireAuth';
import {
  Box,
  Button,
  CancelIcon,
  Card,
  CardContent,
  CloseIcon,
  IconButton,
  Modal,
  Rating,
  RemoveCircleIcon,
  Snackbar,
  TextField } from '../utils/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Review = ({review, getReviews }) => {
  // set username on review
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState(review.feedback);
  const [rating, setRating] = useState(review.rating);
  const [open, setOpen] = useState(false);
  const [openSB, setOpenSB] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenSB = () => {
    setOpenSB(true);
  };

  const handleCloseSB = () => {
    setOpenSB(false);
    getReviews();
  };

  const getCurrentUser = async () => {
    const user = await requireAuth();
    setCurrentUserId(user.id);
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
      .catch(err => console.error('Could not DELETE review ', err));
  };

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSB}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  useEffect(() => {
    getUser();
    getReviews();
    getCurrentUser();
  }, [open]);


  return (
    <div>
    <Card>
      <CardContent>
      <Rating
        name="read-only"
        value={review.rating}
        readOnly
      />
      <p>{username}</p>
      <p>{review.feedback}</p>
      <p>{dayjs(review.createdAt).fromNow()}</p>
      {currentUserId === review.id_user? 
        <div>
        <Button
          id='delete-review'
          size='small'
          type='submit'
          fullWidth={false}
          onClick={(e) => {
            e.preventDefault();
            deleteReview();
            handleOpenSB();
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
            handleOpen();
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
                  handleClose();
                }}
              >
                Update Review
              </Button>
              <Button
                variant='outlined'
                size='small'
                color='secondary'
                startIcon={<CancelIcon />}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
        </div>
        : null
      }
      </CardContent>
    </Card>
      <Snackbar 
        open={openSB}
        autoHideDuration={5000}
        onClose={handleCloseSB}
        message="Review deleted"
        action={action}
      />
    </div>

  );
};

export default Review;