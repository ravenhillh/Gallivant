import React from 'react';

import { Button, Link, RouteOutlinedIcon, Typography } from '../utils/material';

function Login() {
  return (
    <div className='log-container'>
      <div className='log'>
        {/* <RouteOutlinedIcon sx={{ fontSize: '72px' }} /> */}
        <img 
        src="https://res.cloudinary.com/dsxmv5yjt/image/upload/v1710795733/galliguy_lxo7yd.png"
        width="50%"
        height="auto"
        alt="logo"
        />
        {/* <Typography variant='h6'>login to</Typography> */}
        <Typography sx={{ padding: '10px' }} variant='h2'>
          gallivant
        </Typography>
        <Button sx={{ margin: '10px' }} variant='contained' id='login'>
          <Link
            className='button google'
            sx={{ color: '#e5e1e1' }}
            href='/auth/google'
            underline='none'
          >
            Sign in with Google
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Login;
