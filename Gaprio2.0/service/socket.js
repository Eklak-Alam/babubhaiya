import { io } from 'socket.io-client';

// IMPORTANT: Replace with your server's IP address in development,
// or your deployed server URL in production.
const SERVER_URL = 'http://localhost:5001';

const socket = io(SERVER_URL, {
  autoConnect: false // We will connect manually when the user logs in.
});

export default socket;