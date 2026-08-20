import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach io to Express app for global availability in services/controllers
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join_conversation', (conversationId) => {
    if (conversationId) {
      const room = `conversation:${conversationId}`;
      socket.join(room);
    }
  });

  socket.on('leave_conversation', (conversationId) => {
    if (conversationId) {
      const room = `conversation:${conversationId}`;
      socket.leave(room);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Orange Mantra Backend Server running on http://localhost:${PORT}`);
});

export { io };
