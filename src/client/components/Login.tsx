import React from 'react';

function Login() {
  return (
    <div>
      <h1>Temporary Login Page</h1>
      <button id='login'>
        <a className='button google' href='/auth/google'>
          Sign in with Google
        </a>
      </button>
      <form action='/logout' method='post'>
        <button type='submit'>Sign out</button>
      </form>
    </div>
  );
}

export default Login;
