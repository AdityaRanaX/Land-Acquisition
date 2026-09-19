import apiClient from './apiClient';

export const compensationApi = {
  calculate: (data) => apiClient.post('/compensation/calculate', data),
  simulate: (data) => apiClient.post('/compensation/simulate', data),
  getAwards: (params) => apiClient.get('/compensation', { params }),
  getById: (id) => apiClient.get(`/compensation/${id}`),
  createAward: (awardData) => apiClient.post('/compensation/award', awardData),
  updateStatus: (id, data) => apiClient.patch(`/compensation/${id}`, data)
};

export default compensationApi;
