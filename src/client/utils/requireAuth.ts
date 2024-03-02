import { redirect } from 'react-router-dom';
import axios from 'axios';

const requireAuth = async () => {
  const isLoggedIn = await axios('/auth/client');

  if (!isLoggedIn.data.verify) {
    throw redirect('/login');
  }
  return isLoggedIn.data.user;
};

const nonRedirectUser = async () => {
  const isLoggedIn = await axios('/auth/client');
  if (isLoggedIn.data.user) {
    return isLoggedIn.data.user;
  }
  return null;
};

export { requireAuth, nonRedirectUser };
