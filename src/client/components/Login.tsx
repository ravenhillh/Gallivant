import React from 'react';

function Login() {
  return (
    <div>
      <h1>Temporary Login Page</h1>
      <button id="login">
        <a className="button google" href="/login/federated/google">Sign in with Google</a>
      </button>
    </div>
  );
}

export default Login;
