import * as projectService from '../services/project.service.js';
import { getUserById } from '../services/auth.service.js';

export const getProjectRequests = async (req, res, next) => {
  try {
    const requests = await projectService.getAllProjectRequests(req.user);
    res.status(200).json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

export const createProjectRequest = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Authenticated user not found' });
    }

    const requestData = {
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      companyName: user.companyName || 'Client Org',
      projectName: req.body.projectName,
      description: req.body.description,
      requirements: req.body.requirements,
      expectedDeadline: req.body.expectedDeadline,
      budget: req.body.budget
    };

    const request = await projectService.createProjectRequest(requestData);
    res.status(201).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

export const reviewProjectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const updated = await projectService.reviewProjectRequest(id, status, adminNotes);
    res.status(200).json({ success: true, request: updated });
  } catch (error) {
    next(error);
  }
};

export const acceptAndCreateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await projectService.acceptAndCreateProject(id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

