import apiClient from './apiClient';

export const grievanceApi = {
  getGrievances: (params) => apiClient.get('/grievances', { params }),
  submitGrievance: (data) => apiClient.post('/grievances', data),
  updateGrievance: (id, data) => apiClient.put(`/grievances/${id}`, data)
};

export default grievanceApi;
