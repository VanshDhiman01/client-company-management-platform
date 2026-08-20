import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api';
const SOCKET_URL = API_BASE_URL.replace(/\/api$/, '') || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : `${window.location.protocol}//${window.location.hostname}:5000`);

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });
  }
  return socket;
};

export const joinConversation = (conversationId) => {
  const s = initSocket();
  if (s && conversationId) {
    s.emit('join_conversation', conversationId);
  }
};

export const leaveConversation = (conversationId) => {
  const s = initSocket();
  if (s && conversationId) {
    s.emit('leave_conversation', conversationId);
  }
};

export const subscribeToNewMessages = (callback) => {
  const s = initSocket();
  if (s) {
    s.off('new_message');
    s.on('new_message', (message) => {
      callback(message);
    });
  }
};

export const unsubscribeFromNewMessages = () => {
  const s = initSocket();
  if (s) {
    s.off('new_message');
  }
};
