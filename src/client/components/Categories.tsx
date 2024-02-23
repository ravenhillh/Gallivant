import React from 'react';
import { Button } from '../utils/material';
import { useNavigate } from 'react-router-dom';


// buttons will have icons
// buttons will link to category page
// findall by category name, pass down in props

const Categories = ({categories}) => {
  const navigate = useNavigate();

  // const names = ['entertainment', 'nightlife', 'food & drink', 'culture & history', 'etc...'];

  return (
    <div>
      {
        categories.map((category, i) => (
          <Button
            key={i}
            onClick={() => {
              navigate(`/categories/${category}`);
            }}
          >{category}</Button>
        ))
      }
    </div>
  );
};

export default Categories;