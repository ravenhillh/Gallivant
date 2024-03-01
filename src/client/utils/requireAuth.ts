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
  return isLoggedIn.data.user;
}

export { requireAuth, nonRedirectUser };
