import React, { useEffect } from 'react';
import { Button } from '../utils/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const Categories = ({ categories, category, getTours }) => {
  const navigate = useNavigate();
  // const [category, setCategory] = useState('');

  // on click, render list of tours by category
  // const getToursByCat = () => {
  //   console.log(category);
  //   axios
  //     .get(category === 'all' ? '/db/tours/' : `/db/tours/${category}`)
  //     .then(({ data }) => {
  //       setTours(data);
  //     })
  //     .catch((err) => console.error('Failed to GET tours by category ', err));
  // };

  useEffect(() => {
    getTours();
  }, [category]);

  return (
    <div
      style={{
        padding: '0.5em',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
      <CatButton key='all' onClick={() => navigate('/tours/all')}>
        all
      </CatButton>
      {categories.map((category, i) => (
        <CatButton
          key={i}
          onClick={() => {
            navigate(`/tours/${category}`);
            // setCategory(category);
          }}
        >
          {category}
        </CatButton>
      ))}
      {/* { category && <Category category={category} setTours={setTours} /> } */}
    </div>
  );
};

export default Categories;
