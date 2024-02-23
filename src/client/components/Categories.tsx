import React from 'react';
import { Button } from '../utils/material';
import { useNavigate } from 'react-router-dom';


// buttons will have icons
// buttons will link to category page
// findall by category name, pass down in props

const Categories = () => {
  const navigate = useNavigate();

  const names = ['entertainment', 'nightlife', 'food & drink', 'culture & history', 'etc...'];
  // can map over names instead
  
  return (
    <div>
      <Button
        onClick={() => {
          navigate(`/categories/${names[0]}`);
        }}
      >Entertainment</Button>
      <Button
        onClick={() => {
          navigate(`/categories/${names[1]}`);
        }}
      >Nightlife</Button>
      <Button
        onClick={() => {
          navigate(`/categories/${names[2]}`);
        }}
      >Nightlife</Button>
      <Button
        onClick={() => {
          navigate(`/categories/${names[3]}`);
        }}
      >Culture & History</Button>
      <Button
        onClick={() => {
          navigate(`/categories/${names[4]}`);
        }}
      >Etc...</Button>
    </div>
  );
};

export default Categories;