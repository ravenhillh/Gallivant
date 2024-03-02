import React from 'react';

import { 
  Button, 
  RouteOutlinedIcon,
  Typography } from '../utils/material';

function Login() {
  return (
    <div className="log">
          <RouteOutlinedIcon sx={{ fontSize: '72px'}}/>
          <Typography variant='h2'>Login to Gallivant</Typography>
          <Button variant='contained' id='login'>
             <a className='button google' href='/auth/google'>
            Sign in with Google
             </a>
          </Button>
    </div>
  );
}

export default Login;
