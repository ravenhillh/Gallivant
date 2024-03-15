import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ExploreIcon,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
} from '../utils/material';

const TourLink = ({ tour }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);

  const getTourRating = (id) => {
    axios
      .get(`/reviews/rating/${id}`)
      .then(({ data }) => {
        setRating(data);
      })
      .catch((err) => console.error('Could not Get AVG rating ', err));
  };

  useEffect(() => {
    getTourRating(tour.id);
  }, []);

  return (
    <ListItem>
      <ListItemIcon
        onClick={() => navigate(`/tour/${tour.id}`)}
        sx={{ cursor: 'pointer', color: '#2196f3', minWidth: '33px' }}
      >
        <ExploreIcon />
      </ListItemIcon>
      <ListItemText
        primary={<Link 
          to={`/tour/${tour.id}`}
          style={{ color: '#1F1F29', textDecoration: 'none' }}
          >{tour.tourName}</Link>}
        secondary={tour.description}
        sx={{ maxWidth: '150px' }}
      />
      <br />
      {rating && (
        <div>
          <Rating
            name='read-only'
            value={rating}
            precision={0.25}
            size="small"
            readOnly
          />
        </div>
      )}
    </ListItem>
  );
};

export default TourLink;
