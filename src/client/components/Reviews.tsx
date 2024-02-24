import React, { useState, lazy, Suspense, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import axios from 'axios';
import { List, Rating } from '../utils/material';

const Review = lazy(() => import('./Review'));



const Reviews = ({ id, edit }) => {
  // const { id } = useParams();
  // need review id not tour id...
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState<number>(0);

  const getReviews = () => {
    axios.get(`/reviews/tour/${id}`)
      .then(({data}) => {
        setReviews(data);
      })
      .then(() => getAverage())
      .catch((err) => console.error('Could not GET reviews ', err));
  };

  const getAverage = () => {
    let total = 0;
    let count = 0;
    reviews.forEach((review:object) => {
      total += review['rating'];
      count++;
    });
    setAverage(total/count);

  };

  useEffect(() => {
    getReviews();
  }, []);

  // console.log(average);
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
      <h2>Reviews</h2>
      <Rating
        name="read-only"
        value={average}
        precision={0.25}
        readOnly
      />
      <List>
      { reviews &&
        reviews.map((review, index) => (
          <li key={index}>
            <Suspense fallback={<>Loading...</>}>
              <Review review={review} edit={edit} getReviews={getReviews}/>
            </Suspense>
          </li>
        ))
      }
      </List>
    </div>
  );
};

export default Reviews;