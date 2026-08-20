import { Router } from 'express';
import * as projectRequestController from '../controllers/projectRequest.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authenticateToken, projectRequestController.getProjectRequests);
router.post('/', authenticateToken, projectRequestController.createProjectRequest);
router.patch('/:id/review', authenticateToken, authorizeRoles('ADMIN'), projectRequestController.reviewProjectRequest);
router.post('/:id/review', authenticateToken, authorizeRoles('ADMIN'), projectRequestController.reviewProjectRequest);
router.post('/:id/accept-and-create', authenticateToken, authorizeRoles('ADMIN'), projectRequestController.acceptAndCreateProject);

export default router;

