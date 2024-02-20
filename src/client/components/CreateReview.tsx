import React, { useState } from 'react';

import {
  Box,
  TextField,
  Rating,
  Typography
} from '../utils/material';

// will need an input field, with maximum text length
// material text field
// material ui rating / hover
// will need a rating (1 to 5 at first), then star rating
// will need user data
// though you will only be able to leave reviews on other tours
// add camera access

// will open in a modal
//Layout: Name of tour at top
// X top right corner to close out of modal
// Star rating
// then text input box
// post review button at bottom, send to db and close modal


// a Tour can have many reviews
// a review can have only one tour
// if a tour gets deleted, all reviews must be deleted (cascade)
// a review could be deleted, but would not affect tours
const CreateReview = () => {
  // rating value
  const [value, setValue] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState<string>('');
  return (
    <div className="create-review">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
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
        </div>
      </Box>
    </div>
  );

};

export default CreateReview;