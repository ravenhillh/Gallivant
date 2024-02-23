import React from 'react';
import { Button } from '../utils/material';
import { useNavigate } from 'react-router-dom';


// buttons will have icons
// buttons will link to category page
//

const Categories = () => {
  const navigate = useNavigate();

  const names = ['entertainment'];

  return (
    <div>
      <Button>Food & Drink</Button>
      <Button
        name="entertainment"
        onClick={() => {
          navigate(`/categories/${names[0]}`);
        }}
      >Entertainment</Button>
      <Button>Nightlife</Button>
      <Button>Culture & History</Button>
      <Button>Etc...</Button>
    </div>
  );
};

export default Categories;