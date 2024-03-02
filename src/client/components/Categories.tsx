import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../utils/material';
import { styled } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// const Category = lazy(() => import('./Category'));
const CatButton = styled(Button)({
  // boxShadow: 'none',
  // fontSize: 12,
  padding: '6px 12px',
  lineHeight: 1.5,
  '&:hover': {
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});


const Categories = ({categories, setTours}) => {
  // const navigate = useNavigate();
  const [category, setCategory] = useState('');

  // on click, render list of tours by category
  const getToursByCat = () => {
    axios.get(`/db/tours/${category}`)
      .then(({data}) => {
        setTours(data);
      })
      .catch(err => console.error('Failed to GET tours by category ', err));
  };

  useEffect(() => {
    getToursByCat();
  }, [category]);

  return (
    <div>
      {
        categories.map((category, i) => (
          <CatButton
            key={i}
            onClick={() => {
              // navigate(`/categories/${category}`);
              setCategory(category);
            }}
          >{category}</CatButton>
        ))
      }
      {/* { category && <Category category={category} setTours={setTours} /> } */}
    </div>
  );
};

export default Categories;