import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authenticateToken, taskController.getTasks);
router.get('/:id', authenticateToken, taskController.getTaskById);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), taskController.createTask);
router.patch('/:id/progress', authenticateToken, authorizeRoles('ADMIN', 'DEVELOPER'), taskController.updateTaskProgress);
router.post('/:id/progress', authenticateToken, authorizeRoles('ADMIN', 'DEVELOPER'), taskController.updateTaskProgress);
router.patch('/:id/review', authenticateToken, authorizeRoles('ADMIN'), taskController.reviewTask);
router.post('/:id/review', authenticateToken, authorizeRoles('ADMIN'), taskController.reviewTask);
router.patch('/:id/assign', authenticateToken, authorizeRoles('ADMIN'), taskController.assignDeveloper);
router.post('/:id/assign', authenticateToken, authorizeRoles('ADMIN'), taskController.assignDeveloper);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), taskController.deleteTask);

export default router;
