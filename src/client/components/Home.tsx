import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Redirects here (Home) after Successful Login.</h1>
      <form action='/logout' method='post'>
        <button type='submit'>Sign out</button>
      </form>
    </div>
    
  );
};

export default Home;
