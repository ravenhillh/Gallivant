import React, { useState } from 'react';
import axios from 'axios';

import {
  Box,
  Button,
  TextField,
  Rating,
  SendIcon,
  Typography
} from '../utils/material';

// how to render only on tours you did not create?
// add camera access eventually


// a Tour can have many reviews
// a review can have only one tour
// if a tour gets deleted, all reviews must be deleted (cascade)
// a review could be deleted, but would not affect tours


const CreateReview = () => {
  // rating value
  const [value, setValue] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const postReview = () => {
    axios.post('/reviews/post', {
      feedback: reviewText,
      rating: value
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
          }}
        >
          Send
        </Button>
        </div>
      </Box>
    </div>
  );

};

export default CreateReview;