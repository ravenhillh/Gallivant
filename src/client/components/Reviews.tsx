import React, { useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { Button } from '../utils/material';

const Review = lazy(() => import('./Review'));

// grab review objects from db
// will need to grab user name from db as well
// take timestamp createdAt

// review rating will be average of all reviews
// how to get user id 
// findAll where if_tour = x
// username where id =
// maybe in individual review component
// call get reviews in Reviews
// call get username in Review

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  const getReviews = () => {
    axios.get('/reviews/all')
      .then(({data}) => {
        // console.log('reviews ', data);
        setReviews(data);
      })
      .catch((err) => console.error('Could not GET reviews ', err));
  };

  return (
    <div>
      <Button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          getReviews();
        }}
      >
        Get reviews
      </Button>
      <ul>
      { reviews && 
        reviews.map((review) => (
          <li><Review review={review} key={review.id}/></li>
        ))
      }
      </ul>
    </div>
  );
};

export default Reviews;