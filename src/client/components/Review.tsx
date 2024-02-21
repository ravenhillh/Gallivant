import React from 'react';

// get username 

const Review = ({review}) => {
  console.log(review);
  return (
    <div>
      <h3>Review</h3>
      <p>{review.feedback}</p>
    </div>
  );
};

export default Review;