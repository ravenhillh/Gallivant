import React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Login() {
  return (
    <div>
      <Typography variant='h2'>Login to Gallivant</Typography>
      <Button variant="contained" id='login'>
        <a className='button google' href='/auth/google'>
          Sign in with Google
        </a>
      </Button>
    </div>
  );
}

export default Login;
