import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Review = ({review, edit}) => {
  // set username on review
  const [username, setUsername] = useState('');

  // get user data to set username
  const getUser = () => {
    axios.get(`/user/${review.id_user}`)
      .then(({data}) => {
        setUsername(data.username);
      })
      .catch(err => console.error('Could not get User data ', err));
  };

  // delete review
  const deleteReview = () => {
    axios.delete(`/reviews/${review.id}`)
      .then(() => console.log('deleted'))
      .catch(err => console.error('Could not DELETE review ', err));
  };

  // call getUser on mount
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <h3>Review</h3>
      <p>{username}</p>
      <p>{review.feedback}</p>
    </div>
  );
};

export default Review;