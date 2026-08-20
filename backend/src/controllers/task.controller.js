import * as taskService from '../services/task.service.js';

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks(req.user);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const updateTaskProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { progress, message, workNote, fileName } = req.body;
    const devId = req.user?.id || 'dev-1';
    const devName = req.user?.name || 'Developer';

    const updated = await taskService.updateTaskProgress(id, progress, devId, devName, message || workNote, fileName);
    res.status(200).json({ success: true, task: updated });
  } catch (error) {
    next(error);
  }
};

export const reviewTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, internalReviewNotes, reviewNotes } = req.body;
    const updated = await taskService.reviewTask(id, action, internalReviewNotes || reviewNotes);
    res.status(200).json({ success: true, task: updated });
  } catch (error) {
    next(error);
  }
};

export const assignDeveloper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { developerId, assignedDeveloperId } = req.body;
    const updated = await taskService.assignDeveloper(id, developerId || assignedDeveloperId);
    res.status(200).json({ success: true, task: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

