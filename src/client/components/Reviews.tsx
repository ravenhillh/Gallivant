import React, { useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../utils/material';

const Review = lazy(() => import('./Review'));



const Reviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  const getReviews = () => {
    axios.get(`/reviews/tour/${id}`)
      .then(({data}) => {
        // console.log('reviews ', data);
        setReviews(data);
      })
      .catch((err) => console.error('Could not GET reviews ', err));
  };
  console.log(reviews);
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
        reviews.map((review, index) => (
          <li>
            <Suspense fallback={<>Loading...</>}>
              <Review review={review} key={index}/>
            </Suspense>
          </li>
        ))
      }
      </ul>
    </div>
  );
};

export default Reviews;