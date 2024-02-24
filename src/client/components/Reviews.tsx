import React, { useState, lazy, Suspense, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import axios from 'axios';
// import { Button } from '../utils/material';

const Review = lazy(() => import('./Review'));



const Reviews = ({ id, edit }) => {
  // const { id } = useParams();
  // need review id not tour id...
  const [reviews, setReviews] = useState([]);

  const getReviews = () => {
    axios.get(`/reviews/tour/${id}`)
      .then(({data}) => {
        // console.log('reviews ', data);
        setReviews(data);
      })
      .catch((err) => console.error('Could not GET reviews ', err));
  };
  
  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div>
      {/* <Button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          getReviews();
        }}
      >
        Get reviews
      </Button> */}
      <ul>
      { reviews &&
        reviews.map((review, index) => (
          <li key={index}>
            <Suspense fallback={<>Loading...</>}>
              <Review review={review} edit={edit}/>
            </Suspense>
          </li>
        ))
      }
      </ul>
    </div>
  );
};

export default Reviews;