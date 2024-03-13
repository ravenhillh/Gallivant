import React from 'react';

import { Button, Link, RouteOutlinedIcon, Typography } from '../utils/material';

function Login() {
  return (
    <div className='log-container'>
      <div className='log'>
        <RouteOutlinedIcon sx={{ fontSize: '72px' }} />
        <Typography variant='h6'>login to</Typography>
        <Typography sx={{ padding: '10px' }} variant='h2'>
          gallivant
        </Typography>
        <Button sx={{ margin: '10px' }} variant='contained' id='login'>
          <Link
            className='button google'
            sx={{ color: 'white' }}
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
