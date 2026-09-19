import apiClient from './apiClient';

export const projectApi = {
  getProjects: (params) => apiClient.get('/projects', { params }),
  getProjectById: (id) => apiClient.get(`/projects/${id}`),
  createProject: (projectData) => apiClient.post('/projects', projectData),
  updateMilestone: (id, milestoneData) => apiClient.put(`/projects/${id}/milestone`, milestoneData)
};

export default projectApi;
