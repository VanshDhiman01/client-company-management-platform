import { apiRequest } from './apiClient';

/**
 * Task Management Service
 * Pre-configured for REST endpoints: /api/tasks
 */
export const taskService = {
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/tasks${query ? `?${query}` : ''}`);
  },

  async getTasksByProject(projectId) {
    return apiRequest(`/projects/${projectId}/tasks`);
  },

  async createTask(taskData) {
    return apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  async updateTaskProgress(taskId, progress, workNote, fileName) {
    return apiRequest(`/tasks/${taskId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress, workNote, fileName })
    });
  },

  async reviewTask(taskId, action, reviewNotes) {
    return apiRequest(`/tasks/${taskId}/review`, {
      method: 'POST',
      body: JSON.stringify({ action, reviewNotes })
    });
  },

  async assignDeveloper(taskId, developerId) {
    return apiRequest(`/tasks/${taskId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ developerId })
    });
  },

  async deleteTask(taskId) {
    return apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }
};
