import { redirect } from 'react-router-dom';
import axios from 'axios';

export default async function requireAuth() {
  const isLoggedIn = await axios('/auth/client');

  if (!isLoggedIn.data.verify) {
    throw redirect('/login');
  }
  return isLoggedIn.data.user.id;
}
