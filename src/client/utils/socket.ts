import { io } from 'socket.io-client';

//"undefined" means the URL will be computed from the `window.location` object
const URL = window.location.origin;
const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  path: '/socket/'
});

export default socket;
