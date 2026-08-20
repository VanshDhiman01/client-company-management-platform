import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authenticateToken, projectController.getProjects);
router.get('/:id', authenticateToken, projectController.getProjectById);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), projectController.createProject);
router.patch('/:id', authenticateToken, authorizeRoles('ADMIN'), projectController.updateProject);

export default router;
