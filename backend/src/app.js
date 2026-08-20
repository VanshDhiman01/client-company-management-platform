import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import projectRequestRoutes from './routes/projectRequest.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import messageRoutes from './routes/message.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Orange Mantra Backend API is running smoothly' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', projectRequestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
