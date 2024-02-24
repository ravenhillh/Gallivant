import React, { useState } from 'react';
import axios from 'axios';

import {
  Box,
  Button,
  CancelIcon,
  TextField,
  Rating,
  SendIcon,
  Typography
} from '../utils/material';

// how to render only on tours you did not create?
// add camera access eventually


// a Tour can have many reviews
// create review will take down tour id from props


const CreateReview = ({ tourId, handleClose }) => {
  // console.log(typeof tourId);
  // rating value
  const [value, setValue] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const postReview = () => {
    axios.post('/reviews/post', {
      feedback: reviewText,
      rating: value,
      id_tour: tourId
    })
    .catch(err => console.error('Axios post error ', err));
  };

  return (
    <div className="create-review">
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
        <Typography component="legend">Rate This Tour</Typography>
        <Rating
          name="no-value"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
        <br />
        <TextField
          id="outlined-multiline-static"
          // label="Multiline"
          multiline
          rows={4}
          placeholder="Leave a Review"
          onChange={(event) => {
            event.preventDefault();
            setReviewText(event.target.value);
            // console.log(event.target.value);
          }}
        />
        <br />
        <Button 
          variant="contained" 
          endIcon={<SendIcon />}
          onClick={() => {
            postReview();
            handleClose();
          }}
        >
          Send
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
    </div>
  );

};

export default CreateReview;