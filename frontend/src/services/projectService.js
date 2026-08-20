import { apiRequest } from './apiClient';

/**
 * Project and Project Request Service
 * Pre-configured for REST endpoints: /api/projects and /api/requests
 */
export const projectService = {
  // Projects
  async getProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/projects${query ? `?${query}` : ''}`);
  },

  async getProjectById(projectId) {
    return apiRequest(`/projects/${projectId}`);
  },

  async createProject(projectData) {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  async updateProject(projectId, updates) {
    return apiRequest(`/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  async postProjectUpdate(projectId, title, message) {
    return apiRequest(`/projects/${projectId}/updates`, {
      method: 'POST',
      body: JSON.stringify({ title, message })
    });
  },

  // Project Requests
  async getProjectRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/requests${query ? `?${query}` : ''}`);
  },

  async submitProjectRequest(requestData) {
    return apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  async reviewProjectRequest(requestId, status, adminNotes) {
    return apiRequest(`/requests/${requestId}/review`, {
      method: 'POST',
      body: JSON.stringify({ status, adminNotes })
    });
  },

  async acceptAndCreateProject(requestId) {
    return apiRequest(`/requests/${requestId}/accept-and-create`, {
      method: 'POST'
    });
  }
};
