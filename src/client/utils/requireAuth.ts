import { redirect } from 'react-router-dom';
import axios from 'axios';

export default async function requireAuth() {
  const isLoggedIn = await axios('/auth/client');

  if (!isLoggedIn.data) {
    throw redirect('/login');
  }
  return null;
}
