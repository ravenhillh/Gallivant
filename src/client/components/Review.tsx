import React, { lazy, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { requireAuth } from './../utils/requireAuth';
import {
  Button,
  Card,
  CardContent,
  CloseIcon,
  EditIcon,
  IconButton,
  Rating,
  RemoveCircleIcon,
  Snackbar,
  TextField,
  Typography
 } from '../utils/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const CustomModal = lazy(() => import('./tourComponents/Modal'));

const Review = ({review, getReviews }) => {
  // state variables
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState(review.feedback);
  const [rating, setRating] = useState(review.rating);
  const [open, setOpen] = useState(false);
  const [openSB, setOpenSB] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>();

  // modal handlers
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    getReviews();
  };

  // snackbar handlers
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
    <div id="review">
      <Card sx={{ marginBottom: '0.5em'}}>
        <CardContent>
        <Typography variant="h6">{username}</Typography>
        <Rating
          name="read-only"
          value={review.rating}
          readOnly
        />
        <Typography 
          variant="caption" 
          display="block"
          sx={{ opacity: '0.5'}}
        >
          {dayjs(review.createdAt).fromNow()}
        </Typography>
        <Typography 
          variant="body1"
          sx={{ marginTop: '10px', marginBottom: '10px' }}
        >
          {review.feedback}
        </Typography>
        {currentUserId === review.id_user?
          <div>
          <Button
            id='delete-review'
            size='small'
            type='submit'
            fullWidth={false}
            sx={{ marginRight: '5px' }}
            onClick={(e) => {
              e.preventDefault();
              deleteReview();
              handleOpenSB();
            }}
          >
            <RemoveCircleIcon />&nbsp;Delete
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
            <EditIcon />&nbsp;Edit
          </Button>
          <CustomModal
            openModal={open}
            closeModal={handleClose}
            confirmButton={
              <Button
                id='edit-review'
                size='small'
                sx={{ marginRight: '10px '}}
                type='submit'
                variant="contained"
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
            }
          >
            <Typography sx={{ opacity: '0.5'}}>Edit Rating</Typography>
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
              sx={{ width: '100%' }}
              multiline
              rows={4}
              placeholder="Edit Your Review"
              margin="normal"
              onChange={(event) => {
                event.preventDefault();
                setFeedback(event.target.value);
              }}
            />
            <br />
          </CustomModal>
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