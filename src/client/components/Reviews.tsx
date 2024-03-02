import React, { useState, lazy, Suspense, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import axios from 'axios';
import { List } from '../utils/material';

const Review = lazy(() => import('./Review'));



const Reviews = ({ id, open }) => {
  // const { id } = useParams();
  // need review id not tour id...
  const [reviews, setReviews] = useState([]);

  const getReviews = () => {
    axios.get(`/reviews/tour/${id}`)
      .then(({data}) => {
        setReviews(data);
      })
      .catch((err) => console.error('Could not GET reviews ', err));
  };


  useEffect(() => {
    getReviews();
  }, [open]);

  // console.log(average);
  return (
    <div>
      <h2>Reviews</h2>
      <List>
      { reviews &&
        reviews.map((review, index) => (
          <li key={index}>
            <Suspense fallback={<>Loading...</>}>
              <Review 
                review={review} 
                getReviews={getReviews} 
              />
            </Suspense>
          </li>
        ))
      }
      </List>
    </div>
  );
};

export default Reviews;